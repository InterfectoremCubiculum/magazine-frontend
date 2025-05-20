import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { CategoryComponent } from './components/category/category.component';
import { InvoiceComponent } from './components/invoice/invoice.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'warehouse', component: WarehouseComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'invoice', component: InvoiceComponent },
];
