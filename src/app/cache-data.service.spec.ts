import { TestBed } from '@angular/core/testing';

import { CacheDataService } from './cache-data.service';

describe('CacheDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CacheDataService = TestBed.get(CacheDataService);
    expect(service).toBeTruthy();
  });
});
