import {Component} from '@angular/core';
import {MyUserService} from '../../my-user.service';
import {TranslateService} from '../../../translation/translate.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-personaldata',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent {
  title: string;

  birthday: Date;

  streetname: string;
  streetnumber: string;
  zipcode: number;
  location: string;

  constructor(
    private myUserService: MyUserService,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {
    this.title = this.myUserService.getTitle();

    this.birthday = this.myUserService.getBirthday();

    this.streetname = this.myUserService.getStreetname();
    this.streetnumber = this.myUserService.getStreetnumber();
    this.zipcode = this.myUserService.getZipcode();
    this.location = this.myUserService.getLocation();
  }

  saveData() {
    console.log('personalData | Update user');
    console.log('personalData | Title: ' + this.title);
    console.log('personalData | Birthday: ' + this.birthday);
    console.log('personalData | Streetname: ' + this.streetname);
    console.log('personalData | Streetnumber: ' + this.streetnumber);
    console.log('personalData | Zipcode: ' + this.zipcode);
    console.log('personalData | Location: ' + this.location);

    this.myUserService.setTitle(this.title);
    this.myUserService.setBirthday(this.birthday);
    this.myUserService.setStreetname(this.streetname);
    this.myUserService.setStreetnumber(this.streetnumber);
    this.myUserService.setZipcode(this.zipcode);
    this.myUserService.setLocation(this.location);

    console.log('personalData | Saving...');
    this.myUserService.updateMyself().subscribe(
      (data: any) => {
        console.log(data);
        this.notificationsService.success(
          this.translate.getTranslationFor('SUCCESSFULLY'),
          this.translate.getTranslationFor('SETTINGS_PERSONAL_DATA_MODAL_PERSONAL_DATA_SAVED_SUCCESSFULLY')
        );
      },
      error => console.log(error)
    );
  }
}
