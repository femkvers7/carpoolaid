export type Location = {
  id: string;
  coordinates: number[];
  label?: string;
  carAvailable?: boolean;
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
