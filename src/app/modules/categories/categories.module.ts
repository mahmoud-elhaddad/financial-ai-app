import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoriesListComponent } from './components/categories-list/categories-list.component';
import { CreateCategoryDialogComponent } from './components/create-category-dialog/create-category-dialog.component';


@NgModule({
  declarations: [CategoriesListComponent],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    SharedModule,
    RouterModule,
    CreateCategoryDialogComponent,
  ]
})
export class CategoriesModule { }
