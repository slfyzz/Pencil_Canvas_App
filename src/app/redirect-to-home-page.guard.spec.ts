import { TestBed } from '@angular/core/testing';

import { RedirectToHomePageGuardIfAuth } from './redirect-to-home-page.guard';

describe('RedirectToHomePageGuardIfAuth', () => {
  let guard: RedirectToHomePageGuardIfAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RedirectToHomePageGuardIfAuth);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
