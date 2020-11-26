import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {ClipboardHelper} from '../utils/clipboard';

@Component({
  selector: 'app-broadcast-download',
  templateUrl: './broadcast-download.component.html',
  styleUrls: ['./broadcast-download.component.css'],
})
export class BroadcastDownloadComponent implements OnInit {
  apiUrl = environment.apiUrl;
  token = null;

  constructor(private router: Router, private route: ActivatedRoute) {
    const i = this.apiUrl.indexOf('/api');
    this.apiUrl = this.apiUrl.slice(0, i) + '/attachment/';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const token = params.get('token');

      if (token != null) {
        this.token = token;
        console.log('File to download: ' + token);
        const link = document.createElement('a');
        link.download = name;
        link.href = this.apiUrl + token;
        document.body.appendChild(link);
        // If there is no file for this token the redirects happens on the server to not-found
        link.click();
        document.body.removeChild(link);
      } else {
        console.log('Token is null');
        this.router.navigateByUrl('/not-found');
      }
    });
  }

  goBack() {
    window.history.back();
  }

  copyToClipboard(val) {
    ClipboardHelper.copyToClipboard(val);
  }
}
