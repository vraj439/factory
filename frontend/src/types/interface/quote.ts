import { IAddress } from './address';

export interface IQuoteState {
  id: string;
  shippingAddress: IAddress;
  billingAddress: IAddress;
  specialInstructions: string;
  expectedLeadTime: string;
  // items: IQuoteItem[]
}
