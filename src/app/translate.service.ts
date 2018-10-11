import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {CookieService} from 'angular2-cookie/core';

@Injectable()
export class TranslateService {

  data: any = {};
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  use(lang: string): Promise<{}> {

    if (lang === 'DEFAULT') {
      if (this.cookieService.get('language') == null) {
        this.cookieService.put('language', 'en', { expires: 'Tue, 24-Jan-2050 12:12:12 GMT'});
        lang = 'en';
        console.log('No language cookie found! Using english as default');
      } else {
        lang = this.cookieService.get('language');
        console.log('Language cookie found! Using ' + lang);
      }
    } else {
      console.log('Language changed to ' + lang);
    }

    this.cookieService.put('language', lang, { expires: 'Tue, 24-Jan-2050 12:12:12 GMT'});

    return new Promise<{}>((resolve, reject) => {
      const langPath = `assets/i18n/${lang || 'en'}.json`;

      this.http.get<{}>(langPath).subscribe(
        translation => {
          this.data = Object.assign({}, translation || {});
          resolve(this.data);
        },
        error => {
          this.data = {};
          resolve(this.data);
        }
      );
    });
  }
}
