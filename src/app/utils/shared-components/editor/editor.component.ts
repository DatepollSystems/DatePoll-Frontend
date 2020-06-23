import {Component, EventEmitter, Output} from '@angular/core';

import {DomSanitizer} from '@angular/platform-browser';
import {EditorChangeContent, EditorChangeSelection} from 'ngx-quill';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  modules = {};

  bodyHTML: string;
  body: string;

  @Output() bodyHTMLChanged = new EventEmitter<string>();
  @Output() bodyChanged = new EventEmitter<string>();

  constructor(private sanitizer: DomSanitizer) {
    this.modules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],
        [{header: 1}, {header: 2}], // custom button values
        [{list: 'ordered'}, {list: 'bullet'}],
        [{script: 'sub'}, {script: 'super'}], // superscript/subscript
        [{header: [1, 2, 3, 4, 5, 6, false]}],
        [{color: []}, {background: []}], // dropdown with defaults from theme
        ['clean'], // remove formatting button
        ['link'] // link and image, video
      ]
    };
  }

  getSanitizedContent(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    if (event.event === 'text-change') {
      this.bodyHTML = event.html;
      this.body = event.text;
      this.bodyHTMLChanged.emit(this.bodyHTML);
      this.bodyChanged.emit(this.body);
    }
  }
}
