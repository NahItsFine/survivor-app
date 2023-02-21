import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineMatStepComponent } from './timeline-mat-step.component';

describe('TimelineMatStepComponent', () => {
  let component: TimelineMatStepComponent;
  let fixture: ComponentFixture<TimelineMatStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelineMatStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineMatStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
