import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';

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
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  toggleImageView() {
    if (this.showShowImage) {
      this.showImage = !this.showImage;
    }
  }
}
