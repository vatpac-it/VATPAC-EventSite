import {Component, Input, OnInit} from '@angular/core';
import {Time} from './Time';

@Component({
  selector: 'app-reserve-atc',
  templateUrl: './reserve-atc.component.html',
  styleUrls: ['./reserve-atc.component.css']
})
export class ReserveATCComponent implements OnInit {
  @Input() readonly times: {
    [airport: string]: {
      [position: string]: {
        [date: string]: Array<Time>
      }
    }
  };

  @Input() readonly start: Date;
  @Input() readonly end: Date;

  public dates: String[];
  public airports: Array<String>;
  public timelineTimes: Array<number>;

  currentFilter = {airport: '', postion: ''};
  currentDate: Date;

  private outputTimes: {
    airport: string,
    position: string,
    times: Array<Time>
  }[];

  public filteredTimes: {
    airport: string,
    position: string,
    times: Array<Time>
  }[];

  constructor() {
    this.outputTimes = [];
    this.airports = [''];
    this.timelineTimes = [];
  }

  ngOnInit() {

    this.dates = this.getDates(this.start, this.end);

    this.setTimesForDay(this.start);
  }

  setTimesForDay(start: Date) {
    this.currentDate = start;
    this.outputTimes = [];
    this.timelineTimes = [];

    const date = start.toISOString().substr(0, 10);

    for (const airport in this.times) {
      const positions = this.times[airport];
      for (const position in positions) {
        const times = positions[position][date];

        const ordered = [];
        for (let s = this.getNumTime(start); s <= (this.getEndTime(start) - 100); s += 100) {
          const e = s + 100;
          const time = this.doTimesContain(times, s, e);
          if (!ordered.includes(time)) {
            ordered.push(time);
          }
          if (!this.timelineTimes.includes(s)) {
            this.timelineTimes.push(s);
          }
        }
        if (!this.airports.includes(airport)) {
          this.airports.push(airport);
        }
        this.outputTimes.push({airport: airport, position: position, times: ordered});
      }
    }

    this.filteredTimes = this.outputTimes;
    console.log(this.filteredTimes);
  }

  getEndTime(start: Date) {
    if (start.toDateString() === this.end.toDateString()) {
      return this.getNumTime(this.end);
    } else {
      return 2400;
    }
  }

  getNumTime(date: Date) {
    let time = date.toLocaleTimeString();
    time = time.substr(0, time.length - 3);
    time = time.replace(':', '');

    return parseInt(time);
  }

  doTimesContain(times: Array<Time>, start: number, end: number): Time {
    if (typeof times === 'undefined') { times = []; };
    for (const time of times) {
      if (end > time.start && end <= time.end)  {
        return time;
      }
    }

    return {start: start, end: end, name: null, rating: null};
  }

  filterTimes(filter: {airport: string, postion: string}) {
    this.filteredTimes = this.outputTimes;
    this.currentFilter = filter;

    if (filter.airport === '' && filter.postion === '') { return; }

    if (filter.airport === '' && filter.postion !== '') {
      this.filteredTimes = this.outputTimes.filter(time => time.position === filter.postion);
    } else if (filter.airport !== '' && filter.postion === '') {
      this.filteredTimes = this.outputTimes.filter(time => time.airport === filter.airport);
    } else {
      this.filteredTimes = this.outputTimes.filter(time => time.airport === filter.airport && time.position === filter.postion);
    }
  }

  formatDate(date: Date) {
    let day = '' + date.getDate(),
      month = '' + (date.getMonth() + 1);
    const year = date.getFullYear();
    if (day.length < 2) { day = '0' + day; }
    if (month.length < 2) { month = '0' + month; }

    return [day, month, year].join('/');
  }

  getDates(startDate, stopDate): String[] {
    const dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(currentDate);
      currentDate = this.addDays(currentDate, 1);
    }
    return dateArray;
  }

  addDays(date, days) {
    const dat = new Date(date);
    dat.setDate(dat.getDate() + days);
    return dat;
  }


}
