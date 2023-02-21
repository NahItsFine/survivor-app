import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartRoundDialogComponent } from './start-round-dialog.component';

describe('StartRoundDialogComponent', () => {
  let component: StartRoundDialogComponent;
  let fixture: ComponentFixture<StartRoundDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartRoundDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartRoundDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
