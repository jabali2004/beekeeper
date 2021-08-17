import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  subscription: any;

  authenticated = false;
  token = '';

  // showcase of how to use the onAuthenticationChange method
  constructor(
    protected location: Location // private themeService: NbThemeService
  ) {
    // const savedTheme = localStorage.getItem('theme');
    // if (savedTheme) {
    //   this.themeService.changeTheme(savedTheme);
    // } else {
    //   this.themeService.changeTheme('dark');
    // }
  }

  back(): boolean {
    this.location.back();
    return false;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
