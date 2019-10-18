import { TestBed } from '@angular/core/testing';

import { ThermalPrinterService } from './thermal-printer.service';

describe('ThermalPrinterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThermalPrinterService = TestBed.get(ThermalPrinterService);
    expect(service).toBeTruthy();
  });
});
