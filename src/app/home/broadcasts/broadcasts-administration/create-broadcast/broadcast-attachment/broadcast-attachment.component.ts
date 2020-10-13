import {Component, EventEmitter, Output} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import {BroadcastsAdministrationService} from '../../broadcasts-administration.service';

export interface Attachment {
  id: number;
  name: string;
}

@Component({
  selector: 'app-broadcast-attachment',
  templateUrl: './broadcast-attachment.component.html',
  styleUrls: ['./broadcast-attachment.component.css'],
})
export class BroadcastAttachmentComponent {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  attachments: Attachment[] = [];

  error: string;
  uploadResponse = {status: '', message: '', filePath: ''};

  @Output()
  attachmentsChange = new EventEmitter<Attachment[]>();

  constructor(private broadcastsService: BroadcastsAdministrationService) {}

  remove(attachment: Attachment): void {
    const index = this.attachments.indexOf(attachment);

    if (index >= 0) {
      this.attachments.splice(index, 1);
    }

    this.broadcastsService.deleteAttachment(attachment.id).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => console.log(error)
    );
    this.attachmentsChange.emit(this.attachments.slice());
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append('file_0', file);
      formData.append('files_count', '1');

      this.broadcastsService.uploadAttachments(formData).subscribe(
        (res) => {
          this.uploadResponse = res;
          if (res.files) {
            console.log(res);
            this.attachments.push({
              id: res.files[0].id,
              name: res.files[0].name.trim(),
            });
            this.attachmentsChange.emit(this.attachments.slice());
            event.target.files = [];
          }
        },
        (err) => (this.error = err)
      );
    }
  }
}
