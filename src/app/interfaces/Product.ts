import { Category } from "./Category";

export interface Product {
  id: number | null;
  category: Category;
  name: string;
  weight: number;
  price: number;
  description: string;
}