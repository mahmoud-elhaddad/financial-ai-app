import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemSettingsRoutingModule } from './system-settings-routing.module';
import { SystemSettingsComponent } from './components/system-settings.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [SystemSettingsComponent],
  imports: [
    CommonModule,
    SystemSettingsRoutingModule,
    SharedModule,
    RouterModule,
  ]
})
export class SystemSettingsModule { }
