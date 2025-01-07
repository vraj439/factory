import DAL from '.';
import { ICreateQuoteRequestDto } from '../../types/dto/quote';

export class Quotes {
  dal: DAL;

  constructor(dal: any) {
    this.dal = dal;
  }

  getQuotes = async (currentPage, size) => {
    const response = await this.dal.get(
      `/api/quote?page=${currentPage}&size=${size}`
    );
    return response.data;
  };
  getQuote = async (quoteId: string) => {
    const response = await this.dal.get(
      `/api/quote/${quoteId}`
    );
    return response.data;
  };

  createQuote = async (quoteDto: ICreateQuoteRequestDto) => {
    const response = await this.dal.post('api/quote', quoteDto);
    return response.data;
  };

  addExistingItemsToQuote = async (quoteItem) => {
    const response = await this.dal.post('api/quote-item-config', quoteItem);
    return response.data;
  };

  updateQuote = async (quoteId: string, quoteDto: Partial<ICreateQuoteRequestDto>) => {
    const response = await this.dal.put(`api/quote/${quoteId}`, quoteDto);
    return response.data;
  };
}
