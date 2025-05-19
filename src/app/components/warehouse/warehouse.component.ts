import { Component, OnInit } from '@angular/core';
import { GenericTableComponent } from '../../shared/generic-table/generic-table.component';
import { WarehouseService } from '../../services/warehouse.service';
import { Warehouse } from '../../interfaces/Warehouse';
import { CreateWarehouseDto } from '../../dtos/warehouse/create-warehouse.dto';

@Component({
  selector: 'app-warehouse',
  imports: [GenericTableComponent],
  templateUrl: './warehouse.component.html',
  styleUrl: './warehouse.component.scss'
})

export class WarehouseComponent implements OnInit {
  warehouseData: Warehouse[] = [];
  warehouseColumns: { key: 'id' | 'name' | 'location'; label: string; }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'location', label: 'Location' }
  ];  
  constructor( private warehouseService: WarehouseService) { }
  ngOnInit(): void {
    this.fetchData();
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

  addWarehouse(warehouse: CreateWarehouseDto): void {
    this.warehouseService.addWarehouse(warehouse).subscribe({
      next: (data) => {
        this.warehouseData.push(data);
      },
      error: (error) => {
        console.error('Error adding warehouse:', error);
      }
    })
  }
}
