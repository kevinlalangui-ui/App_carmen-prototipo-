import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoMember } from './info-member';

describe('InfoMember', () => {
  let component: InfoMember;
  let fixture: ComponentFixture<InfoMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoMember],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoMember);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
