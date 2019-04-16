import {Component, Input, OnInit} from '@angular/core';
import {Time} from './Time';
import {EventService} from '../../services/event.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';

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

  @Input() readonly event_id: number;
  @Input() readonly published: number;

  public dates: Date[];
  public airports: Array<String>;
  public timelineTimes: Array<number>;

  hiddenCheckbox = false;

  buttonTxt = 'Save All Selected Times';
  buttonDisabled = true;

  currentFilter = {airport: '', postion: ''};
  currentDate: Date;

  @Input() public selectedTimes: {
    [date: string]: {
      [position: string]: Array<number>
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

  public selectTimes: {position: string, times: Array<Time>}[] = [
    {position: 'DEL', times: []},
    {position: 'GND', times: []},
    {position: 'TWR', times: []},
    {position: 'APP', times: []},
    {position: 'CTR', times: []}
  ];

  constructor(private eventService: EventService, private userService: UserService, private activeRoute: ActivatedRoute) {
    this.outputTimes = [];
    this.airports = [''];
    this.timelineTimes = [];
  }

  ngOnInit() {

    let outTimes: {
      [date: string]: {
        [position: string]: Array<number>
      }
    } = {};

    for (let date in this.selectedTimes) {
      if (this.selectedTimes.hasOwnProperty(date)) {
        let outDate = date;
        for (let position in this.selectedTimes[date]) {
          if (this.selectedTimes[date].hasOwnProperty(position)) {
            let t = this.selectedTimes[date][position];
            for (let tt in t) {
              if (t.hasOwnProperty(tt)) {
                let time = t[tt];
                const ts = time.toString().split(':');
                let d = new Date(Date.UTC(parseInt(date.substr(0, 4)),
                  parseInt(date.substr(5, 2))-1,
                  parseInt(date.substr(8, 2)),
                  parseInt(ts[0]), parseInt(ts[1]), parseInt(ts[2])));

                outDate = d.toLocaleDateString().split('/').reverse().join('-');

                if (!outTimes[outDate]) {
                  outTimes[outDate] = {};
                }
                if (!outTimes[outDate][position]) {
                  outTimes[outDate][position] = [];
                }

                outTimes[outDate][position].push(this.getOutTime(this.getNumTime(d)));
              }
            }
          }
        }
      }
    }

    this.selectedTimes = outTimes;

    this.dates = this.getDates(this.start, this.end);

    this.selectedDefault = this.timesAreSelected();

    this.setTimesForDay(this.start);

    this.userService.currentUser.subscribe((user) => {
      if (user) {
        this.buttonTxt = 'Save All Selected Times';
        this.buttonDisabled = false;
      } else {
        this.buttonTxt = 'Please login to submit';
        this.buttonDisabled = true;
      }
    });

  }

  setTimesForDay(start: Date) {
    this.currentDate = start;
    this.outputTimes = [];
    this.timelineTimes = [];

    const year = start.getFullYear();
    const month = start.getMonth() + 1;
    const day = start.getDate();

    let date = year + '-' + (month.toString().length === 1 ? '0' + month : month) + '-' + (day.toString().length === 1 ? '0' + day : day);
    date = date.substr(0, 10);

    for (const airport in this.times) {
      if (this.times.hasOwnProperty(airport)) {
        const positions = this.times[airport];
        for (const position in positions) {
          if (positions.hasOwnProperty(position)) {
            const times = positions[position][date];

            const ordered = [];
            let emptys = [];
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
              emptys.push({start: o_s, end: o_e, name: null, rating: null, available: true});
            }
            for (let position in this.selectTimes) {
              this.selectTimes[position].times = emptys;
            }
            if (!this.airports.includes(airport)) {
              this.airports.push(airport);
            }
            this.outputTimes.push({airport: airport, position: position, times: ordered});
          }
        }
      }
    }

    this.filteredTimes = this.outputTimes;
  }

  getEndTime(date: Date) {
    if (date.toDateString() === this.end.toDateString()) {
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

  getUTCNumTime(date: Date) {
    const minutes = date.getUTCMinutes();
    const hours = date.getUTCHours();

    return minutes + (hours * 60);
  }

  getOutTime(time: number) {
    const minutes = time % 60;
    const hours = Math.floor(time / 60);

    return (hours * 100) + minutes;
  }

  doTimesContain(times: Array<Time> , start: number, end: number) : Time {
    if (typeof times === 'undefined') { times = []; }
    for (const time of times) {
      const starts = time.start.toString().split(':');
      const ends = time.end.toString().split(':');

      const s = this.getNumTime(new Date(Date.UTC(0, 0, 0, parseInt(starts[0]), parseInt(starts[1]), parseInt(starts[2]))));
      const e = this.getNumTime(new Date(Date.UTC(0, 0, 0, parseInt(ends[0]), parseInt(ends[1]), parseInt(ends[2]))));

      time.start = isNaN(s) ? parseInt(starts[0]) : this.getOutTime(s);
      time.end = isNaN(e) ? parseInt(ends[0]) : this.getOutTime(e);

      if (end > time.start && end <= time.end)  {
        time.available = false;
        return time;
      }
    }

    return {start: start, end: end, name: null, rating: null, available: true};
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

  formatTime(time: number) : string {
    let ret_t = time.toString();
    while (ret_t.length < 4) {
      ret_t = '0' + ret_t;
    }
    return ret_t;
  }

  formatDate(date: string) {
    const dDate = new Date(date);
    let day = '' + dDate.getDate(),
      month = '' + (dDate.getMonth() + 1);
    const year = dDate.getFullYear();
    if (day.length < 2) { day = '0' + day; }
    if (month.length < 2) { month = '0' + month; }

    return [day, month, year].join('/');
  }

  formatDateISO(date: string) {
    const dDate = new Date(date);

    const year = dDate.getFullYear();
    const month = dDate.getMonth() + 1;
    const day = dDate.getDate();

    return year + '-' + (month.toString().length === 1 ? '0' + month : month) + '-' + (day.toString().length === 1 ? '0' + day : day).toString().substr(0, 10);
  }

  getDates(startDate, stopDate) : Date[] {
    const dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      const formattedDate = this.formatDateISO(currentDate);
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

  submitATC() {
    if (this.timesAreSelected()) {
      let outTimes: {
          [date: string]: {
            [position: string]: Array<string>
        }
      } = {};

      for (let date in this.selectedTimes) {
        if (this.selectedTimes.hasOwnProperty(date)) {
          let outDate = date;
          for (let position in this.selectedTimes[date]) {
            if (this.selectedTimes[date].hasOwnProperty(position)) {
              let t = this.selectedTimes[date][position];
              for (let tt in t) {
                if (t.hasOwnProperty(tt)) {
                  let time = t[tt];
                  let d = new Date(parseInt(date.substr(0, 4)),
                    parseInt(date.substr(5, 2))-1,
                    parseInt(date.substr(8, 2)), parseInt(this.formatTime(time).substr(0, 2)), parseInt(this.formatTime(time).substr(2, 2)));

                  outDate = d.toISOString().substr(0, 10);

                  if (!outTimes[outDate]) {
                    outTimes[outDate] = {};
                  }
                  if (!outTimes[outDate][position]) {
                    outTimes[outDate][position] = [];
                  }

                  outTimes[outDate][position].push(d.toISOString().substr(11, 8));
                }
              }
            }
          }
        }
      }

      this.eventService.submitATC(this.activeRoute.snapshot.paramMap.get('sku'), this.event_id, outTimes, this.hiddenCheckbox ? 1 : 0).subscribe((data) => {
        if (data['request'] && data['request']['code'] === 403) {
          window.location.reload(false);
        }

        if (typeof data['request'] !== 'undefined' && data['request']['result'] === 'success') {
          this.buttonDisabled = true;
          this.buttonTxt = 'Application Submitted';
        }
      });
    }
  }


}
