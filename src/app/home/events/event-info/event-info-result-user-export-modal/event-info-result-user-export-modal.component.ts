import {Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

import {ExcelService} from '../../../../utils/excel.service';
import {TranslateService} from '../../../../translation/translate.service';

import {EventResultUser} from '../../models/event-result-user.model';
import {UsersService} from '../../../management/users-management/users.service';
import {MyUserService} from '../../../my-user.service';
import {Permissions} from '../../../../permissions';
import {UIHelper} from '../../../../utils/helper/UIHelper';

@Component({
  selector: 'app-event-info-result-user-export-modalg',
  templateUrl: './event-info-result-user-export-modal.component.html',
  styleUrls: ['./event-info-result-user-export-modal.component.css'],
})
export class EventInfoResultUserExportModalComponent {
  private readonly resultUsers: EventResultUser[];
  private readonly fileName: string;
  private readonly date: Date;
  readonly allowedToPrintAdvanced: boolean;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<EventInfoResultUserExportModalComponent>,
    private translate: TranslateService,
    private usersService: UsersService,
    private myUserService: MyUserService,
    private excelService: ExcelService
  ) {
    this.resultUsers = this.data.resultUsers;
    this.fileName = this.data.fileName;
    this.date = this.data.date;
    this.allowedToPrintAdvanced =
      this.myUserService.hasPermission(Permissions.MANAGEMENT_USER_VIEW) ||
      this.myUserService.hasPermission(Permissions.MANAGEMENT_ADMINISTRATION);
    if (this.allowedToPrintAdvanced) {
      this.usersService.getUsers();
    }
  }

  simple() {
    const r = [];

    r.push({Datum: this.date.toISOString().substring(0, 16)});
    for (const user of this.resultUsers) {
      r.push({
        Vorname: user.firstname,
        Nachname: user.surname,
        Entscheidung: user.decision,
        Zusatz_Information: user.additionalInformation,
      });
    }
    this.excelService.exportAsExcelFile(r, this.fileName);
    this.bottomSheetRef.dismiss();
  }

  advanced() {
    const r = [];
    r.push({Datum: this.date.toISOString().substring(0, 16)});

    const aUsers = this.usersService.getUsers();
    for (const user of this.resultUsers) {
      let aUser;
      for (const sUser of aUsers) {
        if (sUser.id === user.id) {
          aUser = sUser;
          break;
        }
      }
      r.push({
        Nummer: aUser.getPhoneNumbersAsString(-1),
        Email: UIHelper.cutStrings(aUser.getEmailAddresses()),
        Vorname: user.firstname,
        Nachname: user.surname,
        Entscheidung: user.decision,
        Zusatz_Information: user.additionalInformation,
      });
    }
    this.excelService.exportAsExcelFile(r, 'erweitert_' + this.fileName);
    this.bottomSheetRef.dismiss();
  }
}
