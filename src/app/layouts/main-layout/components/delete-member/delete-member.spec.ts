import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMember } from './delete-member';

describe('DeleteMember', () => {
  let component: DeleteMember;
  let fixture: ComponentFixture<DeleteMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMember],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteMember);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
