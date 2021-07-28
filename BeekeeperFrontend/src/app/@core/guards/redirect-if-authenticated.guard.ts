import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  UrlTree,
  Router
} from '@angular/router';
// import { AuthService } from '@strapi-libs/ng-strapi-auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedirectIfAuthenticatedGuard implements CanLoad {
  constructor(
    // private authService: AuthService
    private router: Router
  ) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // if (!this.authService.isAuthenticated) {
    //   return true;
    // }

    return true;

    this.router.navigateByUrl('/pages/home');
    return true;
  }
}
