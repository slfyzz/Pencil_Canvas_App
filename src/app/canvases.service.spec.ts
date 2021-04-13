import { TestBed } from '@angular/core/testing';

import { CanvasesService } from './canvases.service';

describe('CanvasesService', () => {
  let service: CanvasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanvasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
