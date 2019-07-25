import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {NotificationsService} from 'angular2-notifications';

import {environment} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';
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

    return this.http.get(this.apiUrl + '/v1' + url).pipe(
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

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + '/v1' + url, body, {headers: headers}).pipe(
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

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(this.apiUrl + '/v1' + url, body, {headers: headers}).pipe(
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

    return this.http.delete(this.apiUrl + '/v1' + url).pipe(
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
    return this.http.get(this.apiUrl + '/settings' + url);
  }

  public setSettingsRequest(url: string, body: any, functionUser: string = null) {
    if (functionUser != null) {
      console.log('setSettingsRequest | ' + functionUser);
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + '/settings/administration' + url, body, {headers: headers});
  }

  private log(type: string, url: string, functionUser: string = null) {
    if (functionUser != null) {
      console.log('httpService | ' + type + ' Request | URL: ' + url + ' | Function user: ' + functionUser);
    } else {
      console.log('httpService | ' + type + ' Request | URL: ' + url);
    }
  }
}
