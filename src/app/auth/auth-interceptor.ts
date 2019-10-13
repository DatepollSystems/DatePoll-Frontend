import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';

import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't intercept this requests
    const paths = [
      '/auth',
      '/settings/name',
      '/settings/cinema',
      '/settings/events',
      'https://api.openweathermap.org'
    ];

    let toIntercept = true;
    for (const path of paths) {
      if (req.url.includes(path)) {
        toIntercept = false;
        break;
      }
    }

    if (!toIntercept) {
      return next.handle(req);
    } else if (toIntercept) {

      if (this.authService.isJWTTokenValid()) {
        req = this.addToken(req, this.authService.getJWTToken());
      }

      return next.handle(req).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handle401Error(req, next);
          } else {
            // this.authService.logout();
            return throwError('authService | An error occured during jwt token refreshing... probably session token deleted!' + error);
          }
        })
      );
    }
  }

  private addToken(req: HttpRequest<any>, token: string) {
    // Keeps the original request params. as a new HttpParams
    let newParams = new HttpParams({fromString: req.params.toString()});

    newParams = newParams.append('token', token);

    return req.clone({
      params: newParams
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshJWTToken().pipe(
        switchMap((data: any) => {
          console.log('authInterceptor | Refreshing JWT token...');
          console.log(data);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(data.token);
          return next.handle(this.addToken(request, data.token));
        })
      );

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          console.log('authInterceptor | Already refreshing | JWT: ' + jwt);
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}
