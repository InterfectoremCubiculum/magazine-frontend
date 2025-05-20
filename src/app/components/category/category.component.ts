import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interfaces/Category';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-category',
  imports: [CommonModule, Toast, TableModule, InputTextModule, FormsModule, IconFieldModule, IconField, InputIcon, ButtonModule, ToolbarModule, ConfirmDialog, Dialog],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  selectedCategories: Category[] = [];
  category: Category = { id: null, name: '' };
  categoryDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load categories' });
      }
    });
  }

  openNew(): void {
    this.category = { id: null, name: '' };
    this.submitted = false;
    this.categoryDialog = true;
  }

  editCategory(category: Category): void {
    this.category = { ...category };
    this.categoryDialog = true;
  }
  onGlobalFilter(event: Event, table: any): void {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
deleteSelectedCategories(): void {
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete the selected categories?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      const deleteRequests = this.selectedCategories.map(category =>
        this.categoryService.delete(category.id!)
      );

      forkJoin(deleteRequests).subscribe({
        next: () => {
          this.categories = this.categories.filter(
            val => !this.selectedCategories.includes(val)
          );
          this.selectedCategories = [];
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Selected categories deleted successfully',
            life: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting selected categories:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not delete all selected categories.',
            life: 3000
          });
        }
      });
    }
  });
}

  saveCategory(): void {
    this.submitted = true;

    if (!this.category.name) {
      return;
    }

    if (this.category.id) {
      this.categoryService.update(this.category).subscribe({
        next: () => {
          this.loadCategories();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated' });
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category' });
        }
      });
    } else {
      this.categoryService.create(this.category).subscribe({
        next: () => {
          this.loadCategories();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category created' });
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create category' });
        }
      });
    }
  }

  hideDialog(): void {
    this.categoryDialog = false;
    this.submitted = false;
  }
}