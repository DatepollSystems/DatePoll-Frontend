import {Component, OnInit} from '@angular/core';

import {TranslateService} from 'dfx-translate';
import {UIHelper} from '../utils/helper/UIHelper';

@Component({
  selector: 'app-browser-compatibility-modal',
  templateUrl: './browser-compatibility-modal.component.html',
  styleUrls: ['./browser-compatibility-modal.component.css'],
})
export class BrowserCompatibilityModalComponent implements OnInit {
  public currentYear: number;

  public content2: string;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.currentYear = UIHelper.getCurrentDate().getFullYear();
    this.content2 = this.translate.translate('BROWSER_COMPATIBILITY_CONTENT_2');
  }
}
