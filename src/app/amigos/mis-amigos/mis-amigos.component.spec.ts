import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisAmigosComponent } from './mis-amigos.component';

describe('MisAmigosComponent', () => {
  let component: MisAmigosComponent;
  let fixture: ComponentFixture<MisAmigosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisAmigosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisAmigosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
