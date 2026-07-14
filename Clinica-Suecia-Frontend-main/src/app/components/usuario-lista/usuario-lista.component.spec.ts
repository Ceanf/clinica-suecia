import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioListaComponent } from './usuario-lista.component';

describe('UsuarioListaComponent', () => {
  let component: UsuarioListaComponent;
  let fixture: ComponentFixture<UsuarioListaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuarioListaComponent]
    });
    fixture = TestBed.createComponent(UsuarioListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
