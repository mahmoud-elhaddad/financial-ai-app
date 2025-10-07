import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { LanguageService } from 'src/app/core/services/language-services/language.service';
import { LanguageEnum } from 'src/app/core/enums/language-enum/language-enum';
import { IUser } from 'src/app/core/interfaces/IUser';
import { StorageService } from 'src/app/core/services/storage.service';
@Component({
    selector: 'app-header',
    standalone:false,
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
})
export class HeaderComponent {
    currentLang:string | undefined;
   
    moveSideMenu: boolean = false;
    @Output() toggleSideMenu = new EventEmitter<boolean>();
    @Input() isSideMenuVisible = false;
    userData:IUser | undefined;
    constructor(
        private langService: LanguageService,
        private storageService: StorageService,
        @Inject(PLATFORM_ID) private platformId: Object,
           private _translateService: TranslateService,
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.currentLang = localStorage.getItem("lang") || '{}';
            } else {
                this.currentLang = '{}';
            }
      this.userData = JSON.parse(this.storageService.getItem('user_data') || '{}');
    }
    ngOnInit(): void {
        
        
       
    }
    get userRole(): string {
        const email = this.userData?.email || '';
        return email.includes('super') ? this._translateService.instant('GENERAL.SUPER') : this._translateService.instant('GENERAL.ADMIN') ;
    }
    switchLanguage(): void {
        const newLang = this.langService.getCurrentLang() === LanguageEnum.ar
            ? LanguageEnum.en
            : LanguageEnum.ar;
        this.langService.switchLang(newLang);
    }

    displayLanguage(): { text: string, flag: string } {
        return this.langService.displayLang();
    }
    openSideMenu() {
        this.moveSideMenu = !this.moveSideMenu; // Toggle before emitting
        this.toggleSideMenu.emit(this.moveSideMenu);
        
    }
     handleSideMenuChange(value: boolean) {
    this.isSideMenuVisible = value;
  }

}
