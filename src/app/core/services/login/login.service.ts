import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

import { environment } from 'src/environments/environment';
import { IResetPassword } from '../../interfaces/IResetPassword';


@Injectable({
    providedIn: 'root'
})
export class LoginService {


    constructor(
        private http: HttpClient,
        private router: Router,
        private storageService: StorageService
    ) { }

    forgotPassword(email: string): Observable<any> {
        const url = `${environment.baseUrl}api/v1/web/admin/auth/forgot-password`;
        const body = { email };
        return this.http.post(url, body);
    }

        resetPassword(body:IResetPassword): Observable<any> {
            const url = `${environment.baseUrl}api/v1/web/admin/auth/reset-password`;
            return this.http.post(url, body);
        }

    login(credentials: { email: string; password: string }): Observable<any> {
        const url = `${environment.baseUrl}api/v1/web/admin/auth/login`;
        return this.http.post(url, credentials).pipe(
            tap((response: any) => {
                if (response?.isSuccess && response.data?.accessToken) {
                    this.setToken(response.data.accessToken);
                    this.storageService.setItem('user_data', JSON.stringify(response.data));
                }
            })
        );
    }

    setToken(token: string): void {
        this.storageService.setItem('access_token', token);
    }

    getToken(): string | null {
        return this.storageService.getItem('access_token');
    }

    isLoggedIn(): boolean {
        const token = this.storageService.getItem('access_token');

        if (!token) {
            return false;
        }
        return true;
    }


    logout(): void {
        this.storageService.removeItem('access_token');
        this.router.navigate(['login']);
    }
}