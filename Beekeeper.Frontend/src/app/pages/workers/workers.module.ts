import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkersRoutingModule } from './workers-routing.module';
import { WorkersComponent } from './workers.component';
import {
  NbActionsModule,
  NbCardModule,
  NbIconModule,
  NbListModule,
  NbTagModule
} from '@nebular/theme';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentsModule } from 'src/app/@core/components/components.module';

@NgModule({
  declarations: [WorkersComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    WorkersRoutingModule,
    NbIconModule,
    NbCardModule,
    NbListModule,
    NbActionsModule,
    NbTagModule,
    NgxPaginationModule
  ]
})
export class WorkersModule {}
