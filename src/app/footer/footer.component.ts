import {Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

import {SettingsService} from '../services/settings.service';
import {TranslateService} from '../translation/translate.service';

import {AboutModalComponent} from './modals/about-modal/about-modal.component';
import {FeedbackModalComponent} from './modals/feedback-modal/feedback-modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnDestroy {
  communityName = 'DatePoll';
  private communityNameSubscription: Subscription;

  communityUrl = 'https://datepoll.dafnik.me';
  private communityUrlSubscription: Subscription;

  closed = true;
  selected: string;

  constructor(
    private translate: TranslateService,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.selected = localStorage.getItem('language');
    if (this.selected == null) {
      this.selected = 'de';
    }

    this.communityName = this.settingsService.getCommunityName();
    this.communityNameSubscription = this.settingsService.communityNameChange.subscribe(value => {
      this.communityName = value;
    });

    this.communityUrl = this.settingsService.getCommunityUrl();
    this.communityUrlSubscription = this.settingsService.communityUrlChange.subscribe(value => {
      this.communityUrl = value;
    });
  }

  ngOnDestroy(): void {
    this.communityNameSubscription.unsubscribe();
    this.communityUrlSubscription.unsubscribe();
  }

  setLang() {
    if (this.closed) {
      this.closed = false;
      return;
    }
    this.closed = true;

    const oldLanguage = localStorage.getItem('language');
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
      width: '90%'
    });
  }

  openAboutModal() {
    this.dialog.open(AboutModalComponent, {
      width: '45vh'
    });
  }
}
