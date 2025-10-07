import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IHtmlEditorStats,
  IHtmlEditorContent,
  IImageValidationConfig, 
  IImageValidationError,
  IValidationError
} from '../../../../shared/interfaces/Ihtml-editor.interface';
import { HtmlEditorComponent } from '../../../../shared/components/html-editor/html-editor.component';
import { CategoryService } from '../../../../core/services/category/category.service';
import { NewsService } from '../../../../core/services/news/news.service';
import { ICreatePostRequest } from '../../../../core/interfaces/ICreatePostRequest';
import { AlertifyService } from '../../../../core/services/alertify-services/alertify.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';

interface Category {
  id: string;
  name: string;
}

@Component({
  selector: 'app-create-post',
  standalone: false,
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.scss'
})
export class CreatePostComponent implements OnInit {
  @ViewChild(HtmlEditorComponent) htmlEditor?: HtmlEditorComponent;
  
  postForm: FormGroup;
  categories: Category[] = [];
  isSubmitting = false;
  isDraftSubmitting = false;
  coverImageFile: File | null = null;
  coverImagePreview: string | null = null;
  showValidationErrors = false; // Control when to show validation errors
  // Removed imageValidationErrors - now using direct ViewChild access for better performance

  // Image validation configuration
  imageValidationConfig: IImageValidationConfig = {
    maxFileSize: 2 * 1024 * 1024, // 2MB
    maxImageCount: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxWidth: 1200,
    maxHeight: 800,
    
    validateDimensions: true,
    allowBase64: true,
    maxBase64Size: 1.5 * 1024 * 1024 // 1.5MB for base64
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoryService: CategoryService,
    private newsService: NewsService,
    private alertify: AlertifyService,
    private translate: TranslateService,
    private location: Location
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200),
    Validators.pattern(/^[A-Za-z\u0600-\u06FF\s]+$/)]],
      content: ['', [Validators.minLength(10)]], // Remove required for draft
      category: ['', Validators.required],
      coverImage: [null] // File input
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.categories = response.data.map((category: any) => ({
            id: category._id || category.id,
            name: this.getCategoryNameByLanguage(category)
          }));
        } else {
          this.categories = [];
        }
      },
      error: (error) => {
        // Handle category loading errors
        if (error.error && error.error.message) {
          this.alertify.error(error.error.message);
        } else if (error.message) {
          this.alertify.error(error.message);
        } else {
          this.alertify.error(this.translate.instant('POST.CATEGORIES_LOAD_ERROR'));
        }
        this.categories = [];
      }
    });
  }

  private getCategoryNameByLanguage(category: any): string {
    const currentLang = this.translate.currentLang || this.translate.defaultLang || 'en';
    
    if (currentLang === 'ar') {
      return category.arN || category.name || category.enN || '';
    } else {
      return category.enN || category.name || category.arN || '';
    }
  }

  onCoverImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Clear previous errors
      this.postForm.get('coverImage')?.setErrors(null);
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.postForm.get('coverImage')?.setErrors({ fileType: true });
        this.alertify.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.postForm.get('coverImage')?.setErrors({ fileSize: true });
        this.alertify.error('Image size must be less than 5MB');
        return;
      }

      this.coverImageFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverImagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeCoverImage(): void {
    this.coverImageFile = null;
    this.coverImagePreview = null;
    this.postForm.get('coverImage')?.setValue(null);
    this.postForm.get('coverImage')?.setErrors(null);
  }

  private convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => {
        reject(new Error('Failed to convert image to base64'));
      };
      reader.readAsDataURL(file);
    });
  }

  onStatsChanged(stats: IHtmlEditorStats): void {
    
    if (!stats.isValid) {
      this.postForm.get('content')?.setErrors({ invalid: true });
    } else {
      this.postForm.get('content')?.setErrors(null);
    }
  }

  async onPublish(): Promise<void> {
    this.showValidationErrors = true;
    
    const validationErrors = this.htmlEditor?.getValidationErrors() || [];
    
    // For publish, we need full validation
    const isContentValid = this.postForm.get('content')?.value && this.postForm.get('content')?.value.trim().length >= 10;
    
    if (this.postForm.valid && validationErrors.length === 0 && isContentValid) {
      this.isSubmitting = true;
      await this.publishPost();
    } else {
      // Show validation errors
      this.showFormValidationErrors();
      if (validationErrors.length > 0) {
        validationErrors.forEach(error => {
          this.alertify.error(error.message);
        });
      }
    }
  }

  async onSaveDraft(): Promise<void> {
    this.showValidationErrors = true;
    
    // For draft, only title is required
    if (this.postForm.get('title')?.valid) {
      this.isDraftSubmitting = true;
      await this.saveDraftPost();
    } else {
      // Show only title validation errors
      this.showFormValidationErrors();
    }
  }

  private async publishPost(): Promise<void> {
    try {
      // Get content on-demand from editor
      const editorContent = this.htmlEditor?.getContent();
      
      // Convert cover image to base64 if selected
      let coverImageBase64: string | undefined;
      if (this.coverImageFile) {
        coverImageBase64 = await this.convertImageToBase64(this.coverImageFile);
      }
      
      const postData: ICreatePostRequest = {
        t: this.postForm.value.title, // title
        c: editorContent?.html || '', // content
        catId: this.postForm.value.category, // category ID
        covImgB64: coverImageBase64, // cover image as base64
        // createdAt: new Date().toISOString()
      };


      this.newsService.createPost(postData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          
          if (response.isSuccess) {
            this.alertify.success(response.message);
             this.location.back();
          } else {
            this.alertify.error(response.message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.handleApiError(error);
        }
      });
    } catch (error) {
      this.isSubmitting = false;
      this.alertify.error('Error processing cover image');
    }
  }

  private async saveDraftPost(): Promise<void> {
    try {
      // Get content on-demand from editor
      const editorContent = this.htmlEditor?.getContent();
      
      // Convert cover image to base64 if selected
      let coverImageBase64: string | undefined;
      if (this.coverImageFile) {
        coverImageBase64 = await this.convertImageToBase64(this.coverImageFile);
      }
      
      // Build postData object with only non-empty fields for draft
      const postData: any = {
        t: this.postForm.value.title // title is always required for draft
      };
      
      // Only add content if it exists and is not empty
      const content = editorContent?.html?.trim();
      if (content && content.length > 0) {
        postData.c = content;
      }
      
      // Only add category if it's selected
      if (this.postForm.value.category) {
        postData.catId = this.postForm.value.category;
      }
      
      // Only add cover image if it exists
      if (coverImageBase64) {
        postData.covImgB64 = coverImageBase64;
      }
      
      this.newsService.saveDraft(postData).subscribe({
        next: (response) => {
          this.isDraftSubmitting = false;
          
          if (response.isSuccess) {
            this.alertify.success(response.message);
            this.location.back();
          } else {
            this.alertify.error(response.message);
          }
        },
        error: (error) => {
          this.isDraftSubmitting = false;
          this.handleApiError(error);
        }
      });
    } catch (error) {
      this.isDraftSubmitting = false;
      this.alertify.error('Error processing cover image');
    }
  }

  private handleApiError(error: any): void {
    // Handle HTTP errors (network, server errors, etc.)
    if (error.error && error.error.message) {
      this.alertify.error(error.error.message);
    } else if (error.message) {
      this.alertify.error(error.message);
    } else {
      this.alertify.error(this.translate.instant('POST.UNEXPECTED_ERROR'));
    }
  }

  private showFormValidationErrors(): void {
    // Mark all controls as touched to show validation errors
    Object.keys(this.postForm.controls).forEach(key => {
      this.postForm.get(key)?.markAsTouched();
    });
  }

  onCancel(): void {
    this.location.back();
  }

  /**
   * Check validation errors from HTML Editor (performance-optimized)
   * Returns current validation errors without triggering change detection
   */
  checkValidationErrors(): IValidationError[] {
    return this.htmlEditor?.getValidationErrors() || [];
  }

  /**
   * Check if there are any validation errors
   * Performance: O(1) - direct property access
   */
  hasValidationErrors(): boolean {
    return this.htmlEditor?.hasValidationErrors || false;
  }

  get titleControl() {
    return this.postForm.get('title');
  }

  get contentControl() {
    return this.postForm.get('content');
  }

  get categoryControl() {
    return this.postForm.get('category');
  }

  get coverImageControl() {
    return this.postForm.get('coverImage');
  }
}
