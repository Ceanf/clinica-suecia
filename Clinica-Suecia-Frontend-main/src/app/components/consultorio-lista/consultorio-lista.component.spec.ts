import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultorioListaComponent } from './consultorio-lista.component';

describe('ConsultorioListaComponent', () => {
  let component: ConsultorioListaComponent;
  let fixture: ComponentFixture<ConsultorioListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultorioListaComponent]
    });
    fixture = TestBed.createComponent(ConsultorioListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
