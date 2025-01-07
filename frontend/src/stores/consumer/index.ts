import { create } from 'zustand';
import { IConsumer, IConsumerStore } from '../../types/interface/consumer';

const ConsumerDefaultState = {
  id: 0,
  name: '',
  email: '',
  addresses: []
}

const useConsumerStore = create<IConsumerStore>((set) => ({
  consumer: ConsumerDefaultState,
  setConsumer: (consumerData: IConsumer) => set({ consumer: consumerData }),
  clearConsumer: () => set({ consumer: null })
}));

export default useConsumerStore;
