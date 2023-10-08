import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarAmigoComponent } from './agregar-amigo.component';

describe('AgregarAmigoComponent', () => {
  let component: AgregarAmigoComponent;
  let fixture: ComponentFixture<AgregarAmigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarAmigoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarAmigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
