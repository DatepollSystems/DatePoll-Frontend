import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Subscription} from 'rxjs';

import {BroadcastsAdministrationService} from './broadcasts-administration.service';
import {TranslateService} from '../../../translation/translate.service';
import {MyUserService} from '../../my-user.service';
import {Permissions} from '../../../permissions';

import {QuestionDialogComponent} from '../../../utils/shared-components/question-dialog/question-dialog.component';
import {YearSelectComponent} from '../../../utils/shared-components/year-select/year-select.component';

import {Broadcast} from '../models/broadcast.model';
import {UIHelper} from '../../../utils/helper/UIHelper';
import {Converter} from '../../../utils/helper/Converter';

@Component({
  selector: 'app-broadcasts-administration',
  templateUrl: './broadcasts-administration.component.html',
  styleUrls: ['./broadcasts-administration.component.css'],
})
export class BroadcastsAdministrationComponent implements OnInit, OnDestroy {
  hasPermissionToDeleteBroadcast = false;

  private years: string[];
  private yearsSubscription: Subscription;
  private selectedYear: string = null;
  @ViewChild(YearSelectComponent) yearSelect: YearSelectComponent;

  displayedColumns: string[] = ['subject', 'sent', 'writer', 'body', 'action'];
  filterValue: string = null;
  dataSource: MatTableDataSource<Broadcast>;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  broadcasts: Broadcast[] = [];
  broadcastsSubscription: Subscription;

  loading = true;

  constructor(
    private myUserService: MyUserService,
    private broadcastsService: BroadcastsAdministrationService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    this.years = this.broadcastsService.getYears();
    this.selectedYear = this.years[this.years.length - 1];
    this.yearsSubscription = this.broadcastsService.yearsChange.subscribe((value) => {
      this.years = value;
      this.selectedYear = this.years[this.years.length - 1];
      for (const year of this.years) {
        if (year.includes(UIHelper.getCurrentDate().getFullYear().toString())) {
          console.log('in');
          this.selectedYear = year;
          break;
        }
      }

      this.yearSelect.initialize(this.selectedYear, this.years);

      this.broadcasts = this.broadcastsService.getBroadcasts(Converter.stringToNumber(this.selectedYear));
      if (this.broadcasts.length !== 0) {
        this.loading = false;
      }
      this.dataSource = new MatTableDataSource(this.broadcasts);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.broadcastsSubscription = this.broadcastsService.broadcastsChange.subscribe((value) => {
        this.broadcasts = value;
        this.loading = false;
        this.dataSource = new MatTableDataSource(this.broadcasts);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.hasPermissionToDeleteBroadcast = this.myUserService.hasPermission(Permissions.BROADCASTS_DELETE_EXTRA);
    });
  }

  ngOnDestroy(): void {
    this.broadcastsSubscription.unsubscribe();
    this.yearsSubscription.unsubscribe();
  }

  yearSelectChange(value) {
    this.selectedYear = value;
    this.broadcastsService.getBroadcasts(value);
  }

  refresh() {
    this.loading = true;
    this.broadcastsService.fetchBroadcasts();
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue;
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.sort = this.sort;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openBroadcastAdminInfo(broadcast: Broadcast) {
    this.router.navigateByUrl('/home/broadcasts/administration/' + broadcast.id, {state: broadcast});
  }

  removeBroadcast(id: number) {
    const bottomSheetRef = this.bottomSheet.open(QuestionDialogComponent, {
      data: {
        question: 'BROADCASTS_ADMINISTRATION_DELETE_CONFIRMATION_QUESTION',
      },
    });

    bottomSheetRef.afterDismissed().subscribe((value: string) => {
      if (value?.includes(QuestionDialogComponent.YES_VALUE)) {
        this.broadcastsService.deleteBroadcast(id).subscribe(
          (response: any) => {
            console.log(response);
            this.broadcastsService.fetchBroadcasts();
            this.snackBar.open(this.translate.getTranslationFor('BROADCASTS_ADMINISTRATION_DELETE_SUCCESSFULLY'));
          },
          (error) => console.log(error)
        );
      }
    });
  }
}
