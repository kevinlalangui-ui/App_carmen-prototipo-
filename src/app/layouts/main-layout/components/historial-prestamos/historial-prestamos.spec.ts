import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HistorialPrestamosComponent } from './historial-prestamos';

describe('HistorialPrestamosComponent', () => {
  let component: HistorialPrestamosComponent;
  let fixture: ComponentFixture<HistorialPrestamosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialPrestamosComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialPrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});