import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS_SUBJECT, MENU_ITEMS } from './pages-menu';
// import { AuthService } from '@strapi-libs/ng-strapi-auth';
import { NbMenuItem } from '@nebular/theme';
import {
  Router,
  NavigationEnd,
  NavigationStart,
  ActivatedRoute,
  ActivatedRouteSnapshot
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pages',
  template: `
    <app-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </app-one-column-layout>
  `
})
export class PagesComponent implements OnInit {
  menu: NbMenuItem[];
  public href = '';

  constructor(
    // private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService
  ) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/pages/home' || event.url === '/pages/profile') {
          this.updateMenuHiddenState(true);
        } else {
          this.updateMenuHiddenState(false);
        }
      }
    });
  }

  ngOnInit(): void {
    this.href = this.router.url;
    this.menu = MENU_ITEMS;

    // href prüfen und visibility von Menüpunkten schalten
    if (this.href === '/pages/home' || this.href === '/pages/profile') {
      this.updateMenuHiddenState(true);
    }

    this.translateService.onLangChange.subscribe((event) =>
      this.translateMenuItems()
    );
    this.translateMenuItems();
  }

  /**
   * Check visibility
   */
  private handleVisibility(menu: NbMenuItem): void {
    // load requested rights and groups
    if (!menu.data) {
      menu.hidden = false;
      return;
    }

    // recursive child check
    if (menu.children) {
      menu.children.forEach((child) => {
        this.handleVisibility(child);
      });
    }

    // const restrictedAccess: boolean = menu.data.restrictedAccess as boolean;
    // if (restrictedAccess && this.authService.isAuthenticated) {
    //   menu.hidden = false;
    // } else if (restrictedAccess) {
    //   menu.hidden = true;
    // }
  }

  /**
   * Translate recursive menu items
   */
  private translateMenuItems(): void {
    this.menu.forEach((item) => this.translateMenuItem(item));
  }

  /**
   * Translate menu item
   */
  private translateMenuItem(menuItem: NbMenuItem): void {
    if (menuItem.children && menuItem.children !== null) {
      menuItem.children.forEach((item) => this.translateMenuItem(item));
    }

    menuItem.title = this.translateService.instant(menuItem.data.translation);
  }

  /**
   * Hide menu items
   */
  private updateMenuHiddenState(hidden: boolean): void {
    if (this.menu && this.menu !== null) {
      for (const item of this.menu) {
        item.hidden = hidden;
      }
    }
  }

  /**
   * Set project id in route
   */
  private setProjectIds(id: string): void {
    if (!this.menu) {
      return;
    }

    this.menu.forEach((item) => {
      item.link = item.link.replace(':id', id);
    });
  }
}
