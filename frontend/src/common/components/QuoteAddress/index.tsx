import React, { ChangeEvent, useEffect, useState } from 'react';
import SideModal from '../SideModal';
import { IAddress } from '../../../types/interface/address';
import { ICreateAddressRequestDto } from '../../../types/dto/address';

interface IQuoteAddressProps {
  shippingAddress?: IAddress;
  billingAddress?: IAddress;
  specialInstructions?: string;
  expectedLeadTime?: string;
  userAddresses?: IAddress[];
  handleAddressChange: (addressType: 'shipping' | 'billing', id: string) => void;
  handleAddNewAddress: (payload: ICreateAddressRequestDto) => void;
}

const QuoteAddress =
  ({
     shippingAddress,
     billingAddress,
     specialInstructions,
     expectedLeadTime,
     userAddresses = [],
     handleAddressChange,
     handleAddNewAddress
   }: IQuoteAddressProps) => {
    const [userAddressModalType, setUserAddressModalType] = useState<'shipping' | 'billing' | null>(null);
    const [isSpecialInstructionsModalOpen, setIsSpecialInstructionsModalOpen] = useState(false);
    const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
    const [isExpectedLeadModalOpen, setIsExpectedLeadModalOpen] = useState(false);
    const [newAddressForm, setNewAddressForm] = useState({
      title: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
      // countryCode: ''
    });

    const [selectedAddress, setSelectedAddress] = useState({
      shipping: shippingAddress?.id || '',
      billing: billingAddress?.id || ''
    });
    useEffect(() => {
      setSelectedAddress({
        shipping: shippingAddress?.id || '',
        billing: billingAddress?.id || ''
      });
    }, [shippingAddress?.id, billingAddress?.id]);
    const addNewAddressHandler = async () => {
      // e.preventDefault();
      const payload: ICreateAddressRequestDto = {
        // title: newAddressForm.title,
        address_line1: newAddressForm.addressLine1,
        address_line2: newAddressForm.addressLine2,
        city: newAddressForm.city,
        state: newAddressForm.state,
        country: newAddressForm.country,
        postal_code: newAddressForm.zip
      };
      handleAddNewAddress(payload);
      setIsNewAddressModalOpen(false);
    };

    const newAddModalContent = (
      <form>
        <div className="space-y-4">
          {/* Address Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Address Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Address Title"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              value={newAddressForm.title}
              onChange={(e) => setNewAddressForm({ ...newAddressForm, title: e.target.value })}
            />
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Street, Road"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              value={newAddressForm.addressLine1}
              onChange={(e) => setNewAddressForm({ ...newAddressForm, addressLine1: e.target.value })}
            />
          </div>

          {/* Address Line 2 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              placeholder="Address line 2"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
              value={newAddressForm.addressLine2}
              onChange={(e) => setNewAddressForm({ ...newAddressForm, addressLine2: e.target.value })}
            />
          </div>

          {/* Country and State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter country"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                value={newAddressForm.country}
                onChange={(e) => setNewAddressForm({ ...newAddressForm, country: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter state"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                value={newAddressForm.state}
                onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
              />
            </div>
          </div>

          {/* City and Zipcode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter city"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                value={newAddressForm.city}
                onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Zipcode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter area Pincode"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                value={newAddressForm.zip}
                onChange={(e) => setNewAddressForm({ ...newAddressForm, zip: e.target.value })}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            {/*<div className="flex">*/}
            {/*  <select*/}
            {/*    value={newAddressForm.countryCode}*/}
            {/*    onChange={(e) => setNewAddressForm({ ...newAddressForm, countryCode: e.target.value })}*/}
            {/*    className="w-1/3 p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"*/}
            {/*  >*/}
            {/*    {CountryCodes.map((country) => (*/}
            {/*      <option key={country.code} value={country.code}>*/}
            {/*        {country.code} ({country.name})*/}
            {/*      </option>*/}
            {/*    ))}*/}
            {/*  </select>*/}
            {/*  <input*/}
            {/*    type="tel"*/}
            {/*    placeholder="Phone Number"*/}
            {/*    className="w-full border-t border-b border-r border-gray-300 rounded-r px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"*/}
            {/*  />*/}
            {/*</div>*/}
          </div>
        </div>

      </form>
    );


    const addressModalContent = (
        <div>
          {userAddresses.length > 0 && (
            <div className="bg-white ">
              <h2 className="text-lg font-semibold mb-4">{`Select a ${userAddressModalType} address`}</h2>

              {/* Address List */}
              <div className="space-y-4">
                {userAddresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block border rounded-lg p-4 cursor-pointer ${
                      selectedAddress[userAddressModalType] === address.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name={userAddressModalType}
                        checked={selectedAddress[userAddressModalType] === address.id}
                        value={address.id}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setSelectedAddress({ ...selectedAddress, [userAddressModalType]: e.target.value });
                        }}
                        className="mt-1 cursor-pointer"
                      />
                      <div>
                        <p className="font-medium">{address.title || address.id}</p>
                        <p className="text-sm text-gray-600">{address.line1}, {address.line2}</p>
                        <p className="text-sm text-gray-600">
                          {/*Mobile number: {address.phone}*/}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Add New Address Button */}
            </div>
          )}
          <button
            className="mt-6 w-full flex justify-between items-center bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100"
            onClick={() => setIsNewAddressModalOpen(true)}
          >
            Add New Address
            <span className="text-lg font-bold">&rarr;</span>
          </button>

        </div>

      )
    ;
    const specialInstructionsModalContent = (
      <>
        <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
          Special Instructions
        </label>
        <textarea
          id="specialInstructions"
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          rows={4}
          placeholder="Enter special instructions here"
        />
      </>
    );

    const expectedLeadTimeModalContent = (
      <>
        <label htmlFor="expectedLeadTime" className="block text-sm font-medium text-gray-700">
          Enter the expected lead time
        </label>
        <input
          type="text"
          id="expectedLeadTime"
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter expected lead time here"
        />
      </>
    );
    return (
      <div className="p-6 bg-white shadow rounded-lg h-full">
        <h2 className="text-lg font-semibold mb-4">Quote Details</h2>
        <div className="flex flex-row gap-6">
          <div className="flex w-1/2 flex-col gap-6">
            {/* Shipping Address */}
            <div>
              <h3 className="text-sm font-medium flex items-center">
                Shipping Address
                <button className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setUserAddressModalType('shipping')}>
                  ✏️
                </button>
              </h3>
              {shippingAddress ? (
                <p className="text-sm text-gray-700 mt-1">
                  {shippingAddress.line1}, {shippingAddress.line2} {shippingAddress.city},{' '}
                  {shippingAddress.state}, {shippingAddress.zip}
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  No Shipping Address Provided Yet
                </p>
              )}
            </div>
            {/* Special Instructions */}
            <div>
              <h3 className="text-sm font-medium flex items-center">
                Add Special Instructions
                <button className="ml-2 text-gray-500 hover:text-gray-700 "
                        onClick={() => setIsSpecialInstructionsModalOpen(true)}>
                  ✏️
                </button>
              </h3>
              <p className="text-sm text-gray-500 italic mt-1">
                No Special Instructions Provided Yet
              </p>
            </div>
          </div>
          <div className="flex w-1/2 flex-col gap-6">
            {/* Billing Address */}
            <div>
              <h3 className="text-sm font-medium flex items-center">
                Billing Address
                <button className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setUserAddressModalType('billing')}>
                  ✏️
                </button>
              </h3>
              {billingAddress ? (
                <p className="text-sm text-gray-700 mt-1">
                  {billingAddress.line1}, {billingAddress.line2} {billingAddress.city},{' '}
                  {billingAddress.state}, {billingAddress.zip}
                </p>) : (
                <p className="text-sm text-gray-500 mt-1">
                  No Billing Address Provided Yet
                </p>
              )}
            </div>

            {/* Expected Lead Time */}
            <div>
              <h3 className="text-sm font-medium flex items-center">
                Expected Lead Time
                <button className="ml-2 text-gray-500 hover:text-gray-700"
                        onClick={() => setIsExpectedLeadModalOpen(true)}>
                  ✏️
                </button>
              </h3>
              <p className="text-sm text-gray-700 mt-1">15 days</p>
            </div>

          </div>
        </div>

        {userAddressModalType &&
          <SideModal
            title={userAddressModalType + ' address'}
            onClose={() => setUserAddressModalType(null)}
            onSubmit={() => {
              handleAddressChange(userAddressModalType, selectedAddress[userAddressModalType]);
            }}
            content={addressModalContent}
            cancelButtonTitle="Discard"
            buttonActionTitle="Save Address"
          />
        }

        {isNewAddressModalOpen &&
          <SideModal
            title="Add new address"
            content={newAddModalContent}
            onClose={() => setIsNewAddressModalOpen(false)}
            onSubmit={() => addNewAddressHandler()}
            cancelButtonTitle="Discard"
            buttonActionTitle="Save Address"
          />
        }
        {isSpecialInstructionsModalOpen &&
          <SideModal
            title="Special Instructions"
            content={specialInstructionsModalContent}
            onClose={() => setIsSpecialInstructionsModalOpen(false)}
            onSubmit={() => {
            }}
            cancelButtonTitle="Discard"
            buttonActionTitle="Save Special Instructions"
            description="Add any special instructions along with this order."
          />}
        {isExpectedLeadModalOpen &&
          <SideModal
            title="Expected Lead Time"
            content={expectedLeadTimeModalContent}
            onClose={() => setIsExpectedLeadModalOpen(false)}
            onSubmit={() => {
            }}
            cancelButtonTitle="Discard"
            buttonActionTitle="Save Special Instructions"
            description="Lead time includes production of your parts, shipment to the Factory.io warehouse, customs clearance and quality control."
          />}

      </div>
    );
  };

export default QuoteAddress;
