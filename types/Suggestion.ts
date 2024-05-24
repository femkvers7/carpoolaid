// one suggestion = one array of strings (ids)
// export type Suggestion = string[];

export type SuggestionGroup = {
  driver: string; // id of the driver can act as unique identifier
  passengers: string[];
  capacity: number;
};
