import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  constructor() { }

  items: MenuItem[];

  ngOnInit() {
    this.items = [{
      label: 'Navigate with me',
      items: [
        {label: 'Impressum', 'routerLink': ['imprint']},
        {label: 'Datenschutzerklärung', 'routerLink': ['privacypolicy']}
      ]
    }];
  }

}
