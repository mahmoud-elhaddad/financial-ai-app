import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IResetPassword } from 'src/app/core/interfaces/IResetPassword';
import { SYSTEM_CONSTANTS } from 'src/app/core/models/constants/app.constants';
import { AlertifyService } from 'src/app/core/services/alertify-services/alertify.service';
import { LoginService } from 'src/app/core/services/login/login.service';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})

export class ResetPasswordComponent {
  currentLang: string | undefined;
  password: string | undefined;
  confPassword: string | undefined;
  passwordPattern = SYSTEM_CONSTANTS.PASSWORD_PATTERN;
  showPassword = false;
  showConfirmPassword = false;
  resetData: IResetPassword = {} as IResetPassword;
  token: string | undefined;
  constructor(
    public loginService: LoginService,
    private router: Router,
    public route: ActivatedRoute,
    private alertify: AlertifyService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.currentLang = localStorage.getItem("lang") || '{}';

    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.setResetDataFromToken(this.token);
  }
  setResetDataFromToken(token: string): void {
    try {
      const urlDecoded = decodeURIComponent(token);
      const jsonString = atob(urlDecoded);
      this.resetData.userId = JSON.parse(jsonString).userId;
    } catch {
      this.alertify.error('Invalid or expired reset link');

    }
  }

  resetPassword() {
    if (this.password !== this.confPassword) {
      // Optionally show error for password mismatch
      return;
    }


    this.resetData.newPassword = this.password || '';



    this.loginService.resetPassword(this.resetData).subscribe({
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

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
