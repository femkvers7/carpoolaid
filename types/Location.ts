export type Location = {
  id: string;
  coordinates: number[];
  name?: string; // user input
  carSeats?: number;
  label?: string; // provided by mapbox
};
