import { TestBed } from '@angular/core/testing';

import { CanAccessCanvasGuard } from './can-access-canvas.guard';

describe('CanAccessCanvasGuard', () => {
  let guard: CanAccessCanvasGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanAccessCanvasGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
