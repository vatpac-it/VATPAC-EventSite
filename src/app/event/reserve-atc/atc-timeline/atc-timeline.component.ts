import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Time} from '../Time';

@Component({
  selector: 'app-atc-timeline',
  templateUrl: './atc-timeline.component.html',
  styleUrls: ['./atc-timeline.component.css']
})
export class AtcTimelineComponent implements OnInit {

  @Input() readonly shifts: number;

  @Input() time: {position: string, times: Time[]};

  @Input() selectable: boolean = false;

  colorClass: string;

  @Input() selectedTimes: number[] = [];
  @Output() selectTimesEvent: EventEmitter<number[]> = new EventEmitter<number[]>();

  constructor() {
    this.colorClass = '';
  }

  ngOnInit() {
    switch (this.time.position.slice(-3)) {
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
    if (this.time.position.includes('CTR')) {
      this.colorClass = 'green';
    }
  }

  getWidth(slot) {
    const s = AtcTimelineComponent.getNumTime(slot.start);
    const e = AtcTimelineComponent.getNumTime(slot.end);

    const slotNum = (e - s) % this.shifts === 0 ? ((e - s) / this.shifts) : 1;
    return (slotNum * 190 + (slotNum - 1) * 80) + 'px';
  }

  static getNumTime(time: number) {
    const minutes = parseInt(time.toString().slice(-2));
    const hours = (time - minutes) / 100;

    return minutes + (hours * 60);
  }

  selectTime(slot) {
    if (slot.name == null && slot.rating == null && this.selectable) {
      if (this.slotIsSelected(slot)) {
        const i = this.selectedTimes.indexOf(slot.start);
        if (i > -1) this.selectedTimes.splice(i, 1);
      } else {
        this.selectedTimes.push(slot.start);
      }
      this.selectTimesEvent.emit(this.selectedTimes);
    }
  }

  slotIsSelected(slot) {
    return this.selectedTimes.indexOf(slot.start) !== -1;
  }

}
