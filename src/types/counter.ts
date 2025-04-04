
export interface Counter {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  operators?: {
    id: string;
    name: string;
  }[];
}
