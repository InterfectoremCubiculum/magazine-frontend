import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Customer } from '../../interfaces/Customer';
import { CustomerService } from '../../services/customer.service';
import { CreateCustomerDto } from '../../dtos/customer/create-customer.dto';
import { UpdateCustomerDto } from '../../dtos/customer/update-customer.dto';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-address-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './address-management.component.html',
  styleUrls: ['./address-management.component.scss']
})
export class AddressManagementComponent implements OnInit {
  addresses: Customer[] = [];
  addressForm: FormGroup;
  displayDialog = false;
  isEditing = false;
  editingId: number | null = null;
  loading = false;

  constructor(
    private customerService: CustomerService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.addressForm = this.fb.group({
      name: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      houseNumber: ['', Validators.required],
      apartmentNumber: [''],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{3}$/)]],
      country: ['Polska', Validators.required],
      phoneNumber: ['']
    });
  }

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.loading = true;

    this.customerService.getMyAddresses().subscribe({
      next: (addresses: Customer[]) => {
        this.addresses = addresses;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;

        let errorMessage = 'Nie udało się załadować adresów';
        if (error.status === 401) {
          errorMessage = 'Sesja wygasła. Zaloguj się ponownie.';
        } else if (error.status === 403) {
          errorMessage = 'Brak uprawnień do przeglądania adresów';
        } else if (error.status === 0) {
          errorMessage = 'Brak połączenia z serwerem';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: errorMessage
        });
      }
    });
  }

  openDialog(): void {
    this.isEditing = false;
    this.editingId = null;
    this.addressForm.reset({
      country: 'Polska'
    });
    this.displayDialog = true;
  }

  editAddress(address: Customer): void {
    this.isEditing = true;
    this.editingId = address.id;
    this.addressForm.patchValue({
      name: address.name,
      firstName: address.firstName,
      lastName: address.lastName,
      street: address.street,
      houseNumber: address.houseNumber,
      apartmentNumber: address.apartmentNumber,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      phoneNumber: address.phoneNumber
    });
    this.displayDialog = true;
  }

  deleteAddress(address: Customer): void {
    this.confirmationService.confirm({
      message: `Czy na pewno chcesz usunąć adres "${address.name}"?`,
      header: 'Potwierdzenie usunięcia',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (address.id) {
          this.customerService.delete(address.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sukces',
                detail: 'Adres został usunięty'
              });
              this.loadAddresses();
            },
            error: (error: HttpErrorResponse) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Błąd',
                detail: 'Nie udało się usunąć adresu'
              });
            }
          });
        }
      }
    });
  }

  setAsDefault(address: Customer): void {
    if (address.id) {
      this.customerService.setAsDefault(address.id).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sukces',
            detail: 'Adres został ustawiony jako domyślny'
          });
          this.loadAddresses();
        },
        error: (error: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Nie udało się ustawić adresu jako domyślny'
          });
        }
      });
    }
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      if (this.isEditing && this.editingId) {
        const updateDto: UpdateCustomerDto = this.addressForm.value;
        this.customerService.update(this.editingId, updateDto).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sukces',
              detail: 'Adres został zaktualizowany'
            });
            this.displayDialog = false;
            this.loadAddresses();
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się zaktualizować adresu'
            });
          }
        });
      } else {
        const createDto: CreateCustomerDto = this.addressForm.value;
        this.customerService.create(createDto).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sukces',
              detail: 'Adres został dodany'
            });
            this.displayDialog = false;
            this.loadAddresses();
          },
          error: (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się dodać adresu'
            });
          }
        });
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uwaga',
        detail: 'Proszę wypełnić wszystkie wymagane pola'
      });
    }
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.addressForm.reset();
  }
}
