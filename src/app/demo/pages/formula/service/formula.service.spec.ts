import { TestBed } from '@angular/core/testing';

import { FormulaMedicaService } from './formula.service';

describe('FormulaService', () => {
  let service: FormulaMedicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormulaMedicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
