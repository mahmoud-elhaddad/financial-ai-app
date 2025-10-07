export interface IHtmlEditorConfig {
  theme?: 'snow' | 'bubble';
  placeholder?: string;
  modules?: any;
  formats?: string[];
  readOnly?: boolean;
  bounds?: string | HTMLElement;
  scrollingContainer?: string | HTMLElement;
  debug?: boolean | string;
}

export interface IHtmlEditorOptions {
  toolbar?: boolean | string[][] | string;
  history?: {
    delay?: number;
    maxStack?: number;
    userOnly?: boolean;
  };
  keyboard?: any;
  clipboard?: any;
}

export interface IHtmlEditorStats {
  wordCount: number;
  charCount: number;
  imageCount: number;
  isValid: boolean;
  hasContent: boolean;
}

export interface IHtmlEditorContent {
  html: string;
  text: string;
  images: IImageInfo[];
}

export interface IImageValidationConfig {
  maxFileSize?: number; // in bytes (default: 5MB)
  maxImageCount?: number; // maximum number of images allowed
  allowedTypes?: string[]; // ['image/jpeg', 'image/png', 'image/gif']
  maxWidth?: number; // maximum image width in pixels
  maxHeight?: number; // maximum image height in pixels
  minWidth?: number; // minimum image width in pixels
  minHeight?: number; // minimum image height in pixels
  validateDimensions?: boolean; // validate image dimensions
  allowBase64?: boolean; // allow base64 encoded images
  maxBase64Size?: number; // max size for base64 images
}

export interface IImageInfo {
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  size?: number; // file size in bytes
  type?: string; // MIME type
  name?: string; // original filename
  isBase64?: boolean;
  isValid?: boolean;
  errors?: string[];
}

export interface IImageValidationResult {
  isValid: boolean;
  errors: string[];
  imageInfo?: IImageInfo;
  compressedImage?: string; // base64 of compressed image
}

export interface IImageValidationError {
  type: 'FILE_SIZE' | 'IMAGE_COUNT' | 'FILE_TYPE' | 'DIMENSIONS' | 'GENERAL';
  message: string;
  imageId?: string;
  currentValue?: number;
  maxValue?: number;
}

export interface IValidationError {
  message: string;
  currentValue?: number;
  maxValue?: number;
}
