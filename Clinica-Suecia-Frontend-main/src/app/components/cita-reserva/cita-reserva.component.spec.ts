import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaReservaComponent } from './cita-reserva.component';

describe('CitaReservaComponent', () => {
  let component: CitaReservaComponent;
  let fixture: ComponentFixture<CitaReservaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CitaReservaComponent]
    });
    fixture = TestBed.createComponent(CitaReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
