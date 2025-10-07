import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/core/layout/components/app-layout/layout.component';
import { SystemSettingsComponent } from './components/system-settings.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
             { path: '', component: SystemSettingsComponent },
           
      
        ]
      },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSettingsRoutingModule { }
