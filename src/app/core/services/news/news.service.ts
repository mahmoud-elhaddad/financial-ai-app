import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IArchivePost, INewsFilterRequest } from '../../interfaces/INews';
import { ICreatePostRequest, ICreatePostResponse } from '../../interfaces/ICreatePostRequest';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

 private readonly newsListURL = environment.baseUrl + 'api/v1/web/news';

  constructor(private http: HttpClient) { }

  getNewsForAdminList(body: INewsFilterRequest): Observable<any> {
    const url = `${this.newsListURL}/get-news-filter-for-admin`;
    return this.http.post<any>(url, body);
  }
  getNewsForSuperAdminList(body: INewsFilterRequest): Observable<any> {
    const url = `${this.newsListURL}/get-news-filter-for-super-admin`;
    return this.http.post<any>(url, body);
  }
  archivePost(body: IArchivePost): Observable<any> {
    const url = `${this.newsListURL}/archive-news`;
    return this.http.post<any>(url, body);
  }

  createPost(data: ICreatePostRequest): Observable<ICreatePostResponse> {
    const url = `${this.newsListURL}/create`;
    return this.http.post<ICreatePostResponse>(url, data);
  }

  saveDraft(data: ICreatePostRequest): Observable<ICreatePostResponse> {
    const url = `${this.newsListURL}/save-draft`;
    return this.http.post<ICreatePostResponse>(url, data);
  }
  getNewsById(id:string): Observable<ICreatePostResponse> {
    const url = `${this.newsListURL}/get-news-details/${id}`;
    return this.http.get<ICreatePostResponse>(url);
  }
  updatePost(data: ICreatePostRequest,id:string): Observable<ICreatePostResponse> {
    const url = `${this.newsListURL}/update/${id}`;
    return this.http.put<ICreatePostResponse>(url, data);
  }

}
