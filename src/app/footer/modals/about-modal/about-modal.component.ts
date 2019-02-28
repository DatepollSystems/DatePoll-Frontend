import { Component } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Http, Response} from '@angular/http';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.css']
})
export class AboutModalComponent {
  apiUrl = environment.apiUrl;

  frontendVersion = environment.version;
  backendVersion = 'Loading..';
  requiredBackendVersion = environment.required_version;

  constructor(private http: Http) {
    http.get(this.apiUrl + '/').pipe(map(
      (response: Response) => {
        const data = response.json();
        console.log(data);
        return data;
    }
    )).subscribe(
      (data: any) => {
        this.backendVersion = data.version;
      },
      (error) => console.log(error)
    );
  }
}
