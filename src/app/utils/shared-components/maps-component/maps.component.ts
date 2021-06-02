import {HttpClient} from '@angular/common/http';
import {AfterViewInit, Component, EventEmitter, Input, Output} from '@angular/core';
import * as L from 'leaflet';
import {icon, Marker} from 'leaflet';

@Component({
  selector: 'app-maps-component',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
})
export class MapsComponent implements AfterViewInit {
  private map;
  private marker;
  @Input()
  public x: number;
  @Input()
  public y: number;

  public searchFilter: string;

  @Input()
  public showMarker = false;
  @Input()
  public edible = false;

  @Output()
  public coordinatesChanged = new EventEmitter();

  public randomMapId = 0;
  public hideMap = false;

  constructor(private http: HttpClient) {
    this.randomMapId = Math.random();
  }

  ngAfterViewInit(): void {
    this.initMap(this.x, this.y);
    if (this.showMarker) {
      this.drawMarker(this.x, this.y);
    }

    setTimeout(() => {
      this.hideMap = true;
    });
  }

  clearSelection() {
    this.removeMarker();
    const coordinates = {
      x: 0,
      y: 0,
    };
    this.coordinatesChanged.emit(coordinates);
  }

  search() {
    this.http.get('https://geocode.xyz/' + this.searchFilter + '?json=1').subscribe(
      (response: any) => {
        console.log(response);
        this.map.panTo(new L.LatLng(response.latt, response.longt));
      },
      (error) => console.log(error)
    );
  }

  private initMap(x: number, y: number): void {
    this.map = L.map(this.randomMapId.toString(), {
      center: [x, y],
      zoom: 12,
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);

    if (this.edible) {
      this.map.on('click', (event: any) => {
        this.x = event.latlng.lat;
        this.y = event.latlng.lng;
        this.drawMarker(this.x, this.y);

        const coordinates = {
          x: this.x,
          y: this.y,
        };
        this.coordinatesChanged.emit(coordinates);

        console.log(event.latlng.lat + ' ' + event.latlng.lng);
      });
    }
  }

  drawMarker(x: number, y: number) {
    this.removeMarker();

    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    Marker.prototype.options.icon = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    this.marker = L.marker([x, y]).addTo(this.map);
  }

  removeMarker(hideMap = false) {
    if (hideMap) {
      this.hideMap = true;
    }
    if (this.marker != null) {
      this.marker.removeFrom(this.map);
    }
  }
}
