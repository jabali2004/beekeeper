import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthBlockComponent } from './auth-block/auth-block.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule
} from '@nebular/theme';
import { AuthComponent } from './auth.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuthBlockComponent,
    AuthComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    RouterModule,
    NbCardModule,
    NbIconModule,
    NbLayoutModule,
    NbButtonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbAlertModule
  ]
})
export class AuthModule {}
