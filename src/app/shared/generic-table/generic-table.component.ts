import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-generic-table',
  imports: [],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent<T> {
  @Input() data: T[] = [];
  @Input() columns: { key: keyof T, label: string }[] = [];
}
