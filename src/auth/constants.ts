export interface UserResult {
  id: number;
  email: string;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  LastName: string | null;
}
