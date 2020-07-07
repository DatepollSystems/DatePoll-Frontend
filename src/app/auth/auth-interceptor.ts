import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, filter, switchMap, take} from 'rxjs/operators';

import {AuthService} from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Don't intercept this requests
    const paths = ['/auth', 'https://api.openweathermap.org', 'https://geocode.xyz'];

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
    /* When a session token was cancelled and this users decides to logout he gets an error and can't logout. This checks the url,
     * clear the cookies and reloads the site. If the Angular app now checks isAuthenticated in the auth guard the
     * app will route to signin.
     */
    if (request.url.includes('/logoutCurrentSession')) {
      this.authService.clearCookies();

      window.location.reload();
    }

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
        }),
        catchError(error => {
          this.authService.clearCookies();
          window.location.reload();

          return next.handle(this.addToken(request, 'null'));
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
