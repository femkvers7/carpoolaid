export type Location = {
  id: string;
  coordinates: number[];
  name?: string;
  carSeats?: number;
  address: LocationAddress;
};

export type LocationAddress = {
  country: string;
  place: string;
  postcode?: string;
  street?: string;
  address_number?: string;
};
