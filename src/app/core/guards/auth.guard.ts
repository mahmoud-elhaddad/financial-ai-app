import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login/login.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private loginService: LoginService,
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.loginService.isLoggedIn()) {
            this.router.navigate(['login']);
            return false;
        }

        return true;
    }

    // isTokenExpired(): boolean {
    //     const token = this.loginService.getToken();
    //     if (!token) {
    //         return true;
    //     }

    //     try {
    //         const decodedToken = this.decodeJWT(token);
    //         const currentTime = Math.floor(Date.now() / 1000);
    //         return decodedToken.exp < currentTime;
    //     } catch (error) {
    //         return true;
    //     }
    // }

    // Method to decode JWT token
    // decodeJWT(token: string): any {
    //     try {
    //         const base64Url = token.split('.')[1];
    //         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    //         const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    //             return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    //         }).join(''));
    //         return JSON.parse(jsonPayload);
    //     } catch (error) {
    //         throw new Error('Invalid token format');
    //     }
    // }
}
