import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertifyService } from 'src/app/core/services/alertify-services/alertify.service';
import { NewsService } from 'src/app/core/services/news/news.service';
import { IPost } from 'src/app/core/interfaces/INews';
import { SizeEnum } from 'src/app/core/enums/size-enum';
import { IBreadcrumbItem } from 'src/app/core/interfaces/IBreadcrumbItem';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-post-details',
  standalone: false,
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.scss'
})
export class PostDetailsComponent implements OnInit {

postId: string | undefined;
postDetails: IPost | undefined;
breadcrumbSizeEnum= SizeEnum;
breadcrumbItems: IBreadcrumbItem[] = [
    { label: this.translate.instant('SIDEMENU.HOME'), url: 'dashboard', icon: 'fas fa-home' },
    { label: this.translate.instant('SIDEMENU.POSTS'), },
    { label: this.translate.instant('NEWS.DETAILS'), },
  ];
  currentLang: string = 'ar';
 constructor(
    private route: ActivatedRoute,
    private location: Location,
    private newsService: NewsService,
        private alertify: AlertifyService,
         private translate: TranslateService,
         private router: Router
  ) {}
  ngOnInit(): void {
     this.currentLang = this.translate.currentLang || this.translate.getDefaultLang();

    // Update if language changes dynamically
    this.translate.onLangChange.subscribe(event => {
      this.currentLang = event.lang;
    });
    this.translate.onLangChange.subscribe(() => {
    this.setBreadcrumbs();
  });
    this.postId = this.route.snapshot.paramMap.get('id') ?? '';
    this.getNewsById();
  }
   setBreadcrumbs(){
         this.breadcrumbItems = [
    { label: this.translate.instant('SIDEMENU.HOME'), url: 'dashboard', icon: 'fas fa-home' },
    { label: this.translate.instant('SIDEMENU.POSTS') },
    { label: this.translate.instant('NEWS.DETAILS'), },
  ];
    }
      onBreadcrumbClicked(breadcrumbItem : IBreadcrumbItem){
    console.log('breadcrumbClicked', breadcrumbItem)
    this.router.navigate([breadcrumbItem.url]);
   
  }
   getNewsById() {
    if (this.postId) {
      this.newsService.getNewsById(this.postId).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.postDetails = res?.data;
          } else {
            this.alertify.error(res.message);
          }
        },

      });
    }

  }
    backPage(): void {
    this.location.back();
  }
}
