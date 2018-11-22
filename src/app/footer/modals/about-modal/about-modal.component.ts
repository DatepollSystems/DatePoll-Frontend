import { Component } from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.css']
})
export class AboutModalComponent {

  version = environment.version;
}
