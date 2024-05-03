export type Route = {
  id: string;
  carpoolId: string;
  destinationId?: string;
  distance: number;
  duration: number;
  geometry: number[][];
};
