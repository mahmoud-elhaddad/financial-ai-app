import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ReusableArabdtSpinnerComponent } from './components/reusable-arabdt-spinner/reusable-arabdt-spinner.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { ReusableArabdtMoveNextSimilarControlDirective } from './directives/reusable-arabdt-move-next-similar-control.directive';
import { AlphabeticalSortPipe } from './pipes/alphabetical-sort/alphabetical-sort.pipe';
import { FormatTimePipe } from './pipes/format-time/format-time.pipe';
import { SafeHtmlPipe } from './pipes/safe-html/safe-html.pipe';
import { SharedTableComponent } from './components/shared-table/shared-table.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { HeaderComponent } from '../core/layout/components/header/header.component';
import { SidebarComponent } from '../core/layout/components/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { RouterModule } from '@angular/router';

// Add the HTML Editor Component
import { HtmlEditorComponent } from './components/html-editor/html-editor.component';

@NgModule({
  declarations: [
    ReusableArabdtSpinnerComponent,
    SnackbarComponent,
    SharedTableComponent,
    ReusableArabdtMoveNextSimilarControlDirective,
    AlphabeticalSortPipe,
    FormatTimePipe,
    SafeHtmlPipe,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    HtmlEditorComponent, // Add HTML Editor Component
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    NgbPaginationModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule, // Add ReactiveFormsModule for form support
    MatExpansionModule,
    RouterModule
  ],
  exports: [
    ReusableArabdtSpinnerComponent,
    SnackbarComponent,
    ReusableArabdtMoveNextSimilarControlDirective,
    AlphabeticalSortPipe,
    FormatTimePipe,
    SafeHtmlPipe,
    SharedTableComponent,
    HtmlEditorComponent, // Export HTML Editor Component
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    NgbPaginationModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule, // Export ReactiveFormsModule
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    HeaderComponent,
    SidebarComponent,
    MatExpansionModule,
    BreadcrumbsComponent
  ]
})
export class SharedModule {}
