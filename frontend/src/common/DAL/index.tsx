import axios, { AxiosHeaders, AxiosRequestConfig } from 'axios';
import qs from 'qs';
import Registration from './Registration';
import UserAuth from './UserAuth';
import { Items } from './Items';
import { Quotes } from './Quotes';
import { Files } from './Files';
import { Address } from './Address';

class DAL {
  baseUrl: string;
  brandCode: string;
  domainName: string;
  cookieName: string;
  cookieTimeout: number;
  loginUrl: string;
  apiToken: string = '';
  headers: AxiosRequestConfig = {};
  registrationAccess: Registration;
  userAuth: UserAuth;
  items: Items;
  quotes: Quotes;
  files: Files;
  address: Address;

  constructor(url: string) {
    this.baseUrl = url;
    this.registrationAccess = new Registration(this as any);
    this.userAuth = new UserAuth(this as any);
    this.items = new Items(this);
    this.quotes = new Quotes(this);
    this.files = new Files(this);
    this.address = new Address(this);
    this.setHeaders();
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  setHeaders() {
    const token = localStorage.getItem('access_token'); // Get the token from local storage
    this.headers = {
      Authorization: `Bearer ${token}`
    } as AxiosRequestConfig;
  }

  get(pathURL: string, data: unknown = []) {
    return axios.get(this.baseUrl + '/' + pathURL, {
      withCredentials: true,
      headers: this.headers as AxiosHeaders,
      params: data,
      paramsSerializer: (params) => {
        return qs.stringify(params, { arrayFormat: 'brackets' });
      }
    });
  }

  post(pathURL: string, data: unknown, headers?: any) {
    return axios.post(this.baseUrl + '/' + pathURL, data, {
      withCredentials: true,
      headers: {...this.headers as AxiosHeaders, ...headers}
    });
  }

  put(pathURL: string, data?: unknown) {
    return axios.put(this.baseUrl + '/' + pathURL, data, {
      withCredentials: true,
      headers: this.headers as AxiosHeaders
    });
  }

  patch(pathURL: string, data: unknown) {
    return axios.patch(this.baseUrl + '/' + pathURL, data, {
      withCredentials: true,
      headers: this.headers as AxiosHeaders
    });
  }

  delete(pathURL: string, data?: unknown) {
    return axios.delete(this.baseUrl + '/' + pathURL, {
      data,
      headers: {
        ...this.headers.headers,
        withCredentials: true
      }
    });
  }
}

export default DAL;
