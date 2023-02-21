import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmVoteDialogComponent } from './confirm-vote-dialog.component';

describe('ConfirmVoteDialogComponent', () => {
  let component: ConfirmVoteDialogComponent;
  let fixture: ComponentFixture<ConfirmVoteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmVoteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmVoteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
