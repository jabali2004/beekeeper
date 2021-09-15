import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NbIconLibraries } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/@core/services/auth/auth.service';
import { NotificationService } from 'src/app/@core/services/notification.service';
import {
  IdentityResult,
  UpdateUserPasswordReq,
  UpdateUserReq,
  UserDTO
} from 'src/app/api_client';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  form: FormGroup = new FormBuilder().group({
    displayName: new FormControl(),
    email: new FormControl(),
    userName: new FormControl()
  });

  passwordForm: FormGroup = new FormBuilder().group({
    old_password: new FormControl(),
    password: new FormControl(),
    rePass: new FormControl()
  });

  oldUserObj: UserDTO;

  userObj = {
    displayName: null,
    email: null,
    userName: null,
    oldPassword: null,
    password: null,
    password_confirmation: null,
    provider: null
  };

  redirectDelay = 0;
  showMessages: any = {};

  submitted = false;
  passwordSubmitted = false;
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
  };

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public iconPack: NbIconLibraries
  ) {}

  ngOnInit(): void {
    // Import existing user obj
    this.oldUserObj = this.authService.getUser();

    if (this.oldUserObj) {
      this.userObj = {
        displayName: this.oldUserObj.displayName,
        userName: this.oldUserObj.userName,
        email: this.oldUserObj.email,
        oldPassword: null,
        password: null,
        password_confirmation: null,
        provider: null
      };
    }
    // Hook on update from user service
    this.authService.UserState.subscribe(() => {
      this.oldUserObj = this.authService.getUser();
      this.userObj = {
        displayName: this.oldUserObj.displayName,
        userName: this.oldUserObj.userName,
        email: this.oldUserObj.email,
        oldPassword: null,
        password: null,
        password_confirmation: null,
        provider: null
      };
    });
  }

  /**
   * Update UserData if changed
   */
  update(): void {
    this.submitted = true;
    const updateRequest: UpdateUserReq = new UpdateUserReq(this.userObj);

    if (!updateRequest.displayName && !updateRequest.displayName) {
      this.submitted = false;
      return;
    }

    this.authService.updateProfile(updateRequest).then(() => {
      this.submitted = false;
    });

    this.form.markAsPristine();
  }

  /**
   * Update password if changed
   * and confirmed
   */
  updatePassword(): void {
    this.passwordSubmitted = true;
    const updateRequest: UpdateUserPasswordReq = new UpdateUserPasswordReq(
      this.userObj
    );

    if (!updateRequest.password) {
      this.passwordSubmitted = false;
      return;
    }

    this.authService
      .updateProfilePassword(updateRequest)
      .then(() => {
        this.passwordSubmitted = false;
        this.passwordForm.controls.password.reset();
        this.passwordForm.controls.rePass.reset();
        this.passwordForm.controls.old_password.reset();
      })
      .catch((err: HttpErrorResponse) => {
        this.notificationService.show(
          this.translate.instant('auth.profile.messages.error'),
          err?.error?.message,
          'danger'
        );

        this.passwordSubmitted = false;
        this.passwordForm.controls.password.reset();
        this.passwordForm.controls.rePass.reset();
      });
  }
}
