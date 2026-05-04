import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaIngresosComponent } from './lista-ingresos';

describe('ListaIngresosComponent', () => {
  let component: ListaIngresosComponent;
  let fixture: ComponentFixture<ListaIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaIngresosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
