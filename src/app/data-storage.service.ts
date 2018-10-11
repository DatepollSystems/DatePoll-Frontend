import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AuthService} from './auth/auth.service';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(private http: Http,
              private authService: AuthService) {
  }

  apiUrl = environment.apiUrl;

  // getIrgendwas() {
  //   const token = this.authService.getToken();
  //
  //   this.http.get('?auth=' + token);
  // }
  //
  // getServerStartMessage() {
  //   return this.http.get(
  //     this.apiUrl
  //   ).pipe(map(
  //     (response: Response) => {
  //       return response.json();
  //     }
  //   )).pipe(catchError(
  //     (error) => {
  //       return Observable.throw('Something went wrong');
  //     }
  //   ));
  // }
}
