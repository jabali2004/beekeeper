import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NbWindowRef } from '@nebular/theme';
import { CreateWorkerReq, WorkerService } from 'src/app/api_client';

@Component({
  selector: 'app-add-worker-window',
  templateUrl: './add-worker-window.component.html',
  styleUrls: ['./add-worker-window.component.scss']
})
export class AddWorkerWindowComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(
    private workerService: WorkerService,
    protected windowRef: NbWindowRef
  ) {}

  ngOnInit(): void {
    this.formGroup = new CreateWorkerReq().getFormGroup();
  }

  public save(): void {
    // this.workerService.apiWorkerPost()
  }

  public cancel(): void {
    this.windowRef.close();
  }
}
