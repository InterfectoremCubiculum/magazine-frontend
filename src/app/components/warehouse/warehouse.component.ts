import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from '../../services/warehouse.service';
import { Warehouse } from '../../interfaces/Warehouse';
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
  selector: 'app-warehouse',
  imports: [CommonModule, Toast, TableModule, InputTextModule, FormsModule, IconFieldModule, IconField, InputIcon, ButtonModule, ToolbarModule, ConfirmDialog, Dialog],
  providers: [MessageService, ConfirmationService],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})

export class WarehouseComponent implements OnInit {
  warehouse!: Warehouse;
  warehouseDialog: boolean = false;
  selectedWarehouses: Warehouse[] = [];
  loading: boolean = true;
  warehouseData: Warehouse[] = [];
  warehouseColumns: { key: 'id' | 'name' | 'location'; label: string; }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' }
  ];

  @ViewChild('dt') dt!: Table;

  submitted: boolean = false;
  constructor( 
    private warehouseService: WarehouseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) { }
  ngOnInit(): void {
    this.fetchData();
    this.loading = false;
  }

  fetchData(): void {
    this.getWarehouses();
  }

  getWarehouses(): void {
    this.warehouseService.getWarehouses().subscribe({
      next: (data) => {
        this.warehouseData = data;
      },
      error: (error) => {
        console.error('Error fetching warehouses:', error);
      }
    })
  }

  addWarehouse(warehouse: Warehouse): void {
    this.warehouseService.addWarehouse(warehouse).subscribe({
      next: (data) => {
        this.warehouseData.push(data);
      },
      error: (error) => {
        console.error('Error adding warehouse:', error);
      }
    })
  }

  onGlobalFilter(event: Event, table: any): void {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
  openNew() {
    this.warehouse = {};
    this.submitted = false;
    this.warehouseDialog = true;
  }

  deleteSelectedWarehouses(): void {
  this.confirmationService.confirm({
    message: 'Are you sure you want to delete the selected warehouses?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      const deleteRequests = this.selectedWarehouses.map(warehouse =>
        this.warehouseService.deleteWarehouse(warehouse.id!)
      );

      forkJoin(deleteRequests).subscribe({
        next: () => {
          this.warehouseData = this.warehouseData.filter(
            val => !this.selectedWarehouses.includes(val)
          );
          this.selectedWarehouses = [];
          this.messageService.add({ 
            severity: 'success',
            summary: 'Success',
            detail: 'Selected warehouses deleted successfully',
            life: 3000
          });
        },
        error: (error) => {
          console.error('Error deleting selected warehouses:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not delete all selected warehouses.',
            life: 3000
          });
        }
      });
    }
  });
}

  hideDialog() {
    this.warehouseDialog = false;
    this.submitted = false;
  }

  editProduct(warehouse: Warehouse) {
    this.warehouse = warehouse;
    this.warehouseDialog = true;
    this.submitted = false;
  }

  saveWarehouse() {
    this.submitted = true;

    if (!this.warehouse.name || this.warehouse.name.trim() === '') {
      return; 
    }

    if (this.warehouse.id) {
      this.warehouseService.updateWarehouse(this.warehouse).subscribe({
        next: (data) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success',
            detail: 'Warehouse updated successfully', 
            life: 3000
          });
          const index = this.warehouseData.findIndex(warehouse => warehouse.id === this.warehouse.id);
          if (index !== -1) {
            this.warehouseData[index] = { ...this.warehouse };
          }
        },
        error: (error) => {
          console.error('Error updating warehouse:', error);
        }
      });
    } else {
      this.warehouseService.addWarehouse(this.warehouse).subscribe({
        next: (data) => {
          this.warehouseData.push(data);
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Success',
             detail: 'Warehouse created successfully',                     
             life: 3000
          });
        },
        error: (error) => {
          console.error('Error creating warehouse:', error);
        }
      });
    }
    this.warehouseDialog = false;
    this.warehouse = {};
  }
}
