export type Overlaps = {
  [routeId: string]: {
    [otherRouteId: string]: number;
  };
};
