import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

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

  constructor(private http: HttpClient) {
    http.get(this.apiUrl + '/').subscribe(
      (data: any) => {
        this.backendVersion = data.version;
      },
      (error) => console.log(error)
    );
  }
}
