import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NavigationEnd, Router} from '@angular/router';

import {CookieService} from 'ngx-cookie-service';

import {BrowserCompatibilityModalComponent} from './browser-compatibility-modal/browser-compatibility-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private dateIn80Years: Date = new Date();

  constructor(private router: Router, private cookieService: CookieService, private dialog: MatDialog) {
    this.dateIn80Years.setFullYear(this.dateIn80Years.getFullYear() + 80);
  }

  ngOnInit() {
    this.router.events.subscribe(evt => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    });

    if (!this.cookieService.check('ie11c')) {
      console.log('IE11C Cookie set: false');
      const ua = window.navigator.userAgent;
      const msie = ua.indexOf('MSIE ');

      if (msie > 0) {
        this.dialog.open(BrowserCompatibilityModalComponent, {
          width: '80vh'
        });
      }

      this.cookieService.set('ie11c', 'set', this.dateIn80Years);
    } else {
      console.log('IE11C Cookie set: true');
    }
  }
}
