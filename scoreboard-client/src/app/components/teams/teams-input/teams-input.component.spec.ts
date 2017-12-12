import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsInputComponent } from './teams-input.component';

describe('TeamsInputComponent', () => {
  let component: TeamsInputComponent;
  let fixture: ComponentFixture<TeamsInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamsInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
