// Location type we use in our application
export type Location = {
  id: string;
  coordinates: number[];
  name?: string; // user input
  carSeats?: number;
  place?: string; // backup for name (provided by mapbox);
  groupId?: string;
  fullAddress?: string;
};
