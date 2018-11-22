import {Component, OnInit} from '@angular/core';
import {CinemaService, Movie} from '../cinema.service';
import {MovieEditModalComponent} from './movie-edit-modal/movie-edit-modal.component';
import {MatDialog, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-movie-administration',
  templateUrl: './movie-administration.component.html',
  styleUrls: ['./movie-administration.component.css']
})
export class MovieAdministrationComponent implements OnInit {

  displayedColumns: string[] = ['name', 'date', 'trailer', 'poster', 'worker', 'emergencyWorker', 'bookedTickets'];
  dataSource: MatTableDataSource<Movie>;

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    // this.dataSource.paginator = this.paginator;
  }

  constructor(private cinemaService: CinemaService, private dialog: MatDialog) {
    this.dataSource = new MatTableDataSource(this.cinemaService.getMovies());
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  onEdit(id: number) {
    this.dialog.open(MovieEditModalComponent, {
      width: '80vh',
      data: {movie: this.cinemaService.getMovieByID(id)}
    });
  }
}
