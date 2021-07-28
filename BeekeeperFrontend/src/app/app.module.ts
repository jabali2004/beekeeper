import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbDatepickerModule,
  NbSidebarModule,
  NbMenuModule,
  NbDialogModule,
  NbWindowModule,
  NbToastrModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  HttpClientModule
} from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { NgScrollbar, NgScrollbarModule } from 'ngx-scrollbar';
import { GraphQLModule } from './graphql.module';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';

registerLocaleData(localeEn, 'en');
registerLocaleData(localeDe, 'de');

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NgbModule,
    NgScrollbarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      defaultLanguage: 'de'
    })
  ],
  providers: [
    Title,
    { provide: LOCALE_ID, useValue: 'de-DE' }
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

declare module '@angular/core' {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}
