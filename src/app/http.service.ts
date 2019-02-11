import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {Headers, Http, Response} from '@angular/http';
import {map} from 'rxjs/operators';
import {AuthService} from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiUrl = environment.apiUrl;

  constructor(private authService: AuthService, private http: Http) { }

  public loggedInV1GETRequest(url: string, functionUser: string = null) {
    const token = this.authService.getToken(functionUser);

    return this.http.get(this.apiUrl + '/v1' + url + '?token=' + token).pipe(map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        return data;
      }
    ));
  }

  public loggedInV1POSTRequest(url: string, body: any, functionUser: string = null) {
    const token = this.authService.getToken(functionUser);
    const headers = new Headers({'Content-Type': 'application/json'});

    return this.http.post(this.apiUrl + '/v1' + url + '?token=' + token, body, {headers: headers});
  }

  public loggedInV1PUTRequest(url: string, body: any, functionUser: string = null) {
    const token = this.authService.getToken(functionUser);
    const headers = new Headers({'Content-Type': 'application/json'});

    return this.http.put(this.apiUrl + '/v1' + url + '?token=' + token, body, {headers: headers});
  }

  public loggedInV1DELETERequest(url: string, functionUser: string = null) {
    const token = this.authService.getToken(functionUser);
    return this.http.delete(this.apiUrl + '/v1' + url + '?token=' + token);
  }
}
