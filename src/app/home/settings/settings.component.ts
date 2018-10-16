import { Component, OnInit } from '@angular/core';
import {MzModalService} from 'ngx-materialize';
import {PersonalDataComponent} from './personal-data/personal-data.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private modalService: MzModalService) { }

  ngOnInit() { }

  openPersonalDataModal() {
    this.modalService.open(PersonalDataComponent);
  }

}
