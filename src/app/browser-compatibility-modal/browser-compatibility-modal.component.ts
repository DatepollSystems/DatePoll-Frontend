import { Component, OnInit } from '@angular/core';

import {TranslateService} from '../translation/translate.service';

@Component({
  selector: 'app-browser-compatibility-modal',
  templateUrl: './browser-compatibility-modal.component.html',
  styleUrls: ['./browser-compatibility-modal.component.css']
})
export class BrowserCompatibilityModalComponent implements OnInit {

  private currentYear: number;

  private content2: string;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.currentYear = new Date().getFullYear();
    this.content2 = this.translate.getTranslationFor('BROWSER_COMPATIBILITY_CONTENT_2');
  }

}
