import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {retry} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import {AuthService} from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl = environment.apiUrl;

  constructor(private authService: AuthService, private http: HttpClient) {
  }

  public loggedInV1GETRequest(url: string, functionUser: string = null) {
    this.log('GET', url, functionUser);

    const token = this.authService.getToken(functionUser);

    return this.http.get(this.apiUrl + '/v1' + url + '?token=' + token).pipe(
      retry(3)
    );
  }

  public loggedInV1POSTRequest(url: string, body: any, functionUser: string = null) {
    this.log('POST', url, functionUser);

    const token = this.authService.getToken(functionUser);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + '/v1' + url + '?token=' + token, body, {headers: headers}).pipe(
      retry(3)
    );
  }

  public loggedInV1PUTRequest(url: string, body: any, functionUser: string = null) {
    this.log('PUT', url, functionUser);

    const token = this.authService.getToken(functionUser);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(this.apiUrl + '/v1' + url + '?token=' + token, body, {headers: headers}).pipe(
      retry(3)
    );
  }

  public loggedInV1DELETERequest(url: string, functionUser: string = null) {
    this.log('DELETE', url, functionUser);

    const token = this.authService.getToken(functionUser);
    return this.http.delete(this.apiUrl + '/v1' + url + '?token=' + token).pipe(
      retry(3)
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
    ).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => console.log(error)
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
