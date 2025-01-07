export interface IFileUploadResponseDto {
  message: string;
  data: {
    bucketKey: string;
    objectId: string;
    objectKey: string;
    size: number;
    contentType: string;
    location: string;
  },
  file_id: string;
}
