import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from 'src/app/core/services/users/users.service';
import { SizeEnum } from 'src/app/core/enums/size-enum';
import { IBreadcrumbItem } from 'src/app/core/interfaces/IBreadcrumbItem';
import { IUserDetails } from 'src/app/core/interfaces/IUserFilterRequest';
import { AlertifyService } from 'src/app/core/services/alertify-services/alertify.service';

@Component({
  selector: 'app-users-details',
  standalone:false,
  templateUrl: './users-details.component.html',
  styleUrl: './users-details.component.scss'
})
export class UsersDetailsComponent implements OnInit {
  userId: string;
  breadcrumbSizeEnum= SizeEnum;
  userData: IUserDetails | undefined;
 breadcrumbItems: IBreadcrumbItem[] = [
    { label: this.translate.instant('SIDEMENU.HOME'), url: 'dashboard', icon: 'fas fa-home' },
    { label: this.translate.instant('SIDEMENU.USERS_LIST'),url: 'users-list' },
    { label: this.translate.instant('USERS_LIST.DETAILS'), },
  ];
  constructor(private route: ActivatedRoute,  private translate: TranslateService,private alertify: AlertifyService,
  private router: Router, private usersService: UsersService) {
    this.userId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
     this.translate.onLangChange.subscribe(() => {
    this.setBreadcrumbs();
  });
    
    this.getUserDetails();
  }
  setBreadcrumbs(){
         this.breadcrumbItems = [
    { label: this.translate.instant('SIDEMENU.HOME'), url: 'dashboard', icon: 'fas fa-home' },
    { label: this.translate.instant('SIDEMENU.USERS_LIST'),url: 'users-list' },
    { label: this.translate.instant('USERS_LIST.DETAILS'), },
  ];
    }
  getUserDetails(){
    if (this.userId) {
      this.usersService.getUserDetails(this.userId).subscribe({
    next: (res: any) => {
          this.userData = res.data;
        },
    error: (err: any) => {
        
          this.alertify.error(err?.message);
        }
      });
    }
  }
    onBreadcrumbClicked(breadcrumbItem : IBreadcrumbItem){
    console.log('breadcrumbClicked', breadcrumbItem)
    this.router.navigate([breadcrumbItem.url]);
   
  }
}

