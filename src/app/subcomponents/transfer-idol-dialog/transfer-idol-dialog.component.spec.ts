import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferIdolDialogComponent } from './transfer-idol-dialog.component';

describe('TransferIdolDialogComponent', () => {
  let component: TransferIdolDialogComponent;
  let fixture: ComponentFixture<TransferIdolDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferIdolDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferIdolDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
