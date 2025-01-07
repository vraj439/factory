import { IAddress } from './address';

export interface IConsumer {
  id: number;
  name: string;
  email: string;
  addresses: IAddress[];
}

// Define the store's state and actions
export interface IConsumerStore {
  consumer: IConsumer;
  setConsumer: (consumer: IConsumer) => void;
  clearConsumer: () => void;
}
