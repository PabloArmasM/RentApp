import { TestBed } from '@angular/core/testing';

import { DatProviderService } from './dat-provider.service';

describe('DatProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatProviderService = TestBed.get(DatProviderService);
    expect(service).toBeTruthy();
  });
});
