import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/@core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  redirectDelay = 0;
  showMessages: any = {
    error: true,
    success: true
  };
  authRegisterReq = {
    // firstname: '',
    // lastname: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];

  config = {
    firstnameRequired: false,
    firstnameMinLength: 2,
    firstnameMaxLength: 100,
    lastnameRequired: false,
    lastnameMinLength: 2,
    lastnameMaxLength: 100,
    usernameRequired: true,
    usernameMinLength: 2,
    usernameMaxLength: 100,
    emailRequired: true,
    passwordRequired: true,
    passwordMinLength: 6,
    passwordMaxLength: 60
    // termsRequired: true,
  };

  constructor(
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected authService: AuthService,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.authService.AuthState) {
      this.authService.logout();
    }
  }

  ngOnDestroy(): void {}

  register(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.authService
      .register(
        this.authRegisterReq.email,
        this.authRegisterReq.username,
        this.authRegisterReq.password
      )
      .then(() => {
        this.router.navigateByUrl('/auth/login');
      })
      .catch((error: HttpErrorResponse) => {
        this.submitted = false;

        if (error.status === 400) {
          this.errors.push(
            this.translate.instant('errors.auth.register.password_or_email')
          );
        } else {
          this.errors.push(
            this.translate.instant('errors.auth.register.undefined')
          );
        }
      });
  }
}