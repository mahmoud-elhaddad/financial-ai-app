import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EventEmitter } from '@angular/core';
import { LanguageEnum } from '../../enums/language-enum/language-enum';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    currentLanguageEvent = new EventEmitter<LanguageEnum>();
    private currentLang: LanguageEnum = LanguageEnum.ar; // Default language

    constructor(
        private translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId: object
    ) { }

    initLang(): void {
        if (!isPlatformBrowser(this.platformId)) {
            this.switchLangCallBack(LanguageEnum.ar); // Set default for SSR
            return;
        }

        const storedLang = localStorage.getItem("lang");
        const isValidLang = storedLang && Object.values(LanguageEnum).includes(storedLang as LanguageEnum);

        this.currentLang = isValidLang ? storedLang as LanguageEnum : LanguageEnum.ar;

        if (!isValidLang) {
            localStorage.setItem("lang", this.currentLang);
        }

        this.switchLang(this.currentLang);
    }

    switchLang(language: LanguageEnum): void {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('lang', language);
        }
        this.currentLang = language;
        this.switchLangCallBack(language);
    }

    private switchLangCallBack(language: LanguageEnum): void {
        this.translate.use(language).subscribe(() => {
            this.currentLanguageEvent.emit(language);
            this.updateHtmlAttributes(language);
        });
    }

    private updateHtmlAttributes(language: LanguageEnum): void {
        if (isPlatformBrowser(this.platformId)) {
            const htmlTag = document.documentElement;
            htmlTag.setAttribute('dir', language === LanguageEnum.ar ? 'rtl' : 'ltr');
            htmlTag.setAttribute('lang', language);
        }
    }

    getCurrentLang(): LanguageEnum {
        return this.currentLang;
    }

    displayLang(): { text: string, flag: string } {
        return this.currentLang === LanguageEnum.ar
            ? {
                text: this.translate.instant('GENERAL.ARABIC_DISPALY_SWITCH'),
                flag: 'assets/images/en.png'
            }
            : {
                text: this.translate.instant('GENERAL.ENGLISH_DISPALY_SWITCH'),
                flag: 'assets/images/ar.png'
            };
    }
}