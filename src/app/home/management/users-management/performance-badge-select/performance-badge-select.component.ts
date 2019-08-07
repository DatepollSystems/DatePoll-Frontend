import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {PerformanceBadgesService} from '../../performance-badges-management/performance-badges.service';
import {PerformanceBadge} from '../../performance-badges-management/models/performanceBadge.model';

@Component({
  selector: 'app-performance-badge-select',
  templateUrl: './performance-badge-select.component.html',
  styleUrls: ['./performance-badge-select.component.css']
})
export class PerformanceBadgeSelectComponent implements OnInit, OnDestroy {

  /** control for the selected years */
  public performanceBadgeCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public performanceBadgeFilterCtrl: FormControl = new FormControl();

  /** list of performanceBadges filtered by search keyword */
  public filteredPerformanceBadges: ReplaySubject<PerformanceBadge[]> = new ReplaySubject<PerformanceBadge[]>(1);
  performanceBadges: PerformanceBadge[];
  performanceBadgesSubscription: Subscription;
  selectedPerformanceBadge: PerformanceBadge;
  @Output() performanceBadgeChanged = new EventEmitter();
  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  constructor(private performanceBadgesService: PerformanceBadgesService) {
    this.performanceBadges = this.performanceBadgesService.getPerformanceBadges();
    if (this.performanceBadges == null) {
      this.performanceBadges = [];
    }
    this.filteredPerformanceBadges.next(this.performanceBadges.slice());
    this.performanceBadgesSubscription = this.performanceBadgesService.performanceBadgesChange.subscribe((value) => {
      this.performanceBadges = value;
      if (this.performanceBadges == null) {
        this.performanceBadges = [];
      }
      this.filteredPerformanceBadges.next(this.performanceBadges.slice());
    });
  }

  ngOnInit() {
    // load the initial years list
    this.filteredPerformanceBadges.next(this.performanceBadges.slice());

    // listen for search field value changes
    this.performanceBadgeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPerformanceBadges();
      });
  }

  ngOnDestroy(): void {
    this.performanceBadgesSubscription.unsubscribe();
  }

  performanceBadgeSelectChange(value) {
    this.selectedPerformanceBadge = value;
    this.performanceBadgeChanged.emit(this.selectedPerformanceBadge);
  }

  private filterPerformanceBadges() {
    if (!this.performanceBadges) {
      return;
    }
    // get the search keyword
    let search = this.performanceBadgeFilterCtrl.value;
    if (!search) {
      this.filteredPerformanceBadges.next(this.performanceBadges.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the performanceBadges
    this.filteredPerformanceBadges.next(
      this.performanceBadges.filter(p => p.name.toString().toLowerCase().indexOf(search) > -1)
    );
  }
}
