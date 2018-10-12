import { Component, OnInit } from '@angular/core';
import {MzBaseModal} from 'ngx-materialize';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.css']
})
export class AboutModalComponent extends MzBaseModal{

  version = environment.version;
}
