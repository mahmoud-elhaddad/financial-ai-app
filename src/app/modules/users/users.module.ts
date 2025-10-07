import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { UsersDetailsComponent } from './components/users-details/users-details.component';
import { UsersListComponent } from './components/users-list/users-list.component';


@NgModule({
  declarations: [UsersDetailsComponent,UsersListComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    RouterModule,
  ]
})
export class UsersModule { }
