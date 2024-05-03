export type Location = {
  id: string;
  coordinates: number[];
  label: string;
  address: LocationAddress;
};

export type LocationAddress = {
  country: Details;
  place: Details;
  postcode?: Details;
  street?: Details;
  address_number?: Details;
};

type Details = {
  id: string;
  name: string;
};
