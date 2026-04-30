import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrestamosListComponent } from './prestamos-list';

describe('PrestamosListComponent', () => {
  let component: PrestamosListComponent;
  let fixture: ComponentFixture<PrestamosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamosListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestamosListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
