import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class TranslateService {
  data: any = {};

  constructor(private http: HttpClient) {}

  public getTranslationFor(key: string) {
    return this.data[key] || key;
  }

  use(lang: string): Promise<{}> {
    if (lang === 'DEFAULT') {
      if (localStorage.getItem('language') == null) {
        localStorage.setItem('language', 'de');
        lang = 'de';
        console.log('No language cookie found! Using de as default');
      } else {
        lang = localStorage.getItem('language');
        console.log('Language cookie found! Using ' + lang);
      }
    } else {
      console.log('Language changed to ' + lang);
    }

    if (localStorage.getItem('language') == null) {
      localStorage.setItem('language', lang);
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
