export type Route = {
  id: string;
  carpoolId: string;
  carSeats: number; // make this obligatory, if not explicitly mentioned, set to 4
  destinationId?: string;
  distance: number;
  duration: number;
  geometry: number[][];
};
