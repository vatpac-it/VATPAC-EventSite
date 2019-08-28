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
  @Input() positions: string[] = [];

  constructor() { }

  ngOnInit() {
  }

  setFilter(airport: string, position: string) {
    this.airportFilter.emit({airport: airport, postion: position});
  }

  getColour(position): string {
    switch (position.slice(-3)) {
      case 'DEL':
        return 'dblue';

      case 'GND':
        return 'lblue';

      case 'TWR':
        return 'orange';

      case 'APP':
        return 'red';

      case 'DEP':
        return 'pink';

      case 'CTR':
        return 'green';

    }
  }

}
