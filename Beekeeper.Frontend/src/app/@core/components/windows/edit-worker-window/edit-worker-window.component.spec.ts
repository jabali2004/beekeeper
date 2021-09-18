import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorkerWindowComponent } from './edit-worker-window.component';

describe('EditWorkerWindowComponent', () => {
  let component: EditWorkerWindowComponent;
  let fixture: ComponentFixture<EditWorkerWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWorkerWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkerWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
