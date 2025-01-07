import { useEffect, useRef, useState } from 'react';
import QuoteAddress from '../QuoteAddress';
import QuoteOverview from '../QuoteOverview';
import QuoteTable from '../QuoteTable';
import { useParams } from 'react-router-dom';
import Modal from '../Modal';
import { ItemsModalContent } from '../ItemsModal';
import useConsumerStore from '../../../stores/consumer';
import useDal from '../../hooks/useDAL';
import { ICreateAddressRequestDto } from '../../../types/dto/address';
import { IQuoteState } from '../../../types/interface/quote';
import { IAddress } from '../../../types/interface/address';

const headers = [
  <input type="checkbox" className="cursor-pointer" />,
  'Items',
  'Details',
  'Quantity',
  'Status',
  'Total',
  'Action'
];

const rows = [
  [
    <input type="checkbox" className="cursor-pointer" />, // Checkbox for the first cell
    <div className="flex items-center">
      <div className="w-10 h-10 bg-gray-700" />
      {/* Placeholder for the image */}
      <div className="ml-2">
        <p className="font-medium">BLOCK 1.STEP</p>
        <p className="text-gray-500">100.00 mm × 100.00 mm × 100.00 mm</p>
      </div>
    </div>,
    <div>
      <p>
        Process:{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Configure
        </a>
      </p>
      <p>
        Material Grade:{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Configure
        </a>
      </p>
      <p>
        Finishing:{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Configure
        </a>
      </p>
      <p>
        Color:{' '}
        <a href="#" className="text-blue-600 hover:underline">
          Configure
        </a>
      </p>
    </div>,
    '1', // Quantity
    <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs">
      Configure to get price
    </span>, // Status
    <span>₹ --</span>, // Total
    <button className="bg-black text-white px-3 py-1 rounded">Configure</button> // Action
  ]
];

const QuotesSummary = () => {
  const { quoteId } = useParams();
  const [showItemsModal, setShowItemsModal] = useState(false);
  const { consumer, setConsumer } = useConsumerStore();
  const dal = useDal();
  const [quote, setQuote] = useState<IQuoteState>({
    id: quoteId,
    shippingAddress: {} as IAddress,
    billingAddress: {} as IAddress,
    specialInstructions: '',
    expectedLeadTime: ''
  });
  const fetchQuoteDetails = async () => {
    const quote = await dal.quotes.getQuote(quoteId);
    const quoteState: IQuoteState = {
      id: quote.id,
      shippingAddress: consumer.addresses.find((address) => address.id === quote.shipping_address_id),
      billingAddress: consumer.addresses.find((address) => address.id === quote.billing_address_id),
      specialInstructions: quote.special_instructions,
      expectedLeadTime: quote.expected_lead_time
    };
    setQuote(quoteState);

  };
  useEffect(() => {
    fetchQuoteDetails();
  }, [quoteId]);

  const handleAddNewAddress = async (payload: ICreateAddressRequestDto) => {
    const address = await dal.address.createAddress(payload);
    setConsumer({
      ...consumer,
      addresses: [...consumer.addresses, address]
    });
  };
  const handleAddressChange = async (addressType: 'shipping' | 'billing', addressId: string) => {
    await dal.quotes.updateQuote(quoteId, {
      [`${addressType}_address_id`]: addressId
    });
    fetchQuoteDetails();
  };
  return (
    <div className="quotes-summary-container bg-gray-100 flex flex-row w-full p-6">
      <div className="quotes-summary__row-1 w-full flex flex-col gap-6">
        <div className="flex flex-row gap-x-2">
          <div className="flex-[2_1_0%] min-h-72">
            <QuoteAddress
              shippingAddress={quote.shippingAddress}
              billingAddress={quote.billingAddress}
              specialInstructions={quote.specialInstructions}
              expectedLeadTime={quote.expectedLeadTime}
              userAddresses={consumer.addresses}
              handleAddressChange={handleAddressChange}
              handleAddNewAddress={handleAddNewAddress} />
          </div>
          <div className="flex-[1_1_0%] min-h-72">
            <QuoteOverview />
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <span>Items </span>
            <span className="text-gray-500">Last modified: </span>
          </div>
          <div>
            <div className="flex space-x-4">
              {/* Delete Button */}
              <button
                className="px-4 py-2 border border-gray-300 text-gray-400 rounded bg-gray-100 cursor-not-allowed"
                disabled
              >
                Delete
              </button>

              {/* Bulk Configure Button */}
              <button
                className="px-4 py-2 border border-gray-300 text-gray-400 rounded bg-gray-100 cursor-not-allowed"
                disabled
              >
                Bulk Configure
              </button>

              {/* Add Items Button */}
              <button
                className="px-4 py-2 border border-blue-500 text-blue-600 rounded bg-blue-50 hover:bg-blue-100 flex items-center"
                onClick={() => setShowItemsModal(true)}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path
                    d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11 8 15.01z"></path>
                </svg>
                Add Items
              </button>
              {showItemsModal && (
                <Modal
                  title={'items'}
                  onClose={() => setShowItemsModal(null)}
                  content={<ItemsModalContent quoteId={quoteId} />}
                  cancelButtonTitle="Close"
                  buttonActionTitle="Add Item To Quote"
                  onSubmit={() => {
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div>
          <QuoteTable headers={headers} rows={rows} />
        </div>
      </div>
    </div>
  );
};

export default QuotesSummary;
