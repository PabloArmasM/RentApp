import { TestBed } from '@angular/core/testing';

import { FormatingService } from './formating.service';

describe('FormatingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FormatingService = TestBed.get(FormatingService);
    expect(service).toBeTruthy();
  });
});
