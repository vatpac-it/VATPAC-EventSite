import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-airport-line',
  templateUrl: './airport-line.component.html',
  styleUrls: ['./airport-line.component.css']
})
export class AirportLineComponent implements OnInit {

  @Input() airport: string;
  @Input() currentFilter: {airport: string, postion: string};
  @Output() airportFilter = new EventEmitter<{airport: string, postion: string}>();

  constructor() { }

  ngOnInit() {
  }

  setFilter(airport: string, position: string) {
    console.log(this.currentFilter);
    this.airportFilter.emit({airport: airport, postion: position});
  }

}
