import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WarehouseComponent } from './warehouse/warehouse.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'warehouse', component: WarehouseComponent },
];
