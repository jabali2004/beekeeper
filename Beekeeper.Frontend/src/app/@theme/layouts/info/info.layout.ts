import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-layout',
  styleUrls: ['./info.layout.scss'],
  template: `
    <nb-layout>
      <nb-layout-header fixed>
        <app-header [useSidebar]="false"></app-header>
      </nb-layout-header>

      <!-- <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar> -->

      <nb-layout-column style="padding: 0;">
        <ng-content></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
        <app-footer></app-footer>
      </nb-layout-footer>
    </nb-layout>
  `
})
export class InfoLayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
