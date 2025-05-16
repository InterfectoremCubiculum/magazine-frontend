import { Component } from '@angular/core';
import { GenericTableComponent } from '../../shared/generic-table/generic-table.component';
@Component({
  selector: 'app-warehouse',
  imports: [GenericTableComponent],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})
export class WarehouseComponent {
  warehouseData = [
    { id: 1, name: 'Warehouse A', location: 'Location A' },
    { id: 2, name: 'Warehouse B', location: 'Location B' },
    { id: 3, name: 'Warehouse C', location: 'Location C' },
  ];


  warehouseColumns: { key: 'id' | 'name' | 'location'; label: string; }[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'location', label: 'Location' }
];
}
