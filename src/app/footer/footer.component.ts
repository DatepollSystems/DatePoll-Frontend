import {Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

import {SettingsService} from '../utils/settings.service';
import {TranslateService} from 'dfx-translate';

import {AboutModalComponent} from './modals/about-modal/about-modal.component';

import {ServerInfoModel} from '../utils/server-info.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnDestroy {
  serverInfo: ServerInfoModel;
  private serverInfoSubscription: Subscription;

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

    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe((value) => {
      this.serverInfo = value;
    });
  }

  ngOnDestroy(): void {
    this.serverInfoSubscription.unsubscribe();
  }

  setLang(event: any) {
    const oldLanguage = localStorage.getItem('language');
    this.translate.use(event.value);

    const snackBarRef = this.snackBar.open(this.translate.translate('LANGUAGE_CHANGED_TO') + this.selected, 'Undo');
    snackBarRef.onAction().subscribe(() => {
      this.selected = oldLanguage;
      this.translate.use(oldLanguage);
      this.snackBar.open(this.translate.translate('LANGUAGE_RESET'));
      console.log('Language was changed via undo to ' + this.selected);
    });
  }

  openAboutModal() {
    this.dialog.open(AboutModalComponent, {
      width: '45vh',
    });
  }
}
