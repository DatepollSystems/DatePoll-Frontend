import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

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
    const token = this.authService.getToken(functionUser);

    return this.http.get(this.apiUrl + '/v1' + url + '?token=' + token);
  }

  public loggedInV1POSTRequest(url: string, body: any, functionUser: string = null) {
    const token = this.authService.getToken(functionUser);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + '/v1' + url + '?token=' + token, body, {headers: headers});
  }

  public loggedInV1PUTRequest(url: string, body: any, functionUser: string = null) {
    const token = this.authService.getToken(functionUser);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(this.apiUrl + '/v1' + url + '?token=' + token, body, {headers: headers});
  }

  public loggedInV1DELETERequest(url: string, functionUser: string = null) {
    const token = this.authService.getToken(functionUser);
    return this.http.delete(this.apiUrl + '/v1' + url + '?token=' + token);
  }

  public getSettingRequest(url: string, functionUser: string = null) {
    if (functionUser != null) {
      console.log(functionUser + ' Request:');
    }
    return this.http.get(this.apiUrl + '/settings' + url);
  }

  public setSettingsRequest(url: string, body: any, functionUser: string = null) {
    const token = this.authService.getToken(functionUser);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.apiUrl + '/settings/administration' + url + '?token=' + token, body, {headers: headers}).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
  }
}
