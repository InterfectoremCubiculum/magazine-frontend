import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { authResolverResolver } from './auth-resolver.resolver';

describe('authResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => authResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
