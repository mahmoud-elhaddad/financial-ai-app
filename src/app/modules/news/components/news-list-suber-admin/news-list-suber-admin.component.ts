import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SizeEnum } from 'src/app/core/enums/size-enum';
import { IBreadcrumbItem } from 'src/app/core/interfaces/IBreadcrumbItem';
import { INewsFilterRequest, NewsItem } from 'src/app/core/interfaces/INews';
import { AlertifyService } from 'src/app/core/services/alertify-services/alertify.service';
import { NewsService } from 'src/app/core/services/news/news.service';

@Component({
  selector: 'app-news-list-suber-admin',
  standalone: false,
  templateUrl: './news-list-suber-admin.component.html',
  styleUrl: './news-list-suber-admin.component.scss'
})
export class NewsListSuberAdminComponent {
  noDataMessage: string = '';
  breadcrumbSizeEnum = SizeEnum;
  breadcrumbItems: IBreadcrumbItem[] = [];

  dataSource = new MatTableDataSource();
  columnConfigs: any[] = [];
  collectionSize: number = 0;
  selectedId: string |undefined;

  // Single source of truth for filters
  filter: INewsFilterRequest = {
    page: 1,
    limit: 10,
    title: undefined,
    status: undefined
  };
  @ViewChild('arciveDialogTemplate') arciveDialogTemplate!: TemplateRef<any>; 
  private dialogRef?: MatDialogRef<any>;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private newsService: NewsService,
    private alertify: AlertifyService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.setBreadcrumbs();
    this.translate.onLangChange.subscribe(() => this.setBreadcrumbs());

    this.loadColumnConfig();
    this.getNewsDataList();
  }

  private setBreadcrumbs(): void {
    this.breadcrumbItems = [
      { label: this.translate.instant('SIDEMENU.HOME'), url: 'dashboard', icon: 'fas fa-home' },
      { label: this.translate.instant('SIDEMENU.POSTS') }
    ];
  }

  getNewsDataList(): void {
    // Send filter object directly
    this.newsService.getNewsForSuperAdminList(this.filter).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.alertify.success(res?.message);
          this.dataSource.data = res?.data || [];
          this.collectionSize = res?.count || (res?.data?.length ?? 0);
        } else {
          this.alertify.error(res?.message);
        }


        if (!this.dataSource.data.length) {
          this.noDataMessage = this.translate.instant('GENERAL.NO_DATA');
        }
      },
      error: () => {
        this.dataSource.data = [];
        this.collectionSize = 0;
        this.noDataMessage = this.translate.instant('GENERAL.NO_DATA');
      }
    });
  }

  loadColumnConfig(): void {
    this.translate
      .get([
        'NEWS.TITLE',
         'NEWS.CERATED_AT',
         'NEWS.CERATED_BY',
        'USERS_LIST.STATUS',
        'USER_TABLE.ACTION'
      ])
      .subscribe(() => {
        this.columnConfigs = [
          { key: 'title', displayName: 'NEWS.TITLE' },
          { key: 'createdAt', displayName: 'NEWS.CERATED_AT', isDate: true },
          { key: 'createdByName', displayName: 'NEWS.CERATED_BY'},
          { key: 'status', displayName: "USERS_LIST.STATUS" },
          {
            key: 'action',
            displayName: 'USER_TABLE.ACTION',
            isAction: true,
            actions: [
              { type: 'view',  },
              { type: 'edit', allowedStatuses: ['draft', 'archived'] },
              { type: 'Archive', allowedStatuses: ['published'] }
            ]
          }
        ];
      });
  }

  applayFilter(): void {
    // normalize dates before API call


    this.filter.page = 1; // reset pagination
    this.getNewsDataList();
  }

  resetFilter(): void {
    this.filter = {
      page: 1,
      limit: 10,
      title: undefined,
      status: undefined

    };
    this.getNewsDataList();
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.getNewsDataList();
  }

  handleAction(event: { row: any; action: string }): void {
    if (event.action === 'view') {
      this.moveTo(event.row.id);
    }
     if (event.action === 'edit') {
      let id = event.row.id
      this.router.navigate(['/news/edit-post', id]);
    }
    if (event.action === 'Archive') {
      this.openDeleteDialog(event.row.id);
      // this.archivePost(event.row.id);
    }

  }

  archivePost() {
    if (this.selectedId) {
       const body = {
      id: this.selectedId
    };
    this.closeDeleteDialog();
    this.newsService.archivePost(body).subscribe({
      next: (res: any) => {
        if (res.isSuccess) {
          this.getNewsDataList();
          this.alertify.success(res?.message);

        } else {
          this.alertify.error(res?.message);
        }


      },

    });
    }
   
  }
  private moveTo(id: string): void {
    this.router.navigate(['/news/post-details', id]);
  }
  onBreadcrumbClicked(breadcrumbItem: IBreadcrumbItem) {
    this.router.navigate([breadcrumbItem.url]);

  }
    openDeleteDialog(id:string): void {
      if (!id) return;
    this.selectedId = id;
  
    this.dialogRef = this.dialog.open(this.arciveDialogTemplate, {
      width: '600px',
      panelClass: 'custom-dialog-container'
    });
  }
  closeDeleteDialog(): void {
   this.dialogRef?.close();
  }
 
}

