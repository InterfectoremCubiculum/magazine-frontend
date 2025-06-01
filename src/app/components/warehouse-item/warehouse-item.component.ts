import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-warehouse-item',
  imports: [],
  templateUrl: './warehouse-item.component.html',
  styleUrl: './warehouse-item.component.scss'
})
export class WarehouseItemComponent {
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
    });
  }
}
