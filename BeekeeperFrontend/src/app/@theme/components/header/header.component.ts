import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
  NbMenuItem,
  NbMenuBag
} from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserDTO } from 'src/app/api_client';
import { AuthService } from 'src/app/@core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly = false;
  @Input() useSidebar = true;

  user: UserDTO;

  themes = [
    {
      value: 'default',
      name: 'Light'
    },
    {
      value: 'dark',
      name: 'Dark'
    }
  ];

  currentTheme = 'dark';

  isAuthenticated: boolean;

  userMenu = [
    { title: 'Profile', data: { id: 'profile' } },
    { title: 'Log out', data: { id: 'logout' } }
  ];

  headerMenu: NbMenuItem[] = [
    {
      title: 'Anmelden',
      data: { translate: 'header.login' },
      link: '/auth/login'
    },
    {
      title: 'Registrieren',
      data: { translate: 'header.register' },
      link: '/auth/register'
    }
  ];

  profileImage: SafeUrl;

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.translate.instant('header.login');
    this.translate.instant('header.register');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.themeService.changeTheme(savedTheme);
    }

    this.currentTheme = this.themeService.currentTheme;

    if (this.authService.getUser()) {
      this.user = this.authService.getUser();
      // this.profileImageService.loadImage(this.user.id);
    }

    this.authService.UserState.subscribe(() => {
      this.user = this.authService.getUser();
      // this.profileImageService.loadImage(this.user.id);
    });

    // this.userService
    //   .getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => (this.user = users.nick));

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );

    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName: string) => {
        this.currentTheme = themeName;
        localStorage.setItem('theme', themeName);
      });

    this.menuService.onItemClick().subscribe((bag: NbMenuBag) => {
      if (bag.item.data) {
        if (bag.item.data.id === 'logout') {
          this.router.navigateByUrl('/auth/logout');
        }
        if (bag.item.data.id === 'profile') {
          this.router.navigateByUrl('/pages/profile');
        }
      }
    });

    this.isAuthenticated = this.authService.isAuthenticated;
    this.authService.AuthState.subscribe(() => {
      this.isAuthenticated = this.authService.isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  loginClick() {
    this.router.navigateByUrl('/auth/login');
  }

  registerClick() {
    this.router.navigateByUrl('/auth/register');
  }
}
