// Location type we use in our application
export type Location = {
  id: string;
  coordinates: number[];
  name?: string; // user input
  carSeats?: number;
  place?: string; // backup for name (provided by mapbox)
};

// result from Mapbox API
export type MapboxLocation = {
  id: string;
  coordinates: number[];
  name?: string; // user input
  carSeats?: number;
  label?: string; // provided by mapbox
  address?: LocationAddress;
};

export type LocationAddress = {
  country: string;
  place?: string;
  postcode: string;
  street?: string;
  address_number?: string;
};
