import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
	const toastrService = inject(ToastrService);
  return next(req).pipe(
    catchError((err) => {
      toastrService.error('an error occurred!. try again later','Server Error', {
        timeOut: 3000,
	    });

      if (err.status === 401) {
      }

      if (err.status === 403){
      }

      if (err.status === 0) {
      }

      const error = err.error.message || err.statusText;
      return throwError(() => error);
    })
  );
};

