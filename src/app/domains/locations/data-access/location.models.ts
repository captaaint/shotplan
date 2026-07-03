export interface Location {
  id: string;
  name: string;
  address: string;
  indoor: boolean;
  notes: string;
}

export type CreateLocationRequest = Omit<Location, 'id'>;
