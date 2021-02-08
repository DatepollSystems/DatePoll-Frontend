import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-list-chip-input',
  templateUrl: './list-chip-input.component.html',
  styleUrls: ['./list-chip-input.component.css'],
})
export class ListChipInputComponent implements OnInit {
  /**
   * Key of translation string in language files.
   * Take a look at de.json
   */
  @Input()
  label = 'Input';
  /**
   * Key of translation string in language files.
   */
  @Input()
  placeHolder = 'ADD';

  /**
   * General input settings
   */
  @Input()
  removable = true;
  @Input()
  disabled = false;
  @Input()
  inHighComma = false;

  /**
   * Already filled in strings
   */
  @Input()
  strings: string[] = [];
  /**
   * Leave empty to disable autocompletion
   */
  @Input()
  allStringsToAutoComplete: string[] = [];
  @Output()
  valueChange = new EventEmitter<string[]>();

  /**
   * Internal functional stuff
   */
  separatorKeysCodes: number[] = [ENTER, COMMA];
  stringCtrl = new FormControl();
  filteredStrings: Observable<string[]>;
  @ViewChild('stringInput') stringInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {}

  ngOnInit() {
    console.log('List to autocomplete:');
    console.log(this.allStringsToAutoComplete);
    this.filteredStrings = this.stringCtrl.valueChanges.pipe(
      startWith(null),
      map((string: string | null) => (string ? this._filter(string) : this.allStringsToAutoComplete.slice()))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allStringsToAutoComplete.filter((fruit) => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  add(event: MatChipInputEvent): void {
    const value = event.value;
    if ((value || '').trim()) {
      this.addValue(value.trim());
    }

    const input = event.input;
    if (input) {
      input.value = '';
    }
  }

  /**
   * Used on auto complete click event
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    this.addValue(event.option.viewValue);
    this.stringInput.nativeElement.value = '';
  }

  remove(string: string) {
    const i = this.strings.indexOf(string);
    this.strings.splice(i, 1);
    this.emitChange();
  }

  private addValue(value: string) {
    this.strings.push(value);
    this.stringCtrl.setValue(null);
    this.emitChange();
  }

  private emitChange() {
    this.valueChange.emit(this.strings.slice());
  }
}
