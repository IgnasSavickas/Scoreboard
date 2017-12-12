import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesInputComponent } from './games-input.component';

describe('GamesInputComponent', () => {
  let component: GamesInputComponent;
  let fixture: ComponentFixture<GamesInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamesInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
