import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from './@core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnDestroy, OnInit {
  constructor(
    public titleService: Title,
    private translate: TranslateService,
    private route: Router,
    private authService: AuthService
  ) {
    // Check browser Language and translate
    const language = navigator.language;

    // TODO: Store selected language for next visit

    switch (language) {
      case 'de-DE':
        this.translate.use('de');
        break;
      default:
        this.translate.use('en');
        break;
    }

    this.translate.get('title').subscribe((title) => {
      this.setTitle(title);
    });
  }

  ngOnInit(): void {}

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  ngOnDestroy() {}
}
