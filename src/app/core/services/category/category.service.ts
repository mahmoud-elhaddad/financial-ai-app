import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICategoryFilterRequest } from '../../interfaces/ICategoryFilterRquest';
import { Observable } from 'rxjs';
import { ICreateCategoryRequest } from '../../../modules/categories/models/create-category-request-mode';
import { IUpdateCategoryResponse } from 'src/app/modules/categories/models/update-category-response.model';
import { ICreateCategoryResponse } from 'src/app/modules/categories/models/create-category-response.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly categoryListURL = environment.baseUrl + 'api/v1/web/categories';

  constructor(private http: HttpClient) { }

  getCategoriesList(body: ICategoryFilterRequest): Observable<any> {
    return this.http.post<any>(this.categoryListURL+'/get-categories-filter', body);
  }

  // Simple method to get all categories for dropdowns
  getAllCategories(): Observable<any> {
    const body: ICategoryFilterRequest = {
      page: 1,
      limit: 1000000 // Get all categories
    };
    return this.http.post<any>(this.categoryListURL+'/get-categories-filter', body);
  }

  getCategoryDetails(id: string): Observable<any> {
    const url = `${this.categoryListURL}/get-category-details/${id}`;
    return this.http.get<any>(url);
  }

  createCategory(data: ICreateCategoryRequest): Observable<ICreateCategoryResponse> {
    const url = `${this.categoryListURL}/create-category`;
    return this.http.post<ICreateCategoryResponse>(url, data);
  }

  updateCategory(id: string, data: ICreateCategoryRequest): Observable<IUpdateCategoryResponse> {
    const url = `${this.categoryListURL}/update-category/${id}`;
    return this.http.post<IUpdateCategoryResponse>(url, data);
  }

  deleteCategory(id: string): Observable<any> {
    const url = `${this.categoryListURL}/delete-category/${id}`;
    return this.http.post<any>(url , '');
  }
}
