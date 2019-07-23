import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {retry, catchError} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';
import {throwError} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {TranslateService} from '../translation/translate.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl = environment.apiUrl;

  constructor(private authService: AuthService,
              private http: HttpClient,
              private notificationsService: NotificationsService,
              private translate: TranslateService) {
  }

  public loggedInV1GETRequest(url: string, functionUser: string = null) {
    this.log('GET', url, functionUser);

    const token = this.authService.getToken(functionUser);

    return this.http.get(this.apiUrl + '/v1' + url + '?token=' + token).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        this.notificationsService.error(this.translate.getTranslationFor('ERROR'), this.translate.getTranslationFor('REQUEST_ERROR'));

        return throwError('An unexpected error occured.');
      })
    );
  }

  public loggedInV1POSTRequest(url: string, body: any, functionUser: string = null) {
    this.log('POST', url, functionUser);

    const token = this.authService.getToken(functionUser);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + '/v1' + url + '?token=' + token, body, {headers: headers}).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        this.notificationsService.error(this.translate.getTranslationFor('ERROR'), this.translate.getTranslationFor('REQUEST_ERROR'));

        return throwError('An unexpected error occured.');
      })
    );
  }

  public loggedInV1PUTRequest(url: string, body: any, functionUser: string = null) {
    this.log('PUT', url, functionUser);

    const token = this.authService.getToken(functionUser);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(this.apiUrl + '/v1' + url + '?token=' + token, body, {headers: headers}).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        this.notificationsService.error(this.translate.getTranslationFor('ERROR'), this.translate.getTranslationFor('REQUEST_ERROR'));

        return throwError('An unexpected error occured.');
      })
    );
  }

  public loggedInV1DELETERequest(url: string, functionUser: string = null) {
    this.log('DELETE', url, functionUser);

    const token = this.authService.getToken(functionUser);
    return this.http.delete(this.apiUrl + '/v1' + url + '?token=' + token).pipe(
      retry(3),
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
        }
        this.notificationsService.error(this.translate.getTranslationFor('ERROR'), this.translate.getTranslationFor('REQUEST_ERROR'));

        return throwError('An unexpected error occured.');
      })
    );
  }

  public getSettingRequest(url: string, functionUser: string = null) {
    if (functionUser != null) {
      console.log('getSettingsRequest | ' + functionUser);
    }
    return this.http.get(this.apiUrl + '/settings' + url).pipe(
      retry(3)
    );
  }

  public setSettingsRequest(url: string, body: any, functionUser: string = null) {
    const token = this.authService.getToken(functionUser);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + '/settings/administration' + url + '?token=' + token, body, {headers: headers}).pipe(
      retry(3)
    );
  }

  private log(type: string, url: string, functionUser: string = null) {
    if (functionUser != null) {
      console.log('httpService | ' + type + ' Request | URL: ' + url + ' | Function user: ' + functionUser);
    } else {
      console.log('httpService | ' + type + ' Request | URL: ' + url);
    }
  }
}
