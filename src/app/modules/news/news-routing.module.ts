import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from 'src/app/core/layout/components/app-layout/layout.component';
import { NewsListAdminsComponent } from './components/news-list-admins/news-list-admins.component';
import { NewsListSuberAdminComponent } from './components/news-list-suber-admin/news-list-suber-admin.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';

const routes: Routes = [
    {
          path: '',
          component: LayoutComponent,
          children: [
               { path: '', component: NewsListAdminsComponent },
              { path: 'super', component: NewsListSuberAdminComponent } ,
              { path: 'create-post', component: CreatePostComponent } ,
              { path: 'edit-post/:id', component: EditPostComponent } ,
              { path: 'post-details/:id', component: PostDetailsComponent } ,
        
          ]
        },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
