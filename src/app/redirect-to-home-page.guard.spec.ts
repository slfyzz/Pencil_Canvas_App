import { TestBed } from '@angular/core/testing';

import { RedirectToHomePageGuard } from './redirect-to-home-page.guard';

describe('RedirectToHomePageGuard', () => {
  let guard: RedirectToHomePageGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RedirectToHomePageGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
