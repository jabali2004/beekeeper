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
  NbContextMenuModule
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractDialogComponent } from './dialogs/abstract-dialog/abstract-dialog.component';

@NgModule({
  declarations: [AbstractDialogComponent],
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
    NbFormFieldModule
  ],
  exports: [AbstractDialogComponent],
  entryComponents: []
})
export class ComponentsModule {}
