import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddIngresoComponent } from './add-ingreso';

describe('AddIngresoComponent', () => {
  let component: AddIngresoComponent;
  let fixture: ComponentFixture<AddIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddIngresoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
