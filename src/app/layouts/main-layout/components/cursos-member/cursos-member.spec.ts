import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosMember } from './cursos-member';

describe('CursosMember', () => {
  let component: CursosMember;
  let fixture: ComponentFixture<CursosMember>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CursosMember],
    }).compileComponents();

    fixture = TestBed.createComponent(CursosMember);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
