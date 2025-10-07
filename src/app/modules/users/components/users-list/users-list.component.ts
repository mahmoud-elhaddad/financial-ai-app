import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SizeEnum } from 'src/app/core/enums/size-enum';
import { IBreadcrumbItem } from 'src/app/core/interfaces/IBreadcrumbItem';
import { IUserFilterRequest as IFilterRequest } from 'src/app/core/interfaces/IUserFilterRequest';

import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-users-list',
  standalone: false,
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  noDataMessage: string = '';
  breadcrumbSizeEnum = SizeEnum;
  breadcrumbItems: IBreadcrumbItem[] = [];

  dataSource = new MatTableDataSource();
  columnConfigs: any[] = [];
  collectionSize: number = 0;

  // Single source of truth for filters
  filter: IFilterRequest = {
    page: 1,
    limit: 10,
    name: undefined,
    mobileNumber: undefined,
    startDate: undefined,
    endDate: undefined,

  };

  constructor(
    private translate: TranslateService,
    private router: Router,
    private usersService: UsersService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.setBreadcrumbs();
    this.translate.onLangChange.subscribe(() => this.setBreadcrumbs());

    this.loadColumnConfig();
    this.getUsersDataList();
  }

  private setBreadcrumbs(): void {
    this.breadcrumbItems = [
      { label: this.translate.instant('SIDEMENU.HOME'), url: 'dashboard', icon: 'fas fa-home' },
      { label: this.translate.instant('SIDEMENU.USERS_LIST') }
    ];
  }

  getUsersDataList(): void {
    // Send filter object directly
    this.usersService.getUsersList(this.filter).subscribe({
      next: (res: any) => {
        this.dataSource.data = res?.data || [];
        this.collectionSize = res?.count || (res?.data?.length ?? 0);

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
        'USERS_LIST.NAME',
        'USERS_LIST.MOBILE_NUM',
        'USERS_LIST.DATE',
        'USER_TABLE.ACTION'
      ])
      .subscribe(() => {
        this.columnConfigs = [
          { key: 'fullName', displayName: 'USERS_LIST.NAME' },
          { key: 'mn', displayName: 'USERS_LIST.MOBILE_NUM' },
          { key: 'rd', displayName: 'USERS_LIST.DATE', isDate: true },
          {
            key: 'action',
            displayName: 'USER_TABLE.ACTION',
            isAction: true,
            actions: [{ type: 'view' }]
          }
        ];
      });
  }

  applayFilter(): void {
    // normalize dates before API call
    this.filter.startDate = this.filter.startDate
      ? this.datePipe.transform(this.filter.startDate, 'yyyy-MM-dd')
      : null;

    this.filter.endDate = this.filter.endDate
      ? this.datePipe.transform(this.filter.endDate, 'yyyy-MM-dd')
      : null;

    this.filter.page = 1; // reset pagination
    this.getUsersDataList();
  }

  resetFilter(): void {
    this.filter = {
      page: 1,
      limit: 10,
      name: undefined,
      mobileNumber: undefined,
      startDate: undefined,
      endDate: undefined,

    };
    this.getUsersDataList();
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.getUsersDataList();
  }

  handleAction(event: { row: any; action: string }): void {
    if (event.action === 'view') {
      this.moveTo(event.row.id);
    }
  }

  private moveTo(id: string): void {
    this.router.navigate(['/users-list', id]);
  }
  onBreadcrumbClicked(breadcrumbItem: IBreadcrumbItem) {
    this.router.navigate([breadcrumbItem.url]);

  }
}
