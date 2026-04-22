import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCurso } from './add-curso';

describe('AddCurso', () => {
  let component: AddCurso;
  let fixture: ComponentFixture<AddCurso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCurso],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCurso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
