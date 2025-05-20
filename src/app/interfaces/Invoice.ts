import { Customer } from "./Customer";

export interface Invoice {
  id: number | null;
  customer: Customer;
  issueDate: string;        
  saleDate: string;
  paymentDueDate: string;
  paymentMethod: string;
}