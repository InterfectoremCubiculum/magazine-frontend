export interface Customer {
  id: number | null;
  userId: number;
  name: string;
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
  isDefault?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}