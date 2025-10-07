import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashbaord/dashboard.module').then(m => m.DashboardModule)
  },
 {
    path: 'users-list',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)
  },
 {
    path: 'system-settings',
    loadChildren: () => import('./modules/system-settings/system-settings.module').then(m => m.SystemSettingsModule)
  },
 {
    path: 'categories',
    loadChildren: () => import('./modules/categories/categories.module').then(m => m.CategoriesModule)
  },
 {
    path: 'news',
    loadChildren: () => import('./modules/news/news.module').then(m => m.NewsModule)
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
