export interface ICreateAddressRequestDto {
  // title: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  // countryCode: string;
  postal_code: string;
  // phone: string;
}

export interface IAddressDto {
  id: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}
