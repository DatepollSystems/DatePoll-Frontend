import {Component} from '@angular/core';
import {TranslateService} from '../translate.service';
import {MzModalService, MzToastService} from 'ngx-materialize';
import {FeedbackModalComponent} from './modals/feedback-modal/feedback-modal.component';
import {AboutModalComponent} from './modals/about-modal/about-modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  constructor(private translate: TranslateService, private toastService: MzToastService, private modalService: MzModalService) {
  }

  setLang(lang: string) {
    this.translate.use(lang);
    this.toastService.show('Changed language to ' + lang, 2000);
  }

  openFeedbackModal() {
    this.modalService.open(FeedbackModalComponent);
  }

  openAboutModal() {
    this.modalService.open(AboutModalComponent);
  }

}
