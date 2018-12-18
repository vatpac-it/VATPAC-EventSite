import { Component } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  data = {
    title: 'Real Ops',
    subTitle: 'Sydney',
    airports: [
      {
        name: 'Sydney Kindsford Smith',
        icao: 'YSSY',
        chart: 'http://www.airservicesaustralia.com/aip/current/dap/SSYAD01-157_08NOV2018.pdf'
      },
      {
        name: 'Adelaide International',
        icao: 'YPAD',
        chart: 'http://www.airservicesaustralia.com/aip/current/dap/PADAD01-155_08NOV2018.pdf'
      }
    ],
    shifts: 30,
    selectedTimes: {
      '23/07/2018': {
        '930': {
          'airport': 'YSSY',
          'position': 'TWR'
        },
        '1000': {
          'airport': 'YPAD',
          'position': 'CTR'
        },
        '1030': {
          'airport': 'YMML',
          'position': 'CTR'
        }
      },
      '24/07/2018': {
        '0': {
          'airport': 'YMML',
          'position': 'CTR'
        },
        '30': {
          'airport': 'YPAD',
          'position': 'CTR'
        },
        '100': {
          'airport': 'YSSY',
          'position': 'TWR'
        }
      },
      '27/07/2018': {
        '0': {
          'airport': 'YSSY',
          'position': 'TWR'
        },
        '30': {
          'airport': 'YMML',
          'position': 'CTR'
        },
        '100': {
          'airport': 'YPAD',
          'position': 'CTR'
        }
      }
    },
    start: new Date('2018-07-23T00:00:00Z'),
    end: new Date('2018-07-27T10:00:00Z'),
    about: 'Real Ops focuses on running the airport like it was the real world, all positions within the airport will be rostered.\n\nPilots can expect holding and waits so remember to bring extra fuel. Controllers can expect hard work and many nonstandard procedures to deal with the traffic.\n\nThere will be 8 hours of continuous ATC service and over 20 ATC positions!',
    pilotInfo: 'This Pilot Briefing will cover all the relevant information for you. Including frequencies, airspace and taxi routes.',
    positions: {
      'YSSY': {
        'TWR': {
          '2018-07-23': [
            {name: 'Tom Grozev', rating: 'S2', start: 1730, end: 1830},
            {name: 'Harrison Scott', rating: 'C3', start: 1030, end: 1730}
          ],
          '2018-07-24': [
            {name: 'Tom Grozev', rating: 'S2', start: 930, end: 1830}
          ]
        }
      },
      'YPAD': {
        'CTR': {
          '2018-07-23': [
            {name: 'Tom Grozev', rating: 'S2', start: 1530, end: 1630}
          ]
        }
      },
      'YMML': {
        'CTR': {
          '2018-07-23': [
            {name: 'Tom Grozev', rating: 'S2', start: 1630, end: 1730}
          ]
        },
        'TWR': {}
      }
    }
  };


  constructor() {
    this.data.about = this.data.about.replace(/\n/g, '<br />');
    this.data.pilotInfo = this.data.pilotInfo.replace(/\n/g, '<br />');
  }

  formatDate(date: Date) {
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();

    return monthNames[monthIndex] + ' ' + day + this.nth(day);
  }

  nth(d) {
    if (d > 3 && d < 21) { return 'th'; }
    switch (d % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
      default: return 'th';
    }
  }

  formatTime(date: Date) {
    const time = date.toLocaleTimeString();

    return time.substr(0, time.length - 3) + ' (Browser Local)';
  }

}
