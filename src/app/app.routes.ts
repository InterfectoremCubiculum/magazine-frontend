import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { CategoryComponent } from './components/category/category.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { ProductComponent } from './components/product/product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'warehouse', component: WarehouseComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'invoice', component: InvoiceComponent },
    { path: 'product', component: ProductComponent },
];
