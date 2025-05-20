import { TestBed } from '@angular/core/testing';

import { ProductSupplierService } from './product-supplier.service';

describe('ProductSupplierService', () => {
  let service: ProductSupplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductSupplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
