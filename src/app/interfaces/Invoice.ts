export interface Invoice {
  id: number | null;
  customer: {
    id: number | null;
    name: string;
    // tutaj reszta customera, albo potem można zrobić interfejs, czekam na BASIĘ
  };
  issueDate: string;        
  saleDate: string;
  paymentDueDate: string;
  paymentMethod: string;
}