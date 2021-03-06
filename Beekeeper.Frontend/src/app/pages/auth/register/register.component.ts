import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/@core/services/auth/auth.service';

// TODO: refactor -> use interfaces and models
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
    displayName: '',
    userName: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];

  config = {
    displayNameRequired: true,
    displayNameMinLength: 2,
    displayNameMaxLength: 100,
    userNameRequired: true,
    userNameMinLength: 2,
    userNameMaxLength: 100,
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
        this.authRegisterReq.userName,
        this.authRegisterReq.password,
        this.authRegisterReq.displayName
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
