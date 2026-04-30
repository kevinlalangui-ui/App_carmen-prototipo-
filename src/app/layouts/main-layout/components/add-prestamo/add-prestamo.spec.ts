import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPrestamo } from './add-prestamo';

describe('AddPrestamo', () => {
  let component: AddPrestamo;
  let fixture: ComponentFixture<AddPrestamo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPrestamo],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPrestamo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
