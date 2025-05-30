import { Component } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Product } from '../../interfaces/Product';
import { ProductService } from '../../services/product.service';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { CategoryService } from '../../services/category.service';
import { BadgeModule } from 'primeng/badge';
import { Router } from '@angular/router';
import { ShoppingService } from '../../services/shopping.service';

@Component({
  selector: 'app-product',
  imports: [DataView, ButtonModule, CommonModule, DropdownModule, SelectModule, FormsModule, BadgeModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  categories: any = [];
  selectedCategory!: number | null;
  loading: boolean = true;
  sortOptions!: any[];
  sortOrder!: number;
  rows: number = 10;
  sortField!: string;
  page: number = 0;
  totalElements: number = 0;
  totalPages: number = 0;
  products: Product[] = [];
  productsIdInCard: number[] = [];
  elementsInCart = 0;

  constructor(
    private productService: ProductService, 
    private categoryService: CategoryService, 
    private router: Router,
    private shoppingService: ShoppingService
  ) {}
  
  ngOnInit(): void {
    this.sortOptions = [
      { label: 'Cena rosnąco', value: 'price' },
      { label: 'Cena malejąco', value: '!price' },
      { label: 'Nazwa A-Z', value: 'name' },
      { label: 'Nazwa Z-A', value: '!name' }
    ];

    this.getCategories();
    this.loadCartFromStorage();
  }

  getCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data.map((category) => ({
          label: category.name,
          value: category.id
        }));
      }})
  }

  getProducts(page: number, size: number): void {
    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    if (this.selectedCategory) {
      params = params.set('categoryId', this.selectedCategory);
    }

    if (this.sortField) {
      const sortParam = `${this.sortField},${this.sortOrder === 1 ? 'asc' : 'desc'}`;
      params = params.set('sort', sortParam);
    }

    this.productService.getProductsPagination(params).subscribe({
      next: (data) => {
        this.products = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.page = data.number;
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.loading = false;
    const page = event.first / event.rows;
    const size = event.rows;
    this.getProducts(page, size);
  }
  
  onSortChange(event: any): void {
    const value = event.value;
    if (value.startsWith('!')) {
      this.sortOrder = -1;
      this.sortField = value.substring(1);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
    this.getProducts(0, this.rows);
  }
  onCategoryChange(event: any): void {
    const value = event.value;
    if (value) {
      this.selectedCategory = value;
    } else {
      this.selectedCategory = null;
    }
    this.getProducts(0, this.rows);
  }
  onAddToCart(product: Product) {
    this.elementsInCart++;
    this.productsIdInCard.push(product.id);
    this.shoppingService.addToStorage({
      product: product,
      quantity: 1
    });
  }
  onRemoveFromCart(product: Product) {
    this.elementsInCart--;
    const index = this.productsIdInCard.indexOf(product.id);
    if (index > -1) {
      this.productsIdInCard.splice(index, 1);
    }

    this.shoppingService.removeFromStorage(product.id);
  }
  
  onListView() {
    this.router.navigate(['/shopping-list']);
  }

  loadCartFromStorage() {
    const cart = this.shoppingService.getList();
    this.elementsInCart = cart.length;
    this.productsIdInCard = cart.map(item => item.product.id);
  }
}
