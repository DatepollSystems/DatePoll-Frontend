import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatDrawerMode} from '@angular/material/sidenav';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subscription} from 'rxjs';

import {AuthService} from '../auth/auth.service';
import {IsMobileService} from '../utils/is-mobile.service';
import {SettingsService} from '../utils/settings.service';
import {MyUserService} from './my-user.service';
import {TranslateService} from 'dfx-translate';

import {UIHelper} from '../utils/helper/UIHelper';
import {Permissions} from '../permissions';

import {ServerInfoModel} from '../utils/server-info.model';

import {QuestionDialogComponent} from '../utils/shared-components/question-dialog/question-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', {static: true})
  navBarOpened = false;
  navBarMode: MatDrawerMode = 'over';

  public myUserService: MyUserService;

  cinemaMovieAdministration = Permissions.CINEMA_MOVIE_ADMINISTRATION;
  eventAdministration = Permissions.EVENTS_ADMINISTRATION;
  managementAdministration = Permissions.MANAGEMENT_ADMINISTRATION;
  managementUserView = Permissions.MANAGEMENT_USER_VIEW;
  broadcastAdministration = Permissions.BROADCASTS_ADMINISTRATION;
  settingsAdministration = Permissions.SETTINGS_ADMINISTRATION;
  logsAdministration = Permissions.SYSTEM_LOGS_ADMINISTRATION;

  firstname: string = null;
  private firstnameSubscription: Subscription;

  surname: string = null;
  private surnameSubscription: Subscription;

  username: string = null;
  private usernameSubscription: Subscription;

  serverInfo: ServerInfoModel;
  private serverInfoSubscription: Subscription;

  isMobileSubscription: Subscription;

  offline = false;
  prideMonth = false;

  constructor(
    myUserService: MyUserService,
    private authService: AuthService,
    private settingsService: SettingsService,
    private isMobileService: IsMobileService,
    private translate: TranslateService,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar
  ) {
    this.myUserService = myUserService;

    this.firstname = this.myUserService.getFirstname();
    this.firstnameSubscription = myUserService.firstnameChange.subscribe((value) => {
      this.firstname = value;
    });

    this.surname = this.myUserService.getSurname();
    this.surnameSubscription = myUserService.surnameChange.subscribe((value) => {
      this.surname = value;
    });

    this.username = this.myUserService.getUsername();
    this.usernameSubscription = this.myUserService.usernameChange.subscribe((value) => {
      this.username = value;
    });

    this.serverInfo = this.settingsService.getServerInfo();
    this.serverInfoSubscription = this.settingsService.serverInfoChange.subscribe((value) => {
      this.serverInfo = value;
    });

    // Detect Android, iOS, Windows and MacOS dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && localStorage.getItem('theme') == null) {
      localStorage.setItem('theme', 'dark');
      this.setTheme();
    }
  }

  onPageChange() {
    // Close navbar after click only if webbrowser is mobile
    if (!(window.screen.width > 992)) {
      this.navBarOpened = false;
    }
  }

  ngOnInit() {
    this.setTheme();

    if (!this.isMobileService.getIsMobile()) {
      this.navBarOpened = true;
      this.navBarMode = 'side';
    } else {
      this.navBarOpened = false;
      this.navBarMode = 'over';
    }

    this.isMobileSubscription = this.isMobileService.isMobileChange.subscribe((isMobile) => {
      if (isMobile) {
        this.navBarOpened = false;
        this.navBarMode = 'over';
      } else {
        this.navBarOpened = true;
        this.navBarMode = 'side';
      }
    });

    window.addEventListener('online', this.onNetworkStatusChange.bind(this));
    window.addEventListener('offline', this.onNetworkStatusChange.bind(this));

    // if month is june
    if (UIHelper.getCurrentDate().getMonth() === 5) {
      this.prideMonth = true;
      document.getElementById('toolbar-heading').classList.add('rainbow-text');
    }
  }

  ngOnDestroy(): void {
    this.firstnameSubscription.unsubscribe();
    this.surnameSubscription.unsubscribe();
    this.usernameSubscription.unsubscribe();
    this.serverInfoSubscription.unsubscribe();
    this.isMobileSubscription.unsubscribe();
  }

  onNetworkStatusChange(): void {
    this.offline = !navigator.onLine;
  }

  onNetworkStatusInfoClick(): void {
    this.snackBar.open(this.translate.translate('OFFLINE_HELP'));
  }

  onPrideMonthInfoClick() {
    const snackBar = this.snackBar.open(this.translate.translate('PRIDE_HELP'), this.translate.translate('LEARN_MORE'));
    snackBar.onAction().subscribe(() => {
      window.open('https://www.studentjob.at/blog/4830-lgbtq-pride-month-die-bedeutung-dahinter', '_blank');
    });
  }

  logout() {
    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'LOGOUT_CONFIRM',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
        this.authService.logout();
      }
    });
  }

  changeTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'dark') {
      localStorage.setItem('theme', 'black');
    } else {
      localStorage.setItem('theme', 'light');
    }
    this.setTheme();
  }

  setTheme() {
    if (localStorage.getItem('theme') == null) {
      localStorage.setItem('theme', 'light');
    }

    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      document.getElementById('body').classList.remove('dark-theme');
      document.getElementById('body').classList.remove('black-theme');
    } else if (theme === 'dark') {
      document.getElementById('body').classList.remove('black-theme');
      document.getElementById('body').classList.add('dark-theme');
    } else {
      document.getElementById('body').classList.add('black-theme');
      document.getElementById('body').classList.remove('dark-theme');
    }
  }
}
