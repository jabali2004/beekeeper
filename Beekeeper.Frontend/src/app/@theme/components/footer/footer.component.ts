import { Component, Input, NgModule, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  public selectedLanguageItem: string;

  ngOnInit() {
    let language = navigator.language;
    const storedLanguage = localStorage.getItem('lang');

    if (storedLanguage) {
      language = storedLanguage;
    }

    switch (language) {
      case 'de-DE':
        this.selectedLanguageItem = 'de-DE';
        break;
      case 'de':
        this.selectedLanguageItem = 'de-DE';
        break;
      default:
        this.selectedLanguageItem = 'en';
        break;
    }
  }

  changeLanguage(language: string) {
    console.log(language);
    switch (language) {
      case 'de-DE':
        this.translate.use('de');
        localStorage.setItem('lang', 'de-DE');
        break;
      case 'de':
        this.translate.use('de');
        localStorage.setItem('lang', 'de');
        break;
      default:
        this.translate.use('en');
        localStorage.setItem('lang', 'en');
        break;
    }
  }
}
