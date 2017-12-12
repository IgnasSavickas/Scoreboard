import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersInputComponent } from './players-input.component';

describe('PlayersInputComponent', () => {
  let component: PlayersInputComponent;
  let fixture: ComponentFixture<PlayersInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
