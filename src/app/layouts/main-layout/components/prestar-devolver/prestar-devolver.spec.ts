import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrestarDevolverComponent } from './prestar-devolver';

describe('PrestarDevolverComponent', () => {
  let component: PrestarDevolverComponent;
  let fixture: ComponentFixture<PrestarDevolverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestarDevolverComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrestarDevolverComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
