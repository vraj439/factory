import DAL from '.';
import { ICreateQuoteRequestDto } from '../../types/dto/quote';
import { IAddress } from '../../types/interface/address';
import { AxiosResponse } from 'axios';
import { IPaginationResponse } from '../../types/dto/common';
import { IAddressDto, ICreateAddressRequestDto } from '../../types/dto/address';

export class Address {
  dal: DAL;

  constructor(dal: any) {
    this.dal = dal;
  }

  getAddresses = async (page: number = 1, size: number = 10): Promise<IPaginationResponse<IAddress>> => {
    const response: AxiosResponse<IPaginationResponse<IAddressDto>> = await this.dal.get(`api/user-address?page=${page}&size=${size}`);
    const data: IPaginationResponse<IAddress> = {
      ...response.data,
      items: response.data.items.map((address: IAddressDto) => this.makeAddressState(address))
    }
    return data;
  };

  createAddress = async (payload: ICreateAddressRequestDto): Promise<IAddress> => {
    const response: AxiosResponse<IAddressDto> = await this.dal.post('api/user-address', payload);
    return this.makeAddressState(response.data);
  };

  private makeAddressState(address: IAddressDto): IAddress {
    const item: IAddress = {
      id: address.id,
      title: '', //set it when backend provides
      line1: address.address_line1,
      line2: address.address_line2,
      city: address.city,
      state: address.state,
      country: address.country,
      zip: address.postal_code
    }
    return item;
  }
}

