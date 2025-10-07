import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SizeEnum } from 'src/app/core/enums/size-enum';
import { IBreadcrumbItem } from 'src/app/core/interfaces/IBreadcrumbItem';
import { ICategoryFilterRequest as IFilterRequest } from 'src/app/core/interfaces/ICategoryFilterRquest';
import { CategoryService } from 'src/app/core/services/category/category.service';
import { DeleteCategoryConfirmDialog } from '../category-delete-dialog/delete-category-confirm-dialog.component';
import { AlertifyService } from 'src/app/core/services/alertify-services/alertify.service';


@Component({
  selector: 'app-categories-list',
  standalone: false,
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit {
  noDataMessage: string | undefined = undefined;
  breadcrumbSizeEnum = SizeEnum;
  breadcrumbItems: IBreadcrumbItem[] | undefined = undefined;

  dataSource = new MatTableDataSource();
  columnConfigs: any[] = [];
  collectionSize: number | undefined = undefined;

  // Single source of truth for filters
  filter: IFilterRequest = {
    page: 1,
    limit: 20,
    fullName: undefined,
  };

  constructor(
    private translate: TranslateService,
    private router: Router,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private alertify: AlertifyService,
  ) { }

  ngOnInit(): void {
    this.setBreadcrumbs();
    this.translate.onLangChange.subscribe(() => this.setBreadcrumbs());

    this.loadColumnConfig();
    this.getCategoriesDataList();
  }

  private setBreadcrumbs(): void {
    this.breadcrumbItems = [
      { label: this.translate.instant('SIDEMENU.HOME'), url: 'dashboard', icon: 'fas fa-home' },
      { label: this.translate.instant('SIDEMENU.CATEGORIES') }
    ];
  }

  getCategoriesDataList(): void {
    // Send filter object directly
    this.categoryService.getCategoriesList(this.filter).subscribe({
      next: (res: any) => {
        this.dataSource.data = res?.data || [];
        this.collectionSize = res?.count || (res?.data?.length ?? 0);

        if (!this.dataSource.data.length) {
          this.noDataMessage = this.translate.instant('CATEGORIES_LIST.NO_CATEGORIES');
        }
      }
    });
  }

  openCreateCategoryDialog(): void {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      width: '600px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Call your service to create the category
        this.categoryService.createCategory(result).subscribe((result) => {
          if (!result.isSuccess) {
            this.alertify.error(result.message);
          } else {
            this.alertify.success(this.translate.instant('CATEGORIES_LIST.CATEGORY_CREATED_SUCCESS'));
            this.getCategoriesDataList();
          }
        });
      }
    });
  }

  loadColumnConfig(): void {
    this.translate
      .get([
        'CATEGORIES_LIST.ARNAME',
        'CATEGORIES_LIST.ENNAME',
        'CATEGORIES_LIST.NUMBER_OF_NEWS',
        'CATEGORIES_TABLE.ACTION',
        'BUTTONS.EDIT'
      ])
      .subscribe(() => {
        this.columnConfigs = [
          { key: 'arN', displayName: 'CATEGORIES_LIST.ARNAME' },
          { key: 'enN', displayName: 'CATEGORIES_LIST.ENNAME' },
          { key: 'newsCount', displayName: 'CATEGORIES_LIST.NUMBER_OF_NEWS' },
          {
            key: 'action',
            displayName: 'CATEGORIES_TABLE.ACTION',
            isAction: true,
            actions: [
              { type: 'edit', label: 'BUTTONS.EDIT' },
              { type: 'delete', label: 'BUTTONS.DELETE' }
            ]
          }
        ];
      });
  }

  applyFilter(): void {
    this.filter.page = 1; // reset pagination
    this.getCategoriesDataList();
  }

  resetFilter(): void {
    this.filter = {
      page: 1,
      limit: 20,
      fullName: undefined,

    };
    this.getCategoriesDataList();
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.getCategoriesDataList();
  }

  handleAction(event: { row: any; action: string }): void {
    if (event.action === 'view') {
      this.moveTo(event.row.id);
    } else if (event.action === 'edit') {
      const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
        width: '600px',
        data: event.row
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          // Remove id if present in result
          const { id, ...updateData } = result;
          this.categoryService.updateCategory(event.row._id, updateData).subscribe((result) => {
            if (result.isSuccess) {
              this.alertify.success(this.translate.instant('CATEGORIES_LIST.CATEGORY_UPDATED_SUCCESS'));
              this.getCategoriesDataList();
            } else {
              this.alertify.error(result.message);
            }

          });
        }
      });
    } else if (event.action === 'delete') {
      const dialogRef = this.dialog.open(DeleteCategoryConfirmDialog, {
        width: '350px',
        data: { name: this.translate.currentLang === 'ar-SA' ? event.row.arN : event.row.enN }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.categoryService.deleteCategory(event.row._id).subscribe((data) => {
            if (data.isSuccess === false) {
              this.alertify.error(data.message);
            } else {
              this.alertify.success(this.translate.instant('CATEGORIES_LIST.CATEGORY_DELETED_SUCCESS'));
              this.getCategoriesDataList();
            }
          });
        }
      });
    }
  }

  private moveTo(id: string): void {
    this.router.navigate(['/categories-list', id]);
  }
  onBreadcrumbClicked(breadcrumbItem: IBreadcrumbItem) {
    this.router.navigate([breadcrumbItem.url]);

  }

}
