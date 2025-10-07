import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUserFilterRequest } from '../../interfaces/IUserFilterRequest';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly userListURL = environment.baseUrl + 'api/v1/web/web-users/get-users-filter';

  constructor(private http: HttpClient) { }

  getUsersList(body: IUserFilterRequest): Observable<any> {
    return this.http.post<any>(this.userListURL, body);
  }

  getUserDetails(id: string): Observable<any> {
    const url = `${environment.baseUrl}api/v1/web/web-users/get-user-details/${id}`;
    return this.http.get<any>(url);
  }
}
