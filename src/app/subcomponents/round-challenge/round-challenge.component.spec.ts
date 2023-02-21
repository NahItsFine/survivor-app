import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundChallengeComponent } from './round-challenge.component';

describe('RoundChallengeComponent', () => {
  let component: RoundChallengeComponent;
  let fixture: ComponentFixture<RoundChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundChallengeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
