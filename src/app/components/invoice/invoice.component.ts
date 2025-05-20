import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { CustomerService } from '../../services/customer.service';
import { Invoice } from '../../interfaces/Invoice';
import { Customer } from '../../interfaces/Customer';
import { ConfirmationService, MessageService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Toast } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule, Toast, TableModule, InputTextModule, FormsModule, IconFieldModule, IconField, InputIcon, ButtonModule, ToolbarModule, ConfirmDialog, Dialog, DropdownModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],

  providers: [ConfirmationService, MessageService]
})
export class InvoiceComponent implements OnInit {
  invoices: Invoice[] = [];
  selectedInvoices: Invoice[] = [];
  invoice: Invoice = {
    id: null,
    customer: { id: null, name: '' },
    issueDate: '',
    saleDate: '',
    paymentDueDate: '',
    paymentMethod: ''
  };
  customers: Customer[] = [];
  paymentMethods = [
    { label: 'Transfer', value: 'Transfer' },
    { label: 'BLIK', value: 'BLIK' },
    { label: 'Cash', value: 'Cash' }
  ];
  invoiceDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadInvoices();
    this.loadCustomers();
  }

  loadInvoices(): void {
    this.loading = true;
    this.invoiceService.getAll().subscribe({
      next: (data) => {
        this.invoices = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load invoices' });
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (data) => this.customers = data
    });
  }

  openNew(): void {
    this.invoice = {
      id: null,
      customer: { id: null, name: '' },
      issueDate: '',
      saleDate: '',
      paymentDueDate: '',
      paymentMethod: ''
    };
    this.submitted = false;
    this.invoiceDialog = true;
  }

  editInvoice(invoice: Invoice): void {
    this.invoice = {
      ...invoice,
      customer: invoice.customer ?? { id: null, name: '' }
    };
    this.invoiceDialog = true;
  }

  deleteSelectedInvoices(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected invoices?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deleteRequests = this.selectedInvoices.map(invoice =>
          this.invoiceService.delete(invoice.id!)
        );
        forkJoin(deleteRequests).subscribe({
          next: () => {
            this.invoices = this.invoices.filter(
              val => !this.selectedInvoices.includes(val)
            );
            this.selectedInvoices = [];
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Selected invoices deleted successfully',
              life: 3000
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Could not delete all selected invoices.',
              life: 3000
            });
          }
        });
      }
    });
  }

  saveInvoice(): void {
    this.submitted = true;
    if (!this.invoice.customer?.id || !this.invoice.issueDate || !this.invoice.saleDate || !this.invoice.paymentDueDate || !this.invoice.paymentMethod) {
      return;
    }

    if (this.invoice.id) {
      this.invoiceService.update(this.invoice).subscribe({
        next: () => {
          this.loadInvoices();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Invoice updated' });
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update invoice' });
        }
      });
    } else {
      this.invoiceService.create(this.invoice).subscribe({
        next: () => {
          this.loadInvoices();
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Invoice created' });
          this.hideDialog();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create invoice' });
        }
      });
    }
  }

  hideDialog(): void {
    this.invoiceDialog = false;
    this.submitted = false;
  }

  onGlobalFilter(event: Event, table: any): void {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }
}