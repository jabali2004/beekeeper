import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbIconLibraries } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/@core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  showMessages: any = {
    error: true,
    success: true
  };

  errors: string[] = [];
  messages: string[] = [];
  submitted = false;
  rememberMe = false;

  authLoginReq = {
    email: null,
    password: null
  };

  config = {
    passwordRequired: true,
    passwordMinLength: 6,
    passwordMaxLength: 60,
    emailRequired: true
  };

  constructor(
    protected authService: AuthService,
    protected cd: ChangeDetectorRef,
    protected router: Router,
    protected translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.rememberMe = false;

    if (this.authService.isAuthenticated) {
      this.router.navigateByUrl('/pages/home');
    }
  }

  ngOnDestroy(): void {}

  /**
   * Login for local registered users
   */
  public login(): void {
    this.errors = [];
    this.messages = [];
    this.submitted = true;

    this.authService
      .login(this.authLoginReq.email, this.authLoginReq.password)
      .then((res) => {
        this.submitted = false;
        if (this.authService.isAuthenticated) {
          this.router.navigateByUrl('/pages');
        }
      })
      .catch((err: HttpErrorResponse) => {
        this.submitted = false;

        this.errors.push(
          this.translate.instant('errors.auth.login.password_or_email')
        );
      });
  }
}
