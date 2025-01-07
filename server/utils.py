import requests
import urllib.parse
import base64
import os
import boto3


def get_ssm_parameter(name, with_decryption=True):
    """Fetch a parameter from AWS SSM Parameter Store."""
    # Check if the environment is production
    flask_env = os.getenv('FLASK_ENV', 'development')
    if flask_env != 'production':
        # Return an empty string if not in production
        return ''
    
    ssm = boto3.client('ssm', region_name=os.getenv('AWS_DEFAULT_REGION', 'us-east-1'))
    try:
        response = ssm.get_parameter(Name=name, WithDecryption=with_decryption)
        return response['Parameter']['Value']
    except Exception as e:
        raise RuntimeError(f"Failed to fetch SSM parameter {name}: {e}")


def get_access_token():
    url = 'https://developer.api.autodesk.com/authentication/v2/token'
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    data = {
        'client_id': os.getenv('AD_CLIENT_ID'),
        'client_secret': os.getenv('AD_CLIENT_SECRET'),
        'grant_type': 'client_credentials',
        'scope': os.getenv('AD_SCOPE'),
    }
    try:
        response = requests.post(url, headers=headers, data=data)
        response.raise_for_status()
        return response.json()['access_token']
    except requests.exceptions.RequestException as e:
        print(f"Error obtaining Autodesk token: {e}")
        raise

def check_bucket_exists(access_token, bucket_key):
    url = f'https://developer.api.autodesk.com/oss/v2/buckets/{bucket_key}/details'
    headers = {'Authorization': f'Bearer {access_token}'}
    response = requests.get(url, headers=headers)
    return response.status_code == 200

def create_bucket(access_token, bucket_key, bucket_name):
    url = 'https://developer.api.autodesk.com/oss/v2/buckets'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }
    data = {'bucketKey': bucket_key, 'policyKey': 'transient', 'name': bucket_name}
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating bucket: {e}")
        raise

def get_signed_s3_upload_url(access_token, bucket_key, object_name):
    url = f'https://developer.api.autodesk.com/oss/v2/buckets/{bucket_key}/objects/{object_name}/signeds3upload'
    headers = {'Authorization': f'Bearer {access_token}'}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error getting signed S3 upload URL: {e}")
        raise

def complete_multipart_upload(access_token, bucket_key, object_name, file_size, upload_key):
    encoded_bucket_key = urllib.parse.quote(bucket_key)
    encoded_object_name = urllib.parse.quote(object_name)
    url = f'https://developer.api.autodesk.com/oss/v2/buckets/{encoded_bucket_key}/objects/{encoded_object_name}/signeds3upload'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    data = {'size': file_size, 'uploadKey': upload_key, 'policyKey': 'transient'}
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error completing multipart upload: {e}")
        raise

def read_from_oss(access_token, bucket_key, object_key):
    read_url = f'https://developer.api.autodesk.com/oss/v2/buckets/{bucket_key}/objects/{object_key}'

    headers = {
        'Authorization': f'Bearer {access_token}',
    }

    response = requests.get(read_url, headers=headers)

    if response.status_code == 200:
        return response.content  # You can choose to return the file contents if necessary
    else:
        print(f"Failed to read file: {response.status_code} - {response.text}")
        return None

def get_cad_metadata(access_token, file_urn):
    autodesk_url = f"https://developer.api.autodesk.com/modelderivative/v2/designdata/" + file_urn + "/metadata/"
    headers = {'Authorization': f'Bearer {access_token}'}
    params = {'url': file_urn}

    response = requests.get(autodesk_url, headers=headers, params=params)
    response.raise_for_status()  # Raise an error for bad responses
    return response.json()

def translate_file(access_token, object_id):
    url = 'https://developer.api.autodesk.com/modelderivative/v2/designdata/job'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    data = {
        "input": {
            "urn": base64.b64encode(object_id.encode()).decode('utf-8')
        },
        "output": {
            "formats": [
                {
                    "type": "svf",
                    "views": ["3d"]
                }
            ]
        }
    }
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()

def get_model_hierarchy(access_token, file_urn, guid):
    url = f"https://developer.api.autodesk.com/modelderivative/v2/designdata/{file_urn}/metadata/{guid}"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    print(response)
    response.raise_for_status()
    return response.json()

def get_properties(access_token, file_urn, guid):
    url = f"https://developer.api.autodesk.com/modelderivative/v2/designdata/{file_urn}/metadata/{guid}/properties"
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    return response.json()

def generate_thumbnail(file):
    # Convert the STP file to an image (e.g., PNG or JPG)
    # This may involve using CAD libraries or external tools
    thumbnail_path = "/tmp/thumbnail.png"  # Example path
    # Generate the thumbnail
    return thumbnail_path

def upload_to_s3(file_path):
    s3 = boto3.client('s3')
    bucket_name = "your-thumbnail-bucket"
    object_name = file_path.split('/')[-1]
    s3.upload_file(file_path, bucket_name, object_name)
    return f"https://{bucket_name}.s3.amazonaws.com/{object_name}"