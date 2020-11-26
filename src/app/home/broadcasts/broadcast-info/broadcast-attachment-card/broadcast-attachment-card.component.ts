import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {ClipboardHelper} from '../../../../utils/clipboard';

@Component({
  selector: 'app-broadcast-attachment-card',
  templateUrl: './broadcast-attachment-card.component.html',
  styleUrls: ['./broadcast-attachment-card.component.css'],
})
export class BroadcastAttachmentCardComponent implements OnInit {
  apiUrl = environment.apiUrl;

  @Input()
  attachment: any;

  showShowImage = false;
  showImage = false;

  constructor() {
    const i = this.apiUrl.indexOf('/api');
    this.apiUrl = this.apiUrl.slice(0, i) + '/attachment/';
  }

  ngOnInit() {
    const end = this.attachment.name.split('.')[this.attachment.name.split('.').length - 1].trim().toLowerCase();
    if (end.includes('png') || end.includes('jpeg') || end.includes('jpg')) {
      this.showShowImage = true;
    }
  }

  public copyTokenToClipboard(val) {
    ClipboardHelper.copyToClipboard(val);
  }

  toggleImageView() {
    if (this.showShowImage) {
      this.showImage = !this.showImage;
    }
  }
}
