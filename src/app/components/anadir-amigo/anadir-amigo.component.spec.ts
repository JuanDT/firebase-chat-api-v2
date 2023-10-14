import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirAmigoComponent } from './anadir-amigo.component';

describe('AnadirAmigoComponent', () => {
  let component: AnadirAmigoComponent;
  let fixture: ComponentFixture<AnadirAmigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnadirAmigoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnadirAmigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
