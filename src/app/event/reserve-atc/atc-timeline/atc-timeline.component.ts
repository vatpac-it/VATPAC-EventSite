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
  @Input() position: string;

  @Input() selectable: boolean = false;

  colorClass: string;

  @Input() selectedTimes: {
    [position: string]: Array<string>
  };
  @Output() selectTimesEvent: EventEmitter<{
    [position: string]: Array<string>
  }> = new EventEmitter<{[position: string]: Array<string>}>();

  constructor() {
    this.colorClass = '';
  }

  ngOnInit() {
    switch (this.position.slice(-3)) {
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
    if (this.position.includes('CTR')) {
      this.colorClass = 'green';
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
    if (slot.name == null && slot.rating == null && this.selectable) {
      if (this.slotInSelected(slot)) {
        const i = this.selectedTimes[this.position].indexOf(slot.start);
        if (i > -1) {
          this.selectedTimes[this.position].splice(i, 1);
        }
      } else {
        if (typeof this.selectedTimes[this.position] === 'undefined') {
          this.selectedTimes[this.position] = [];
        }
        this.selectedTimes[this.position].push(slot.start);
      }
      this.selectTimesEvent.emit(this.selectedTimes);
    }
  }

  slotInSelected(slot) {
    return typeof this.selectedTimes !== 'undefined' && typeof this.selectedTimes[this.position] !== 'undefined' && this.selectedTimes[this.position].indexOf(slot.start) > -1;
  }

}
