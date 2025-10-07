import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoginLangInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get language from localStorage or default to 'en-US'
    const lang = localStorage.getItem('lang') || 'en-US';
    // Clone the request and add the lang header
    const clonedReq = req.clone({
      setHeaders: {
        'x-language': lang
      }
    });
    return next.handle(clonedReq);
  }
}
