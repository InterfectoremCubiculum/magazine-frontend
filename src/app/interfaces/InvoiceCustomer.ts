export interface InvoiceCustomer {
  id: number | null;
  name: string;
  taxId?: string;
  address?: string;
  email?: string;
  phone?: string;
}
