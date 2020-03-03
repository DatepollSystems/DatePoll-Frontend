import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NavigationEnd, Router} from '@angular/router';

import {BrowserCompatibilityModalComponent} from './browser-compatibility-modal/browser-compatibility-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit() {
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    });

    if (localStorage.getItem('ie11c') == null) {
      console.log('IE11C Cookie set: false');
      const ua = window.navigator.userAgent;
      const msie = ua.indexOf('MSIE ');

      if (msie > 0) {
        this.dialog.open(BrowserCompatibilityModalComponent, {
          width: '80vh'
        });
      }

      localStorage.setItem('ie11c', 'lol');
    } else {
      console.log('IE11C Cookie set: true');
    }
  }
}
