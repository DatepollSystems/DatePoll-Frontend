import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../users.service';

@Component({
  selector: 'app-movie-ticket',
  templateUrl: './movie-ticket.component.html',
  styleUrls: ['./movie-ticket.component.css']
})
export class MovieTicketComponent implements OnInit {

  @Input('name') name: string;
  @Input('date') date: Date;
  @Input('trailerLink') trailerLink: string;
  @Input('imageLink') imageLink: string;
  @Input('worker') worker: User;
  @Input('emergencyWorker') emergencyWorker: User;
  @Input('bookedTickets') bookedTickets: number;

  constructor() { }

  ngOnInit() { }

}
