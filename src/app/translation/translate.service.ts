import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class TranslateService {
  data: any = {};

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  public getTranslationFor(key: string) {
    return this.data[key] || key;
  }

  use(lang: string): Promise<{}> {
    if (lang === 'DEFAULT') {
      if (!this.cookieService.check('language')) {
        this.cookieService.set('language', 'de', new Date('Tue, 24-Jan-2050 12:12:12 GMT'));
        lang = 'de';
        console.log('No language cookie found! Using de as default');
      } else {
        lang = this.cookieService.get('language');
        console.log('Language cookie found! Using ' + lang);
      }
    } else {
      console.log('Language changed to ' + lang);
    }

    if (!this.cookieService.check('language')) {
      this.cookieService.set('language', lang, new Date('Tue, 24-Jan-2050 12:12:12 GMT'));
    }

    return new Promise<{}>((resolve, reject) => {
      const langPath = `assets/i18n/${lang || 'de'}.json`;

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
