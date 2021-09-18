import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkerWindowComponent } from './add-worker-window.component';

describe('AddWorkerWindowComponent', () => {
  let component: AddWorkerWindowComponent;
  let fixture: ComponentFixture<AddWorkerWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkerWindowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkerWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
