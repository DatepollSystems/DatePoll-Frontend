import {Component} from '@angular/core';
import {TranslateService} from '../translation/translate.service';
import {FeedbackModalComponent} from './modals/feedback-modal/feedback-modal.component';
import {AboutModalComponent} from './modals/about-modal/about-modal.component';
import {CookieService} from 'angular2-cookie/core';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  closed = true;
  selected: string;

  constructor(private translate: TranslateService,
              private cookieService: CookieService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
    this.selected = this.cookieService.get('language');
    if (this.selected === null) {
      this.selected = 'de';
    }
  }

  setLang() {
    if (this.closed) {
      this.closed = false;
      return;
    }
    this.closed = true;

    const oldLanguage = this.cookieService.get('language');
    this.translate.use(this.selected);

    const snackBarRef = this.snackBar.open('Sprache geändert zu ' + this.selected, 'Undo');
    snackBarRef.onAction().subscribe(() => {
      this.selected = oldLanguage;
      this.translate.use(oldLanguage);
      this.snackBar.open('Sprache zurückgesetzt');
      console.log('Language was changed via undo to ' + this.selected);
    });
  }

  openFeedbackModal() {
    this.dialog.open(FeedbackModalComponent, {
      width: '90%',
    });
  }

  openAboutModal() {
    this.dialog.open(AboutModalComponent);
  }

}
