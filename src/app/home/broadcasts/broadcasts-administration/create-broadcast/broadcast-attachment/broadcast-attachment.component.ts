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
  uploadResponses: any[] = [];

  @Output()
  attachmentsChange = new EventEmitter<Attachment[]>();

  @Output()
  currentlyUploadingChange = new EventEmitter<boolean>();

  internalUploadId = 0;

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
    if (event.target?.files?.length > 0) {
      this.currentlyUploadingChange.emit(true);

      const formData = new FormData();
      let i = 0;
      for (const upFile of event.target.files) {
        formData.append('file_' + i, upFile);
        i++;
      }
      formData.append('files_count', event.target.files.length);

      const currentInternalUploadId = this.internalUploadId;
      this.internalUploadId++;

      this.broadcastsService.uploadAttachments(formData).subscribe(
        (res) => {
          let updated = false;
          for (const uploadResponse of this.uploadResponses) {
            if (currentInternalUploadId === uploadResponse.id) {
              uploadResponse.status = res.status;
              uploadResponse.message = res.message;
              uploadResponse.filePath = res.filePath;
              updated = true;
              break;
            }
          }

          if (!updated) {
            this.uploadResponses.push({
              id: currentInternalUploadId,
              status: res.status,
              message: res.message,
              filePath: res.filePath,
            });
          }
          if (res.files) {
            console.log(res);
            for (const upFile of res.files) {
              this.attachments.push({
                id: upFile.id,
                name: upFile.name.trim(),
              });
            }
            this.attachmentsChange.emit(this.attachments.slice());

            let everythingNull = true;
            for (const uploadResponse of this.uploadResponses) {
              if (uploadResponse.filePath != null || uploadResponse.message != null || uploadResponse.status != null) {
                everythingNull = false;
                break;
              }
            }

            if (everythingNull) {
              this.currentlyUploadingChange.emit(false);
            }
          }
        },
        (err) => {
          this.currentlyUploadingChange.emit(false);
          this.error = err;
        }
      );
    }
  }
}
