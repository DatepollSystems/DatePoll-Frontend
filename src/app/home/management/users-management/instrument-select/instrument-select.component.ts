import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {PerformanceBadgesService} from '../../performance-badges-management/performance-badges.service';
import {Instrument} from '../../performance-badges-management/models/instrument.model';

@Component({
  selector: 'app-instrument-select',
  templateUrl: './instrument-select.component.html',
  styleUrls: ['./instrument-select.component.css']
})
export class InstrumentSelectComponent implements OnInit, OnDestroy {

  /** control for the selected years */
  public instrumentCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public instrumentFilterCtrl: FormControl = new FormControl();

  /** list of instruments filtered by search keyword */
  public filteredInstruments: ReplaySubject<Instrument[]> = new ReplaySubject<Instrument[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  instruments: Instrument[];
  instrumentsSubscription: Subscription;
  selectedInstrument: Instrument;

  @Output() instrumentChanged = new EventEmitter();

  constructor(private performanceBadgesService: PerformanceBadgesService) {
    this.instruments = this.performanceBadgesService.getInstruments();
    if (this.instruments == null) {
      this.instruments = [];
    }
    this.filteredInstruments.next(this.instruments.slice());
    this.instrumentsSubscription = this.performanceBadgesService.instrumentsChange.subscribe((value) => {
      this.instruments = value;
      if (this.instruments == null) {
        this.instruments = [];
      }
      this.filteredInstruments.next(this.instruments.slice());
    });
  }

  ngOnInit() {
    // load the initial years list
    this.filteredInstruments.next(this.instruments.slice());

    // listen for search field value changes
    this.instrumentFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterInstruments();
      });
  }

  ngOnDestroy(): void {
    this.instrumentsSubscription.unsubscribe();
  }

  private filterInstruments() {
    if (!this.instruments) {
      return;
    }
    // get the search keyword
    let search = this.instrumentFilterCtrl.value;
    if (!search) {
      this.filteredInstruments.next(this.instruments.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the instruments
    this.filteredInstruments.next(
      this.instruments.filter(p => p.name.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  instrumentSelectChange(value) {
    this.selectedInstrument = value;
    this.instrumentChanged.emit(this.selectedInstrument);
  }
}
