import { Injectable } from '@angular/core';
import Quill from 'quill';
import { 
  IHtmlEditorConfig, 
  IImageValidationConfig, 
  IImageInfo, 
  IImageValidationResult,
  IImageValidationError 
} from '../interfaces/Ihtml-editor.interface';

@Injectable({
  providedIn: 'root'
})
export class HtmlEditorService {
  private readonly defaultConfig: IHtmlEditorConfig = {
    theme: 'snow',
    placeholder: 'Write something...',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],
        ['link', 'image', 'video']
      ]
    }
  };

   readonly defaultImageValidation: IImageValidationConfig = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    maxImageCount: 10,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    maxWidth: 1920,
    maxHeight: 1080,
    minWidth: 50,
    minHeight: 50,
    validateDimensions: true,
    allowBase64: true,
    maxBase64Size: 2 * 1024 * 1024 // 2MB for base64
  };

  /**
   * Merges user config with default config
   */
   mergeConfig(userConfig?: Partial<IHtmlEditorConfig>, isRTL: boolean = false): IHtmlEditorConfig {
    const baseConfig = { ...this.defaultConfig, ...userConfig };
    
    if (isRTL) {
      // Add RTL-specific Quill modules
      baseConfig.modules = {
        ...baseConfig.modules,
        toolbar: this.getRTLToolbar(),
        keyboard: {
          bindings: {
            // RTL-specific keyboard shortcuts
            'list autofill': {
              key: ' ',
              shiftKey: null,
              handler: function(range: any, context: any) {
                // RTL list handling - let Quill handle this naturally
                return true;
              }
            }
          }
        }
      };
    }
    
    return baseConfig;
  }

  /**
   * Merges user image validation config with defaults
   */
   mergeImageValidationConfig(userConfig?: Partial<IImageValidationConfig>): IImageValidationConfig {
    return { ...this.defaultImageValidation, ...userConfig };
  }

  /**
   * Validates HTML content
   */
   validateContent(content: string): boolean {
    if (!content || content.trim() === '' || content === '<p><br></p>') {
      return false;
    }
    return true;
  }

  /**
   * Sanitizes HTML content
   */
   sanitizeContent(content: string): string {
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  }

  /**
   * Creates a new Quill instance with image handling
   */
   createEditor(element: HTMLElement, config: IHtmlEditorConfig, imageConfig?: IImageValidationConfig): Quill {
    const quill = new Quill(element, config as any);
    
    if (imageConfig) {
      this.setupImageHandler(quill, imageConfig);
    }
    
    return quill;
  }

  /**
   * Sets up custom image handler for Quill
   */
  private setupImageHandler(quill: Quill, imageConfig: IImageValidationConfig): void {
    const toolbar = quill.getModule('toolbar') as any;
    
    toolbar.addHandler('image', () => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', imageConfig.allowedTypes?.join(',') || 'image/*');
      input.setAttribute('multiple', 'true');
      
      input.onchange = async () => {
        const files = input.files;
        if (!files || files.length === 0) return;

        // Check image count limit
        const currentImageCount = this.getImageCount(quill.root.innerHTML);
        if (imageConfig.maxImageCount && currentImageCount + files.length > imageConfig.maxImageCount) {
          // Let component handle this error
          return;
        }

        const range = quill.getSelection(true);
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const validationResult = await this.validateImage(file, imageConfig);
          
          if (validationResult.isValid && validationResult.compressedImage) {
            quill.insertEmbed(range.index + i, 'image', validationResult.compressedImage);
            quill.setSelection(range.index + i + 1);
          }
          // Let component handle validation errors
        }
      };
      
      input.click();
    });
  }

  /**
   * Validates a single image file
   */
  async validateImage(file: File, config: IImageValidationConfig): Promise<IImageValidationResult> {
    const errors: string[] = [];
    
    // File type validation
    if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`);
    }

    // File size validation
    if (config.maxFileSize && file.size > config.maxFileSize) {
      errors.push(`File size too large. Max: ${this.formatFileSize(config.maxFileSize)}, Current: ${this.formatFileSize(file.size)}`);
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    const imageInfo = await this.getImageInfo(file);
    
    // Basic dimension validation if enabled
    if (config.validateDimensions) {
      const dimensionValidation = this.validateImageDimensions(imageInfo, config);
      if (!dimensionValidation.isValid) {
        errors.push(...dimensionValidation.errors);
      }
    }

    if (errors.length > 0) {
      return { isValid: false, errors, imageInfo };
    }

    return {
      isValid: true,
      errors: [],
      imageInfo,
      compressedImage: imageInfo.src
    };
  }

  /**
   * Gets image information from file
   */
  private async getImageInfo(file: File): Promise<IImageInfo> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({
            id: this.generateImageId(),
            src: e.target?.result as string,
            width: img.width,
            height: img.height,
            size: file.size,
            type: file.type,
            name: file.name,
            isBase64: true,
            isValid: true,
            errors: []
          });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validates image dimensions
   */
  private validateImageDimensions(imageInfo: IImageInfo, config: IImageValidationConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!config.validateDimensions || !imageInfo.width || !imageInfo.height) {
      return { isValid: true, errors: [] };
    }

    if (config.maxWidth && imageInfo.width > config.maxWidth) {
      errors.push(`Image width too large. Max: ${config.maxWidth}px, Current: ${imageInfo.width}px`);
    }

    if (config.maxHeight && imageInfo.height > config.maxHeight) {
      errors.push(`Image height too large. Max: ${config.maxHeight}px, Current: ${imageInfo.height}px`);
    }

    if (config.minWidth && imageInfo.width < config.minWidth) {
      errors.push(`Image width too small. Min: ${config.minWidth}px, Current: ${imageInfo.width}px`);
    }

    if (config.minHeight && imageInfo.height < config.minHeight) {
      errors.push(`Image height too small. Min: ${config.minHeight}px, Current: ${imageInfo.height}px`);
    }

    return { isValid: errors.length === 0, errors };
  }



  /**
   * Extracts images from HTML content
   */
   extractImagesFromContent(html: string): IImageInfo[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('img');
    
    return Array.from(images).map((img, index) => ({
      id: img.id || this.generateImageId(),
      src: img.src,
      alt: img.alt,
      width: img.naturalWidth || parseInt(img.getAttribute('width') || '0'),
      height: img.naturalHeight || parseInt(img.getAttribute('height') || '0'),
      isBase64: img.src.startsWith('data:'),
      isValid: true,
      errors: []
    }));
  }

  /**
   * Gets image count from HTML content
   */
   getImageCount(html: string): number {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.querySelectorAll('img').length;
  }

  /**
   * Validates all images in content
   */
   async validateContentImages(html: string, config: IImageValidationConfig): Promise<IImageValidationError[]> {
    const images = this.extractImagesFromContent(html);
    const errors: IImageValidationError[] = [];

    // Check image count
    if (config.maxImageCount && images.length > config.maxImageCount) {
      errors.push({
        type: 'IMAGE_COUNT',
        message: `Too many images. Maximum allowed: ${config.maxImageCount}, Current: ${images.length}`,
        currentValue: images.length,
        maxValue: config.maxImageCount
      });
    }

    // Validate each image
    for (const image of images) {
      if (image.isBase64 && config.maxBase64Size) {
        const base64Size = this.getBase64Size(image.src);
        if (base64Size > config.maxBase64Size) {
          errors.push({
            type: 'FILE_SIZE',
            message: `Base64 image too large. Max: ${this.formatFileSize(config.maxBase64Size)}`,
            imageId: image.id,
            currentValue: base64Size,
            maxValue: config.maxBase64Size
          });
        }
      }

      // Validate dimensions
      if (config.validateDimensions && image.width && image.height) {
        if (config.maxWidth && image.width > config.maxWidth) {
          errors.push({
            type: 'DIMENSIONS',
            message: `Image width too large. Max: ${config.maxWidth}px`,
            imageId: image.id,
            currentValue: image.width,
            maxValue: config.maxWidth
          });
        }

        if (config.maxHeight && image.height > config.maxHeight) {
          errors.push({
            type: 'DIMENSIONS',
            message: `Image height too large. Max: ${config.maxHeight}px`,
            imageId: image.id,
            currentValue: image.height,
            maxValue: config.maxHeight
          });
        }
      }
    }

    return errors;
  }

  /**
   * Utility methods
   */
   getPlainText(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

   getWordCount(html: string): number {
    const text = this.getPlainText(html);
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  }

   getCharacterCount(html: string): number {
    return this.getPlainText(html).length;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private getBase64Size(base64String: string): number {
    const base64Data = base64String.split(',')[1] || base64String;
    return Math.round(base64Data.length * 0.75);
  }

  private generateImageId(): string {
    return 'img_' + Math.random().toString(36).substr(2, 9);
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
      [{ 'direction': 'rtl' }], // RTL direction toggle
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ];
  }
}
