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

  @Input() readonly shifts: number;
  @Input() readonly start: Date;
  @Input() readonly end: Date;

  public dates: Date[];
  public airports: Array<String>;
  public timelineTimes: Array<number>;

  currentFilter = {airport: '', postion: ''};
  currentDate: Date;

  @Input() public selectedTimes: {
    [date: string]: {
      [time: string]: {airport: string, position: string}
    }
  } = {};
  selectedDefault = false;

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

    this.selectedDefault = this.timesAreSelected();

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
        for (let s = this.getStartTime(start); s <= (this.getEndTime(start) - this.shifts); s += this.shifts) {
          const e = s + this.shifts;

          const o_s = this.getOutTime(s);
          const o_e = this.getOutTime(e);

          const time = this.doTimesContain(times, o_s, o_e);
          if (!ordered.includes(time)) {
            ordered.push(time);
          }
          if (!this.timelineTimes.includes(o_s)) {
            this.timelineTimes.push(o_s);
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

  getEndTime(date: Date) {
    if (date.toString() === this.end.toString()) {
      return this.getNumTime(this.end);
    } else {
      return 1440;
    }
  }

  getStartTime(date: Date) {
    if (date === this.start) {
      return this.getNumTime(date);
    } else {
      return 0;
    }
  }

  getNumTime(date: Date) {
    const minutes = date.getMinutes();
    const hours = date.getHours();

    return minutes + (hours * 60);
  }

  getOutTime(time: number) {
    const minutes = time % 60;
    const hours = Math.floor(time / 60);

    return (hours * 100) + minutes;
  }

  doTimesContain(times: Array<Time>, start: number, end: number): Time {
    if (typeof times === 'undefined') { times = []; }
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

  formatTime(time: number): string {
    let ret_t = time.toString();
    while (ret_t.length < 4) {
      ret_t = '0' + ret_t;
    }
    return ret_t;
  }

  formatDate(date: Date) {
    let day = '' + date.getDate(),
      month = '' + (date.getMonth() + 1);
    const year = date.getFullYear();
    if (day.length < 2) { day = '0' + day; }
    if (month.length < 2) { month = '0' + month; }

    return [day, month, year].join('/');
  }

  getDates(startDate, stopDate): Date[] {
    const dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      const formattedDate = this.formatDate(currentDate);
      if (!(formattedDate in this.selectedTimes)) {
        this.selectedTimes[formattedDate] = {};
      }

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

  timesAreSelected() {
    for (const date in this.selectedTimes) {
      if (Object.keys(this.selectedTimes[date]).length > 0) {
        return true;
      }
    }
    return this.selectedDefault;
  }


}
