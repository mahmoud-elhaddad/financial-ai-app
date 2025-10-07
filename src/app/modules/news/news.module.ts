import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsRoutingModule } from './news-routing.module';
import { NewsListAdminsComponent } from './components/news-list-admins/news-list-admins.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewsListSuberAdminComponent } from './components/news-list-suber-admin/news-list-suber-admin.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { MatDialogContent } from "@angular/material/dialog";
import { MatDialogActions } from "../../../../node_modules/@angular/material/dialog/index";


@NgModule({
  declarations: [
    NewsListAdminsComponent,
    NewsListSuberAdminComponent,
    CreatePostComponent,
    EditPostComponent,
    PostDetailsComponent
  ],
  imports: [
    CommonModule,
    NewsRoutingModule,
    SharedModule, // This includes ReactiveFormsModule, TranslateModule, and HtmlEditorComponent
    RouterModule,
    
    
]
})
export class NewsModule { }
