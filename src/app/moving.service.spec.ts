import { TestBed } from '@angular/core/testing';

import { MovingService } from './moving.service';

describe('MovingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MovingService = TestBed.get(MovingService);
    expect(service).toBeTruthy();
  });
});
