import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { NbMenuModule } from '@nebular/theme';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { ThemeModule } from '../@theme/theme.module';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    TranslateModule
  ]
})
export class PagesModule {}
