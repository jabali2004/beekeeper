import { Component, Input, NgModule, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  constructor(private translate: TranslateService) {}

  selectedLanguageItem: string;

  ngOnInit() {
    switch (navigator.language) {
      case 'de-DE':
        this.selectedLanguageItem = 'de-DE';
        break;
      default:
        this.selectedLanguageItem = 'en';
        break;
    }
  }

  changeLanguage(language: string) {
    switch (language) {
      case 'de-DE':
        this.translate.use('de');
        break;
      default:
        this.translate.use('en');
        break;
    }
  }
}
