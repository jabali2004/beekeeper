import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbIconModule,
    NbButtonModule,
    NbCardModule,
    NbSpinnerModule,
    NbAlertModule
  ]
})
export class ProfileModule {}
