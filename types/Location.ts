export type Location = {
  coordinates: number[];
  full_address: string;
  context: LocationContext;
};

export type LocationContext = {
  country: CountryDetails;
  place: Details;
  locality: Details;
  postcode?: Details;
  street?: Details;
  address?: AddressDetails;
  region?: RegionDetails;
};

type Details = {
  id: string;
  name: string;
};

type AddressDetails = Details & {
  street_name: string;
  address_number: string;
};

type CountryDetails = Details & {
  country_code: string;
  country_code_alpha_3: string;
};

type RegionDetails = Details & {
  region_code: string;
  region_code_full: string;
};
