import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundCouncilComponent } from './round-council.component';

describe('RoundCouncilComponent', () => {
  let component: RoundCouncilComponent;
  let fixture: ComponentFixture<RoundCouncilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundCouncilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundCouncilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
