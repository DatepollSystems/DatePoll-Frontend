import {Component, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-editor-preview',
  templateUrl: './editor-preview.component.html',
  styleUrls: ['./editor-preview.component.css']
})
export class EditorPreviewComponent {
  @Input()
  bodyHTML: string;

  constructor(private sanitizer: DomSanitizer) {}

  getSanitizedContent(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
