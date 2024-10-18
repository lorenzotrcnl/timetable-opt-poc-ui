import { TestBed } from '@angular/core/testing';

import { DataJsonService } from './data-json.service';

describe('DataJsonService', () => {
  let service: DataJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
