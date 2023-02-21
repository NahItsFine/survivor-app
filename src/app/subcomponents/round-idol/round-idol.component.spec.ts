import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundIdolComponent } from './round-idol.component';

describe('RoundIdolComponent', () => {
  let component: RoundIdolComponent;
  let fixture: ComponentFixture<RoundIdolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundIdolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundIdolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
