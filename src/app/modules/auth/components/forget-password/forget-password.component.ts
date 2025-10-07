import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'src/app/core/services/alertify-services/alertify.service';

import { LoginService } from 'src/app/core/services/login/login.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  standalone: false,
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  currentLang: string;
  email: string | undefined;
  formsubmited:boolean = false;
  constructor(
    public loginService: LoginService,
    private router: Router,
    public route: ActivatedRoute,
    private alertify: AlertifyService,
    private _translateService: TranslateService,
    private storageService: StorageService,
  ) {
    this.currentLang = this.storageService.getItem('lang') || '{}';
  }

  ngOnInit(): void {

  }
  
  resetPassword() {
    this.formsubmited = true;
    if (!this.email) {
      // Optionally show an error message for empty email
      return;
    }
     this.formsubmited = false;
    this.loginService.forgotPassword(this.email).subscribe({
      next: (res) => {
        if (res?.isSuccess) {
          this.alertify.success(res?.message);
          this.router.navigate(['login']);
        } else {
          this.alertify.error(res?.message);
        }
        // this.router.navigate(['reset-password']);
      }
    });
  }








}
