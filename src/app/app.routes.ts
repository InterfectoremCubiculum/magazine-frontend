import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { CategoryComponent } from './components/category/category.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { ProductComponent } from './components/product/product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { AuthGuard } from './guards/auth.guard';
import UserRoles from './enums/userRoles';
import { WarehouseItemComponent } from './components/warehouse-item/warehouse-item.component';
import { AuthResolver } from './resolver/auth-resolver.resolver';

export const routes: Routes = [
    { 
        path: '', 
        component: HomeComponent,
        resolve: { auth: AuthResolver } 
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'warehouse',
        component: WarehouseComponent,
        canActivate: [AuthGuard],
        data: { roles: [UserRoles.ADMIN, UserRoles.EMPLOYEE] }
    },
    {
        path: 'warehouse/:warehouseId',
        component: WarehouseItemComponent,
        canActivate: [AuthGuard],
        data: { roles: [UserRoles.ADMIN, UserRoles.EMPLOYEE] }
    },
    { 
        path: 'category', 
        component: CategoryComponent, 
        canActivate: [AuthGuard],
        data: { roles: [UserRoles.ADMIN, UserRoles.EMPLOYEE] }
    },
    { 
        path: 'invoice', 
        component: InvoiceComponent,
        canActivate: [AuthGuard],
        data: { roles: [UserRoles.ADMIN, UserRoles.EMPLOYEE] }
    },
    { path: 'product', component: ProductComponent },
    { path: 'shopping-list', component: ShoppingListComponent }
];
