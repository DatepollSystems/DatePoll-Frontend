import {Component, Input} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-editor-preview',
  templateUrl: './editor-preview.component.html',
  styleUrls: ['./editor-preview.component.css'],
})
export class EditorPreviewComponent {
  @Input()
  bodyHTML: string;

  html: SafeHtml = null;

  constructor(private sanitizer: DomSanitizer) {}

  getSanitizedContent() {
    if (this.html == null) {
      this.html = this.sanitizer.bypassSecurityTrustHtml(this.bodyHTML.replace(/(<style[\w\W]+style>)/g, ''));
    }
    return this.html;
  }
}
