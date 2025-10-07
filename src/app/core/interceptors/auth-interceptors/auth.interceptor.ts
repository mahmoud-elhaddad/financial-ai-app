import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login/login.service';

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
  constructor(private loginService:LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.getToken();
    const lang = localStorage.getItem('lang') || 'en-US';

    let headers = req.headers.set('x-language', lang);
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const clonedRequest = req.clone({ headers });

    return next.handle(clonedRequest);
  }
}
