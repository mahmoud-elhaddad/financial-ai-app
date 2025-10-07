export interface INewsFilterRequest {
  page: number;
  limit: number;
  title?: string | null;
  status?: string | null
}

export interface NewsItem {
  id: string;
  title: string;
  status: 'published' | 'draft' | 'archived' | null;
  createdAt: Date | null;
}

export interface IArchivePost{
    id: string;
}
export interface Category {
  id: string;
  name: string;
}
export interface IPost {
  id: string;
  title: string | null;
  content?: string | null;
  categoryId?: string | null;
  categoryArName?: string | null;
  categoryEnName?: string | null;
  coverImage?: string | null;
  createdAt: string;
  publishedAt?: string | null;
  status: 'draft' | 'published' | string;
}
