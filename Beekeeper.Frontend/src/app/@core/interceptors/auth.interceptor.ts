import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { throwError, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { AuthTokenService } from '../services/auth/auth-token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private tokenService: AuthTokenService) {}

  private AUTH_HEADER = 'Authorization';
  private token: string;

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.token = this.tokenService.getToken();

    if (!req.headers.has('Content-Type')) {
      req = req.clone({
        headers: req.headers.set('Content-Type', 'application/json')
      });
    }

    req = this.addAuthenticationToken(req);

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          // Intercept unauthorized request
          case 401:
            // Check if error response is caused by invalid token
            this.tokenService.clearToken();
            return this.router.navigateByUrl('/auth/logout');
            break;

          case 403:
            break;

          case 404:
            break;

          default:
            break;
        }

        return of(error);
      })
    ) as Observable<HttpEvent<any>>;
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    // If we do not have a token yet then we should not set the header.
    // Here we could first retrieve the token from where we store it.
    if (!this.token) {
      return request;
    }

    // If you are calling an outside domain then do not add the token.
    if (
      !request.url.match(environment.API_BASE_PATH) &&
      !request.url.match(window.location.origin)
    ) {
      return request;
    }

    return request.clone({
      headers: request.headers.set(this.AUTH_HEADER, 'Bearer ' + this.token)
    });
  }
}

// TODO: Add Token refresh and prettify
