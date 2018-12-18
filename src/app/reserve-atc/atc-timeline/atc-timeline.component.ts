import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Time} from '../Time';

@Component({
  selector: 'app-atc-timeline',
  templateUrl: './atc-timeline.component.html',
  styleUrls: ['./atc-timeline.component.css']
})
export class AtcTimelineComponent implements OnInit {

  @Input() readonly shifts: number;

  @Input() times: Time[];
  @Input() airport: string;
  @Input() position: string;

  colorClass: string;

  @Input() selectedTimes: {
    [time: string]: {airport: string, position: string}
  };
  @Output() selectTimesEvent: EventEmitter<{
    [time: string]: {airport: string, position: string}
  }> = new EventEmitter<{[p: string]: {airport: string, position: string}}>();

  constructor() {
    this.colorClass = '';
  }

  ngOnInit() {
    switch (this.position) {
      case 'DEL':
        this.colorClass = 'dblue';
        break;
      case 'GND':
        this.colorClass = 'lblue';
        break;
      case 'TWR':
        this.colorClass = 'orange';
        break;
      case 'APP':
        this.colorClass = 'red';
        break;
      case 'DEP':
        this.colorClass = 'pink';
        break;
      case 'CTR':
        this.colorClass = 'green';
        break;
    }
  }

  getWidth(slot) {
    const s = this.getNumTime(slot.start);
    const e = this.getNumTime(slot.end);

    const slotNum = (e - s) % this.shifts === 0 ? ((e - s) / this.shifts) : 1;
    return (slotNum * 160 + (slotNum - 1) * 80) + 'px';
  }

  getNumTime(time: number) {
    const minutes = parseInt(time.toString().slice(-2));
    const hours = (time - minutes) / 100;

    return minutes + (hours * 60);
  }

  selectTime(slot) {
    if (slot.name == null && slot.rating == null) {
      if (this.slotInSelected(slot)) {
        delete this.selectedTimes[slot.start];
      } else {
        this.selectedTimes[slot.start] = {airport: this.airport, position: this.position};
      }
      this.selectTimesEvent.emit(this.selectedTimes);
    }
  }

  slotInSelected(slot) {
    return slot.start in this.selectedTimes &&
      this.selectedTimes[slot.start].airport === this.airport &&
      this.selectedTimes[slot.start].position === this.position;
  }

}
