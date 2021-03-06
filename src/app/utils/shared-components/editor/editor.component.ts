import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {EditorChangeContent, EditorChangeSelection, QuillEditorComponent} from 'ngx-quill';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnChanges {
  modules = {};

  @Input()
  bodyHTML: string;
  @Input()
  body: string;

  @Output() bodyHTMLChanged = new EventEmitter<string>();
  @Output() bodyChanged = new EventEmitter<string>();

  @ViewChild(QuillEditorComponent, {static: true}) quill: QuillEditorComponent;

  constructor() {
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
        ['link'], // link and image, video
      ],
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.body && this.bodyHTML) {
      this.quill.content = this.bodyHTML;
    }
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
