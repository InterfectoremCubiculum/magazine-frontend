export interface CreateCustomerDto {
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
} 