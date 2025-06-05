import { InvoiceCustomer } from "./InvoiceCustomer";

export interface Invoice {
  id: number | null;
  customer: InvoiceCustomer;
  issueDate: string;        
  saleDate: string;
  paymentDueDate: string;
  paymentMethod: string;
}