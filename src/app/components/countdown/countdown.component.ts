import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {

  @Input() date: Date;
  timeLeft = 0;

  constructor() { }

  ngOnInit() {
    if (typeof this.date !== 'undefined' && this.date instanceof Date) {
      const now = new Date();
      this.timeLeft = (this.date.getTime() - now.getTime()) / 1000;
      if (this.timeLeft < 0) this.timeLeft = 0;
      let this$ = this;
      setInterval(function () {
        this$.timeLeft--;
      }, 1000);
    }
  }

  get days() { const t = Math.floor(this.timeLeft / 86400); return t < 10 ? '0' + t : t; }
  get hours() { const t = Math.floor((this.timeLeft % 86400) / 3600); return t < 10 ? '0' + t : t; }
  get minutes() { const t = Math.floor((this.timeLeft % 86400 % 3600) / 60); return t < 10 ? '0' + t : t; }
  get seconds() { const t = Math.floor(this.timeLeft % 86400 % 3600 % 60); return t < 10 ? '0' + t : t; }


}
