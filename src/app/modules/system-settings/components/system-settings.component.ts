import { Component, OnInit } from '@angular/core';
import { SystemSettingsService } from 'src/app/core/services/system-settings/system-settings.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SizeEnum } from 'src/app/core/enums/size-enum';
import { IBreadcrumbItem } from 'src/app/core/interfaces/IBreadcrumbItem';
import { AlertifyService } from 'src/app/core/services/alertify-services/alertify.service';
import { ISystemSettings } from 'src/app/core/interfaces/ISystemSettings';
import { IUser } from 'src/app/core/interfaces/IUser';
import { StorageService } from 'src/app/core/services/storage.service';
import { SYSTEM_SETTINGS_LIMITS } from 'src/app/core/models/constants/app.constants';

@Component({
  selector: 'app-system-settings',
  standalone: false,
  templateUrl: './system-settings.component.html',
  styleUrl: './system-settings.component.scss'
})
export class SystemSettingsComponent implements OnInit {
  breadcrumbSizeEnum = SizeEnum
  breadcrumbItems: IBreadcrumbItem[] | undefined;

  systemSettings: ISystemSettings | undefined;
  userData: IUser | undefined;
  constructor(
    private router: Router,
    private translate: TranslateService,
    private systemSettingsService: SystemSettingsService,
    private alertify: AlertifyService,
    private storageService: StorageService
  ) {

  }

  ngOnInit(): void {
    this.setBreadcrumbs();
    this.translate.onLangChange.subscribe(() => {
      this.setBreadcrumbs();

    });
    this.getSystemData();
  }
  setBreadcrumbs() {
    this.breadcrumbItems = [
      { label: this.translate.instant('SIDEMENU.HOME'), url: 'dashboard', icon: 'fas fa-home' },
      { label: this.translate.instant('SIDEMENU.SYSTEM_SETTING'), }
    ];
  }
  onBreadcrumbClicked(breadcrumbItem: IBreadcrumbItem) {

    this.router.navigate([breadcrumbItem.url]);

  }
  saveSettings(): void {
    if (this.isValid()) {
      this.userData = JSON.parse(this.storageService.getItem('user_data') || '{}');
      if (this.systemSettings) {
        this.systemSettingsService.updateSystemSettings(this.systemSettings).subscribe({
          next: (res) => {
            if (res.isSuccess) {
               this.alertify.success(res.message);
               this.systemSettings = {
                sessionTimeoutMinutes: res.data.stm,
                otpValidationSeconds: res.data.otp,
              };
            } else{
              this.alertify.error(res.message);
            }
           
          },
          error: (err) => {
            this.alertify.error(err?.message || 'Failed to update settings');
          }
        });
      }

    }
  }

  // Validation check
  isValid(): boolean {
    return (
      this.systemSettings?.sessionTimeoutMinutes !== undefined &&
      this.systemSettings?.sessionTimeoutMinutes >= SYSTEM_SETTINGS_LIMITS.SESSION_TIMEOUT.MIN &&
      this.systemSettings?.sessionTimeoutMinutes <= SYSTEM_SETTINGS_LIMITS.SESSION_TIMEOUT.MAX &&
      this.systemSettings?.otpValidationSeconds !== undefined &&
      this.systemSettings?.otpValidationSeconds >= SYSTEM_SETTINGS_LIMITS.OTP_VALIDATION.MIN &&
      this.systemSettings?.otpValidationSeconds <= SYSTEM_SETTINGS_LIMITS.OTP_VALIDATION.MAX
    );

  }
  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
  getSystemData() {
    this.systemSettingsService.getSystemSettings().subscribe({
      next: (res) => {
          if (res.isSuccess) {
            if (res.data.stm !== undefined && res.data.otp !== undefined) {
              this.systemSettings = {
                sessionTimeoutMinutes: res.data.stm,
                otpValidationSeconds: res.data.otp,
              };
            }          
          } else{
             this.alertify.error(res.message);
          }
           
      },
      error: (err) => {
        this.alertify.error(err?.message);
      }
    });
  }
}
