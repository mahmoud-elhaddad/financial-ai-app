import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { NgPipesModule } from 'ngx-pipes';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { SharedModule } from './shared/shared.module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';  // ✅ must be this package

import { LoaderComponent } from './shared/components/loader/loader.component';
import { SharedTableComponent } from './shared/components/shared-table/shared-table.component';
import { MatNativeDateModule } from '@angular/material/core';
import { LayoutComponent } from './core/layout/components/app-layout/layout.component';
import { InterceptorInterceptor } from './core/interceptors/auth-interceptors/auth.interceptor';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json'); // ✅ works if version is correct
}

@NgModule({
  declarations: [
    AppComponent,
       
       LayoutComponent,
    LoaderComponent,
  ],
  exports: [
    SharedTableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgPipesModule,
    NgbModule,
    MatExpansionModule,
    SharedModule,
    MatNativeDateModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar-SA',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
   providers: [   
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorInterceptor,
      multi: true, 
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true, 
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
