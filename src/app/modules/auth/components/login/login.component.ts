import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from '../../../../core/services/alertify-services/alertify.service';
import { LoginService } from '../../../../core/services/login/login.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../core/services/language-services/language.service';
import { LanguageEnum } from 'src/app/core/enums/language-enum/language-enum';

@Component({
    selector: 'app-login',
    standalone: false,
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    loginRequest: any = {
        email: '',
        password: '',
    };
    showPassword: boolean = false;
    currentLang = '';
    lang = '';
    constructor(
        public loginService: LoginService,
        private router: Router,
        public route: ActivatedRoute,
        private alertify: AlertifyService,
        private _translateService: TranslateService,
        private langService: LanguageService
    ) { }

    ngOnInit(): void {
        this.currentLang = localStorage.getItem("lang") || '{}';
    }
    displayLang() {
        return this.currentLang === LanguageEnum.ar
            ? { text: this._translateService.instant('GENERAL.ARABIC_DISPALY_SWITCH'), flag: 'assets/images/en.png' }
            : { text: this._translateService.instant('GENERAL.ENGLISH_DISPALY_SWITCH'), flag: 'assets/images/ar.png' };
    }
    switchLang() {
        if (this.currentLang && Object.keys(this.currentLang).length === 0 && this.currentLang.constructor === Object) {
            this.langService.switchLang(LanguageEnum.ar);
        }
        else {
            this.currentLang = this.currentLang === LanguageEnum.ar ? LanguageEnum.en : LanguageEnum.ar;
            this.langService.switchLang(this.currentLang as LanguageEnum);
        }
    }
    togglePasswordVisibility() {
        this.showPassword = !this.showPassword; // Toggle the value of showPassword
    }

    Space(event: any) {
        if (event.target.selectionStart === 0 && event.code == "Space") {
            event.preventDefault();
        }
    }

    checkEmail() {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(this.loginRequest?.email).toLowerCase());
    }

    validateSpace() {
        return (
            ((!this.loginRequest?.email) || (!this.loginRequest?.email.trim())) &&
            ((!this.loginRequest?.password) || (!this.loginRequest?.password.trim()))
        );
    }

    validatePasswordComplexity(password: string): boolean {
        // At least 1 uppercase, 1 lowercase, 1 number, 1 special character
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;
        return pattern.test(password);
    }

    validateForm() {
        if (!this.loginRequest ||
            this.validateSpace() ||
            !this.checkEmail() ||
            !this.loginRequest.email ||
            !this.loginRequest.password ) {
            return false;
        }
        return true;
    }

    // Login method
    login() {
       
        this.loginService.login(this.loginRequest).subscribe({
            next: (res) => {
                
                if (res?.isSuccess && res.data?.accessToken) {
                     this.alertify.success(res?.message);
                    this.router.navigate(['/dashboard']);
                } else{
                     this.alertify.error(res?.message);
                }
            },
           
        });
    }
}


