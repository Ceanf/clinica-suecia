import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaListaComponent } from './cita-lista.component';

describe('CitaListaComponent', () => {
  let component: CitaListaComponent;
  let fixture: ComponentFixture<CitaListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CitaListaComponent]
    });
    fixture = TestBed.createComponent(CitaListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
