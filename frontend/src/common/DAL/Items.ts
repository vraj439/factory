import DAL from '.';
import { ICreateItemResponseDto } from '../../types/dto/item';
import { AxiosResponse } from 'axios';

export class Items {
  dal: DAL;

  constructor(dal: any) {
    this.dal = dal;
  }

  getItems = async (currentPage, size) => {
    const response = await this.dal.get(
      `api/item?page=${currentPage}&size=${size}`
    );
    return response.data;
  };
  createItem = async (itemDto): Promise<ICreateItemResponseDto> => {
    const response: AxiosResponse<ICreateItemResponseDto> = await this.dal.post(
      'api/item',
      itemDto
    );
    return response.data;
  };

  getQuoteItems = async (quoteId: string) => {
    const response = await this.dal.get(`api/item/quote/${quoteId}`);
    return response.data;
  };
}
