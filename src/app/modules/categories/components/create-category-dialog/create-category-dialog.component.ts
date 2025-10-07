import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-create-category-dialog',
  templateUrl: './create-category-dialog.component.html',
  styleUrls: ['./create-category-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule
  ]
})
export class CreateCategoryDialogComponent {
    public submitted = false;
    categoryForm: FormGroup;
  direction: 'rtl' | 'ltr' = 'rtl';
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService
  ) {
    this.categoryForm = this.fb.group({
      arN: [data?.arN || '', [
        Validators.required,
        Validators.pattern(/^(?!\s+$)[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF0-9 ]+$/)
      ]],
      enN: [data?.enN || '', [
        Validators.required,
        Validators.pattern(/^(?!\s+$)[A-Za-z0-9 ]+$/)
      ]]
    });
    this.setDirection();
    this.translate.onLangChange.subscribe(() => this.setDirection());
  }

  private setDirection() {
    this.direction = this.translate.currentLang === 'ar-SA' ? 'rtl' : 'ltr';
  }

    onSubmit() {
      this.submitted = true;
      this.categoryForm.markAllAsTouched();
      if (this.categoryForm.valid) {
        const result = {
          ...this.categoryForm.value
        };
        if (this.data?.id) {
          result.id = this.data.id;
        }
        this.dialogRef.close(result);
      }
    }

    onCancel() {
        this.dialogRef.close();
    }
}