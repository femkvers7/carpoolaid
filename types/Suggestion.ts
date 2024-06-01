// one suggestion = one array of strings (ids)
// export type Suggestion = string[];

export type SuggestionGroup = {
  id: string;
  driver: string;
  passengers: string[];
  capacity: number;
};
