import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { lastValueFrom, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  AuthService as ApiAuthService,
  LoginReq,
  RegisterReq,
  UpdateUserPasswordReq,
  UpdateUserReq,
  UserDTO
} from '../../../api_client';
import { AuthTokenService } from './auth-token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl: string;
  private user: UserDTO;
  private token;

  private authState: Subject<void> = new Subject();
  private userState: Subject<void> = new Subject();

  public isAuthenticated: boolean;

  // TODO: Add error handling for login and register post
  // TODO: Cleanup AuthService

  constructor(
    private authService: ApiAuthService,
    private router: Router,
    private tokenService: AuthTokenService
  ) {
    this.apiUrl = environment.API_BASE_PATH;
    this.token = this.tokenService.getToken();

    if (this.token) {
      this.isAuthenticated = true;
      this.authState.next();
      this.loadUser();
    }
  }

  /**
   * Return AuthState Promise
   */
  public get AuthState(): Subject<void> {
    return this.authState;
  }

  /**
   * Return AuthState Promise
   */
  public get UserState(): Subject<void> {
    return this.userState;
  }

  /**
   * Login user with given credentials
   * and store jwt token and user data
   */
  public async login(email: string, password: string): Promise<void> {
    const loginReq = new LoginReq({ email, password });

    const res: { token: string } | HttpErrorResponse = await lastValueFrom(
      this.authService.apiAuthLoginPost(loginReq)
    );

    if (res) {
      this.setTokenResponse(res as { token: string });
    }
  }

  /**
   * Register new user with given data
   *
   * If registration has jwt token and user data in response
   * then store token and show user as logged in
   *
   */
  public async register(
    email: string,
    username: string,
    password: string,
    displayName: string
  ): Promise<void> {
    const req: RegisterReq = new RegisterReq({
      username,
      email,
      password,
      displayName
    });

    const res: {} | HttpErrorResponse = await lastValueFrom(
      this.authService.apiAuthRegisterPost(req)
    );

    if (res) {
      // TODO: Throw successfully registered.
      // this.setTokenResponse(res as IResAuthRegister);
    }
  }

  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    this.isAuthenticated = false;
    this.user = null;
    this.authState.next();
    this.tokenService.clearToken();
  }

  /**
   * Update user profile
   */
  public async updateProfile(updateReq: UpdateUserReq): Promise<void> {
    const res: UserDTO | HttpErrorResponse = await this.updateUser(updateReq);

    if (res) {
      this.user = new UserDTO(res);
      this.userState.next();
    }
  }

  public async updateProfilePassword(
    updatePasswordReq: UpdateUserPasswordReq
  ): Promise<void> {
    const res: UserDTO | HttpErrorResponse = await this.updatePassword(
      updatePasswordReq
    );

    if (res) {
      this.user = new UserDTO(res);
      this.userState.next();
    }
  }

  /**
   * Request password reset mail
   */
  // public async requestPasswordReset(email: string): Promise<void> {
  //   const res: IResRequestPasswordReset | HttpErrorResponse =
  //     await this.postRequestPasswordReset(email);
  // }

  /**
   * Reset user password
   */
  // public async resetPassword(
  //   passwordResetReq: IReqPasswordReset
  // ): Promise<void> {
  //   const res: IResPasswordReset | HttpErrorResponse =
  //     await this.postResetPassword(passwordResetReq);
  // }

  /**
   * return user obj
   */
  public getUser(): UserDTO {
    return this.user;
  }

  /**
   * Load own user obj
   */
  public async loadUser(): Promise<void> {
    this.requestUser().then((user) => {
      if (user) {
        this.user = new UserDTO(user);
        this.userState.next();
      }
    });
  }

  /**
   * Write token to store and
   * call auth state subject
   */
  private setTokenResponse(res: { token: string }): void {
    if (res.token) {
      this.token = res.token;

      this.isAuthenticated = true;
      this.tokenService.setToken(this.token);
      this.loadUser();

      this.authState.next();
      this.userState.next();
    }
  }

  /**
   * Call API for own user obj
   * and return it
   */
  private async requestUser(): Promise<UserDTO | HttpErrorResponse> {
    try {
      const res: UserDTO | HttpErrorResponse = await lastValueFrom(
        this.authService.apiAuthProfileGet()
      ).catch((err) => {
        console.error(err);
        return err;
      });

      return res;
    } catch (error) {
      throw new HttpErrorResponse(error);
    }
  }

  /**
   * Update user
   */
  private async updateUser(
    updateReq: UpdateUserReq
  ): Promise<UserDTO | HttpErrorResponse> {
    try {
      const res: UserDTO | HttpErrorResponse = await lastValueFrom(
        this.authService.apiAuthProfilePut(updateReq)
      );

      return res;
    } catch (error) {
      throw new HttpErrorResponse(error);
    }
  }

  /**
   * Update password of user
   */
  private async updatePassword(
    updatePasswordReq: UpdateUserPasswordReq
  ): Promise<UserDTO | HttpErrorResponse> {
    try {
      const res: UserDTO | HttpErrorResponse = await lastValueFrom(
        this.authService.apiAuthProfilePasswordPut(updatePasswordReq)
      );

      return res;
    } catch (error) {
      throw new HttpErrorResponse(error);
    }
  }

  /**
   * Login user and request token
   */
  // private async postLogin(
  //   identifier: string,
  //   password: string
  // ): Promise<IResAuthLogin | HttpErrorResponse> {
  //   try {
  //     const res: IResAuthLogin | HttpErrorResponse = (await this.authHttpClient
  //       .post(this.apiUrl + '/auth/local', {
  //         identifier,
  //         password
  //       })
  //       .toPromise()) as IResAuthLogin | HttpErrorResponse;

  //     return res;
  //   } catch (error) {
  //     throw new HttpErrorResponse(error);
  //   }
  // }

  /**
   * Register new user
   */
  // private async postRegister(
  //   registerReq: IReqAuthRegister
  // ): Promise<IResAuthRegister | HttpErrorResponse> {
  //   try {
  //     const res: IResAuthRegister | HttpErrorResponse =
  //       (await this.authHttpClient
  //         .post(this.apiUrl + '/auth/local/register', {
  //           username: registerReq.username,
  //           email: registerReq.email,
  //           password: registerReq.password
  //         })
  //         .toPromise()) as IResAuthRegister | HttpErrorResponse;

  //     return res;
  //   } catch (error) {
  //     throw new HttpErrorResponse(error);
  //   }
  // }

  /**
   * Request password reset
   */
  // private async postRequestPasswordReset(
  //   email: string
  // ): Promise<IResRequestPasswordReset | HttpErrorResponse> {
  //   try {
  //     const res: IResRequestPasswordReset | HttpErrorResponse =
  //       (await this.authHttpClient
  //         .post(this.apiUrl + '/auth/forgot-password', { email })
  //         .toPromise()) as IResRequestPasswordReset | HttpErrorResponse;

  //     return res;
  //   } catch (error) {
  //     throw new HttpErrorResponse(error);
  //   }
  // }

  /**
   * Reset password
   */
  // private async postResetPassword(
  //   passwordResetReq: IReqPasswordReset
  // ): Promise<IResPasswordReset | HttpErrorResponse> {
  //   try {
  //     const res: IResPasswordReset | HttpErrorResponse =
  //       (await this.authHttpClient
  //         .post(this.apiUrl + '/auth/reset-password', passwordResetReq)
  //         .toPromise()) as IResPasswordReset | HttpErrorResponse;

  //     return res;
  //   } catch (error) {
  //     throw new HttpErrorResponse(error);
  //   }
  // }
}
