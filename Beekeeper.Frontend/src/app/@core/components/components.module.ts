import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbSelectModule,
  NbToggleModule,
  NbCheckboxModule,
  NbStepperModule,
  NbTooltipModule,
  NbSpinnerModule,
  NbIconModule,
  NbAlertModule,
  NbFormFieldModule,
  NbActionsModule,
  NbUserModule,
  NbContextMenuModule,
  NbWindowModule
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractDialogComponent } from './dialogs/abstract-dialog/abstract-dialog.component';
import { AddWorkerWindowComponent } from './windows/add-worker-window/add-worker-window.component';
import { EditWorkerWindowComponent } from './windows/edit-worker-window/edit-worker-window.component';

@NgModule({
  declarations: [AbstractDialogComponent, AddWorkerWindowComponent, EditWorkerWindowComponent],
  imports: [
    CommonModule,
    NbCardModule,
    TranslateModule,
    NbInputModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbSelectModule,
    NbToggleModule,
    NbCheckboxModule,
    NbStepperModule,
    NbTooltipModule,
    NbSpinnerModule,
    NbIconModule,
    NbAlertModule,
    NbActionsModule,
    NbUserModule,
    NbContextMenuModule,
    NbFormFieldModule,
    NbWindowModule
  ],
  exports: [AbstractDialogComponent, AddWorkerWindowComponent],
  entryComponents: []
})
export class ComponentsModule {}
