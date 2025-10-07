export interface ICreatePostRequest {
  t: string; // title
  c: string; // content
  catId: string; // category ID
  covImgB64?: string; // cover image as base64
  s?: string;
  createdAt?: string;
}

export interface ICreatePostResponse {
  isSuccess: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    content: string;
    category: string;
    status: string;
    createdAt: string;
  };
  count?: number;
}
