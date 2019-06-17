import {Component} from '@angular/core';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.css']
})
export class FeedbackModalComponent {
  sendBrowserData = false;
  feedback: string;

  sendFeedback() {
    console.log('Feedback:' + this.feedback);

    console.log('Send browser data:' + this.sendBrowserData);

    if (this.sendBrowserData) {

    }
  }
}
