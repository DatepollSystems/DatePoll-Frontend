import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AuthService} from './auth/auth.service';
import {Observable} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(private http: Http,
              private authService: AuthService) {
  }

  server = 'http://127.0.0.1:8080';

  getIrgendwas() {
    const token = this.authService.getToken();

    this.http.get('?auth=' + token);
  }

  getServerStartMessage() {
    return this.http.get(
      this.server
    ).pipe(map(
      (response: Response) => {
        return response.json();
      }
    )).pipe(catchError(
      (error) => {
        return Observable.throw('Something went wrong');
      }
    ));
  }
}
