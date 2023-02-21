import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalCouncilComponent } from './final-council.component';

describe('FinalCouncilComponent', () => {
  let component: FinalCouncilComponent;
  let fixture: ComponentFixture<FinalCouncilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalCouncilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalCouncilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
