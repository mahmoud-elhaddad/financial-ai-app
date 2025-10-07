import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'delete-category-confirm-dialog',
  templateUrl: './delete-category-confirm-dialog.component.html',
  styleUrls: ['./delete-category-confirm-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslateModule
  ]
})
export class DeleteCategoryConfirmDialog {
  direction: 'rtl' | 'ltr' = 'ltr';
  constructor(
    public dialogRef: MatDialogRef<DeleteCategoryConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public translate: TranslateService
  ) {
    this.setDirection();
    this.translate.onLangChange.subscribe(() => this.setDirection());
  }

  private setDirection() {
    this.direction = this.translate.currentLang === 'ar-SA' ? 'rtl' : 'ltr';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
