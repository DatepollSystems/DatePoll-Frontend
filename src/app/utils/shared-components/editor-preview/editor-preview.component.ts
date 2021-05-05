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
  @Input()
  livePreview = false;

  html: SafeHtml = null;

  constructor(private sanitizer: DomSanitizer) {}

  getSanitizedContent() {
    if (this.html == null) {
      this.html = this.getSanitizedContentPreview(this.bodyHTML);
    }
    return this.html;
  }

  getSanitizedContentPreview(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html.replace(/(<style[\w\W]+style>)/g, ''));
  }
}
