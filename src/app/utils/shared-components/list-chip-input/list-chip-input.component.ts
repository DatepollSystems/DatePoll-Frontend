import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-list-chip-input',
  templateUrl: './list-chip-input.component.html',
  styleUrls: ['./list-chip-input.component.css'],
})
export class ListChipInputComponent {
  @Input()
  label = 'Input';
  @Input()
  placeHolder = 'ADD';
  @Input()
  removable = true;
  @Input()
  disabled = false;

  @Input()
  strings: string[] = [];
  /**
   * Leave empty to disable autocompletion
   */
  @Input()
  allStringsToAutoComplete: string[] = [];
  @Output()
  valueChange = new EventEmitter<string[]>();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  stringCtrl = new FormControl();
  filteredStrings: Observable<string[]>;
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;
  // @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor() {
    this.filteredStrings = this.stringCtrl.valueChanges.pipe(
      startWith(null),
      map((string: string | null) => (string ? this._filter(string) : this.allStringsToAutoComplete.slice()))
    );
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.strings.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.stringCtrl.setValue(null);
    this.valueChange.emit(this.strings.slice());
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.strings.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.stringCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allStringsToAutoComplete.filter((fruit) => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

  remove(string: string) {
    const i = this.strings.indexOf(string);
    this.strings.splice(i, 1);
    this.valueChange.emit(this.strings.slice());
  }
}
