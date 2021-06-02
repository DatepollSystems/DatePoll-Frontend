import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatSelect} from '@angular/material/select';
import {FormControl} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-year-select',
  templateUrl: './year-select.component.html',
  styleUrls: ['./year-select.component.css'],
})
export class YearSelectComponent implements OnDestroy {
  years: string[] = [];
  selectedYear: string;
  @Output()
  selectedYearChange = new EventEmitter<string>();

  @ViewChild('yearSelect', {static: true}) yearSelect: MatSelect;

  protected _onDestroy = new Subject<void>();
  public yearCtrl: FormControl = new FormControl();
  public yearFilterCtrl: FormControl = new FormControl();
  public filteredYears: ReplaySubject<string[]> = new ReplaySubject<string[]>(1);

  constructor() {}

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  initialize(selectedYear: string, years: string[]) {
    this.selectedYear = selectedYear;
    this.years = years.slice();

    console.log(this.selectedYear);
    console.log(this.years);

    // load the initial years list
    this.filteredYears.next(this.years.slice());

    this.yearCtrl.setValue(this.selectedYear);

    // listen for search field value changes
    this.yearFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterYears();
    });

    this.setInitialValue();
  }

  yearSelectChange(value) {
    this.selectedYear = value;
    this.selectedYearChange.emit(this.selectedYear);
  }

  private filterYears() {
    if (!this.years) {
      return;
    }
    let search = this.yearFilterCtrl.value;
    if (!search) {
      this.filteredYears.next(this.years.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredYears.next(this.years.filter((year) => year.toString().toLowerCase().indexOf(search) > -1));
  }

  private setInitialValue() {
    this.filteredYears.pipe(take(1), takeUntil(this._onDestroy)).subscribe(() => {
      // setting the compareWith property to a comparison function
      // triggers initializing the selection according to the initial value of
      // the form control (i.e. _initializeSelection())
      // this needs to be done after the filteredYears are loaded initially
      // and after the mat-option elements are available
      this.yearSelect.compareWith = (a: string, b: string) => a && b && a === b;
    });
  }
}
