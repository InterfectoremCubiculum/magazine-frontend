export interface Supplier {
  id: number | null;
  name: string;
  taxIdentificationNumber: string;
  bankAccountNumber: number;
  phoneNumber: number;
  internationalDialingNumber: number;
  country: string;
  websiteURL: string;
}