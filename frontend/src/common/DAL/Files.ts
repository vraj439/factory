import DAL from '.';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { IFileUploadResponseDto } from '../../types/dto/files';

export class Files {
  dal: DAL;

  constructor(dal: any) {
    this.dal = dal;
  }

  upload = async (data): Promise<IFileUploadResponseDto> => {
    const headers: Partial<AxiosHeaders> = {
      'Content-Type': 'multipart/form-data'
    };
    const response: AxiosResponse<IFileUploadResponseDto> = await this.dal.post(`api/user-cad-file`, data, headers);
    return response.data as IFileUploadResponseDto;
  };
}
