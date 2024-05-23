export type Location = {
  id: string;
  coordinates: number[];
  name?: string; // user input
  carSeats?: number;
  address: LocationAddress;
  label?: string; // provided by mapbox
};

// eigenlijk hebben we dit allemaal niet nodig
// juist de coordinaten en een label -> indien geen naam meegegeven, wijs plaatsnaam toe als label
export type LocationAddress = {
  country: string;
  place?: string;
  postcode: string;
  street?: string;
  address_number?: string;
};
