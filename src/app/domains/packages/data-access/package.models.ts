export interface PhotoPackage {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  deliverables: string;
}

export type CreatePackageRequest = Omit<PhotoPackage, 'id'>;
