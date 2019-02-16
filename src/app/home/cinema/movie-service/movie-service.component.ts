import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../services/settings.service';

@Component({
  selector: 'app-movie-service',
  templateUrl: './movie-service.component.html',
  styleUrls: ['./movie-service.component.css']
})
export class MovieServiceComponent implements OnInit {

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
    this.settingsService.checkShowCinema();
  }

}
