import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LanguageService } from './core/services/language-services/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoaderComponent } from "./shared/components/loader/loader.component";

import { CommonModule } from '@angular/common';
import { HeaderComponent } from './core/layout/components/header/header.component';
import { SidebarComponent } from './core/layout/components/sidebar/sidebar.component';
import { filter } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: false,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    providers: [TranslateService]
})
export class AppComponent {
    title = 'Future-AI';
    isLogin: boolean = false;
    isLoading:boolean = false;

    ngOnInit(): void {
        this.langService.initLang();
        // Navigate to /login if at root
   
    }
    constructor(private router: Router , private langService: LanguageService) {
    
    }
}
