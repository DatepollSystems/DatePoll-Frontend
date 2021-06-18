import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '../translation/translate.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private translate: TranslateService, private snackBar: MatSnackBar) {}

  public info(translationKey: string) {
    this.snackBar.open(this.translate.getTranslationFor(translationKey));
  }

  public infoWithoutTranslation(text: string) {
    this.snackBar.open(text);
  }
}
