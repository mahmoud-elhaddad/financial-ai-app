import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  forwardRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { HtmlEditorService } from '../../services/html-editor.service';
import { 
  IHtmlEditorConfig, 
  IHtmlEditorStats,
  IHtmlEditorContent,
  IImageValidationConfig,
  IImageInfo,
  IImageValidationError,
  IValidationError
} from '../../interfaces/Ihtml-editor.interface';

@Component({
  selector: 'app-html-editor',
  standalone: false,
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HtmlEditorComponent),
      multi: true
    }
  ]
})
export class HtmlEditorComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('editorElement', { static: true }) 
  private editorElement?: ElementRef<HTMLDivElement>;
  
  @Input() config: Partial<IHtmlEditorConfig> = {};
  @Input() imageValidationConfig: Partial<IImageValidationConfig> = {};
  @Input() placeholder: string = 'Write something...';
  @Input() readOnly: boolean = false;
  @Input() showWordCount: boolean = true;
  @Input() showCharCount: boolean = true;
  @Input() showImageCount: boolean = true;
  @Input() maxWords?: number;
  @Input() maxChars?: number;
  @Input() debounceTime: number = 300;
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() enableImageValidation: boolean = true;
  @Input() direction: 'ltr' | 'rtl' | 'auto' = 'auto';

  @Output() statsChanged = new EventEmitter<IHtmlEditorStats>();
  
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
  @Output() imageAdded = new EventEmitter<IImageInfo>();
  @Output() imageRemoved = new EventEmitter<IImageInfo>();

  // Dependency Injection
  readonly htmlEditorService = inject(HtmlEditorService); // Made  for template access
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly document = inject(DOCUMENT);
  
  private quillEditor: Quill | null = null;
  private destroy$ = new Subject<void>();
  private contentChange$ = new Subject<string>();
  mergedImageConfig: IImageValidationConfig = this.htmlEditorService.defaultImageValidation;
  
  value: string = ''; // Made  for template access
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  // Component state
  wordCount: number = 0;
  charCount: number = 0;
  imageCount: number = 0;
  images: IImageInfo[] = [];
  isValid: boolean = true;
  isFocused: boolean = false;
  isDisabled: boolean = false;
  validationErrors: IValidationError[] = [];
  isRTL: boolean = false;

  ngOnInit(): void {
    this.detectDirection();
    this.mergedImageConfig = this.htmlEditorService.mergeImageValidationConfig(this.imageValidationConfig);
    this.setupContentChangeSubscription();
  }

  ngAfterViewInit(): void {
    this.initializeEditor();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (this.quillEditor) {
      this.quillEditor = null as any;
    }
  }


  private detectDirection(): void {
    if (this.direction === 'auto') {
      // Auto-detect from document or language
      const htmlDir = this.document.documentElement.dir;
      const lang = this.document.documentElement.lang;
      console.log('htmlDir', htmlDir);
	  console.log('lang', lang);
      this.isRTL = htmlDir === 'rtl' || 
                   lang.startsWith('ar')
    } else {
      this.isRTL = this.direction === 'rtl';
    }
  }

  /**
   * Initialize Quill editor with image validation and RTL support
   */
  private initializeEditor(): void {
    if (!this.editorElement) {
      console.error('Editor element not found');
      return;
    }

    const editorConfig = this.htmlEditorService.mergeConfig({
      ...this.config,
      placeholder: this.placeholder,
      readOnly: this.readOnly
    }, this.isRTL);

    // Add RTL-specific modules if needed
    if (this.isRTL && !this.config.modules) {
      editorConfig.modules = {
        ...editorConfig.modules,
        toolbar: this.getRTLToolbar()
      };
    }

    this.quillEditor = this.htmlEditorService.createEditor(
      this.editorElement.nativeElement,
      editorConfig,
      this.enableImageValidation ? this.mergedImageConfig : undefined
    );

    if (this.quillEditor) {
      this.setupEditorEventHandlers();
      this.applyInitialStyles();
      this.setEditorDirection();
      this.setInitialContent();
      
    }
  }

  private setupEditorEventHandlers(): void {
    if (!this.quillEditor) return;

    this.quillEditor.on('text-change', (delta, oldDelta, source) => {
      if (this.quillEditor) {
        const html = this.quillEditor.root.innerHTML;
        this.trackImageChanges(html);
        this.contentChange$.next(html);
      }
    });

    this.quillEditor.on('selection-change', (range, oldRange, source) => {
      if (range) {
        if (!this.isFocused) {
          this.isFocused = true;
          this.focus.emit();
        }
      } else {
        if (this.isFocused) {
          this.isFocused = false;
          this.onTouched();
          this.blur.emit();
        }
      }
    });
  }

  private trackImageChanges(html: string): void {
    const currentImages = this.htmlEditorService.extractImagesFromContent(html);
    const previousImageIds = this.images.map(img => img.id);
    const currentImageIds = currentImages.map(img => img.id);

    const removedImages = this.images.filter(img => !currentImageIds.includes(img.id));
    removedImages.forEach(img => this.imageRemoved.emit(img));

    const addedImages = currentImages.filter(img => !previousImageIds.includes(img.id));
    addedImages.forEach(img => this.imageAdded.emit(img));

    this.images = currentImages;
    this.imageCount = currentImages.length;
  }

  private setupContentChangeSubscription(): void {
    this.contentChange$
      .pipe(
        debounceTime(this.debounceTime),
        takeUntil(this.destroy$)
      )
      .subscribe(async html => {
        await this.handleContentChange(html);
      });
  }

  private async handleContentChange(html: string): Promise<void> {
    this.value = html;
    this.updateCounts(html);
    await this.validateContent(html);
    this.onChange(html);
    
    this.statsChanged.emit({
      wordCount: this.wordCount,
      charCount: this.charCount,
      imageCount: this.imageCount,
      isValid: this.isValid,
      hasContent: html.trim().length > 0
    });
    
    this.cdr.markForCheck();
  }

  private updateCounts(html: string): void {
    if (this.showWordCount) {
      this.wordCount = this.htmlEditorService.getWordCount(html);
    }
    
    if (this.showCharCount) {
      this.charCount = this.htmlEditorService.getCharacterCount(html);
    }

    if (this.showImageCount) {
      this.imageCount = this.htmlEditorService.getImageCount(html);
    }
  }

  private async validateContent(html: string): Promise<void> {
    let valid = true;
    this.validationErrors = [];
    
    // Required content validation
    if (this.required && !this.htmlEditorService.validateContent(html)) {
      valid = false;
      this.validationErrors.push({
        message: 'HTML_EDITOR.CONTENT_REQUIRED'
      });
    }
    
    // Character count validation
    if (this.maxChars && this.charCount > this.maxChars) {
      valid = false;
      this.validationErrors.push({
        message: 'HTML_EDITOR.MAX_CHARS_EXCEEDED',
        maxValue: this.maxChars,
        currentValue: this.charCount
      });
    }
    
    // Word count validation
    if (this.maxWords && this.wordCount > this.maxWords) {
      valid = false;
      this.validationErrors.push({
        message: 'HTML_EDITOR.MAX_WORDS_EXCEEDED',
        maxValue: this.maxWords,
        currentValue: this.wordCount
      });
    }

    // Image validation
    if (this.enableImageValidation && this.imageCount > 0) {
      try {
        const imageErrors = await this.htmlEditorService.validateContentImages(html, this.mergedImageConfig);
        if (imageErrors.length > 0) {
          valid = false;
          this.validationErrors.push(...imageErrors.map(error => ({
            message: error.message,
            currentValue: error.currentValue,
            maxValue: error.maxValue
          })));
        }
      } catch (error) {
        console.error('Image validation failed:', error);
        valid = false;
        this.validationErrors.push({
          message: 'HTML_EDITOR.IMAGE_VALIDATION_ERRORS'
        });
      }
    }
    
    this.isValid = valid;
  }

  private applyInitialStyles(): void {
    if (!this.editorElement) return;
    
    const editorContainer = this.editorElement.nativeElement.querySelector('.ql-editor') as HTMLElement;
    if (editorContainer) {
      editorContainer.style.minHeight = '200px';
    }
  }

  private async setInitialContent(): Promise<void> {
    if (this.value && this.quillEditor) {
      this.quillEditor.root.innerHTML = this.value;
      this.updateCounts(this.value);
      await this.validateContent(this.value);
      this.trackImageChanges(this.value);
    }
  }

  writeValue(value: string): void {
    this.value = value || '';
    if (this.quillEditor) {
      this.quillEditor.root.innerHTML = this.value;
      this.updateCounts(this.value);
      this.validateContent(this.value);
      this.trackImageChanges(this.value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    if (this.quillEditor) {
      this.quillEditor.enable(!isDisabled);
    }
  }

   getHTML(): string {
    return this.quillEditor ? this.quillEditor.root.innerHTML : this.value;
  }

   getText(): string {
    return this.quillEditor ? this.quillEditor.getText() : this.htmlEditorService.getPlainText(this.value);
  }

   getContents(): any {
    return this.quillEditor ? this.quillEditor.getContents() : null;
  }

   getImages(): IImageInfo[] {
    return this.images;
  }

   getImageCount(): number {
    return this.imageCount;
  }

   getContent(): IHtmlEditorContent {
    return {
      html: this.value,
      text: this.htmlEditorService.getPlainText(this.value),
      images: this.images
    };
  }

   getStats(): IHtmlEditorStats {
    return {
      wordCount: this.wordCount,
      charCount: this.charCount,
      imageCount: this.imageCount,
      isValid: this.isValid,
      hasContent: this.value.trim().length > 0
    };
  }

   /**
    * Get current validation errors (replaces event listening)
    * Performance: O(1) - direct property access
    */
   getValidationErrors(): IValidationError[] {
    return this.validationErrors;
  }


   /**
    * Get validation error count
    * Performance: O(1) - direct property access
    */
   getValidationErrorCount(): number {
    return this.validationErrors.length;
  }

   /**
    * Clear validation errors
    * Performance: O(1) - direct property assignment
    */
   clearValidationErrors(): void {
    this.validationErrors = [];
   }

   /**
    * Get the primary error key (first error)
    * Performance: O(1) - direct property access
    */
   getPrimaryErrorKey(): string {
    return this.validationErrors.length > 0 ? this.validationErrors[0].message : '';
   }

   /**
    * Get error parameters for translation interpolation
    * Performance: O(1) - direct property access
    */
   getErrorParams(): any {
    if (this.validationErrors.length > 0) {
      const error = this.validationErrors[0];
      return {
        max: error.maxValue,
        current: error.currentValue
      };
    }
    return {};
   }

   async validateImages(): Promise<IValidationError[]> {
    if (!this.enableImageValidation) return [];
    
    try {
      const errors = await this.htmlEditorService.validateContentImages(this.value, this.mergedImageConfig);
      // Convert IImageValidationError to IValidationError
      this.validationErrors = errors.map(error => ({
        message: error.message,
        currentValue: error.currentValue,
        maxValue: error.maxValue
      }));
      return this.validationErrors;
    } catch (error) {
      console.error('Image validation failed:', error);
      const generalError = [{
        message: 'HTML_EDITOR.IMAGE_VALIDATION_ERRORS'
      }];
      this.validationErrors = generalError;
      return generalError;
    }
  }

   setContents(content: string | any, source: string = 'api'): void {
    if (this.quillEditor) {
      if (typeof content === 'string') {
        this.quillEditor.root.innerHTML = content;
      } else {
        this.quillEditor.setContents(content, source as any);
      }
      this.trackImageChanges(this.quillEditor.root.innerHTML);
    }
  }

   focusEditor(): void {
    if (this.quillEditor) {
      this.quillEditor.focus();
    }
  }

   clear(): void {
    if (this.quillEditor) {
      this.quillEditor.setText('');
      this.images = [];
      this.imageCount = 0;
    }
  }

   removeImage(imageId: string): void {
    if (this.quillEditor) {
      const images = this.quillEditor.root.querySelectorAll('img');
      images.forEach(img => {
        if (img.id === imageId) {
          img.remove();
        }
      });
      this.trackImageChanges(this.quillEditor.root.innerHTML);
    }
  }

   formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private setEditorDirection(): void {
    if (this.quillEditor) {
      const editor = this.quillEditor.root;
      editor.setAttribute('dir', this.isRTL ? 'rtl' : 'ltr');
      editor.style.textAlign = this.isRTL ? 'right' : 'left';
    }
  }

  /**
   * Get RTL-friendly toolbar configuration
   */
  private getRTLToolbar(): any[] {
    return [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }], // Add RTL direction button
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ];
  }

   get hasValidationErrors(): boolean {
    return !this.isValid || this.validationErrors.length > 0;
  }

   get showFooter(): boolean {
    return this.showWordCount || this.showCharCount || this.showImageCount || this.hasValidationErrors;
  }

   get isContentRequired(): boolean {
    return this.required && !this.htmlEditorService.validateContent(this.value);
  }

   get isWordCountExceeded(): boolean {
    return !!(this.maxWords && this.wordCount > this.maxWords);
  }

   get isCharCountExceeded(): boolean {
    return !!(this.maxChars && this.charCount > this.maxChars);
  }

   get wordCountWarning(): boolean {
    return !!(this.maxWords && this.wordCount > this.maxWords * 0.8);
  }

   get charCountWarning(): boolean {
    return !!(this.maxChars && this.charCount > this.maxChars * 0.8);
  }

   get imageCountWarning(): boolean {
    return !!(this.mergedImageConfig.maxImageCount && this.imageCount > this.mergedImageConfig.maxImageCount * 0.8);
  }

   get imageCountExceeded(): boolean {
    return !!(this.mergedImageConfig.maxImageCount && this.imageCount > this.mergedImageConfig.maxImageCount);
  }

   getValidationState(): { 
    isValid: boolean; 
    wordCount: number; 
    charCount: number; 
    imageCount: number;
    imageErrors: IValidationError[];
  } {
    return {
      isValid: this.isValid,
      wordCount: this.wordCount,
      charCount: this.charCount,
      imageCount: this.imageCount,
      imageErrors: this.validationErrors
    };
  }
}
