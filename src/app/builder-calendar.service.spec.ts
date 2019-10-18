import { TestBed } from '@angular/core/testing';

import { BuilderCalendarService } from './builder-calendar.service';

describe('BuilderCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BuilderCalendarService = TestBed.get(BuilderCalendarService);
    expect(service).toBeTruthy();
  });
});
