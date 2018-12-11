import {Component, Input, OnInit} from '@angular/core';
import {Time} from '../Time';

@Component({
  selector: 'app-atc-timeline',
  templateUrl: './atc-timeline.component.html',
  styleUrls: ['./atc-timeline.component.css']
})
export class AtcTimelineComponent implements OnInit {

  @Input() times: Time[];
  @Input() position: string;

  colorClass: string;

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
    const slotNum = (slot.end - slot.start) % 100 === 0 ? ((slot.end - slot.start) / 100) : 1;
    return (slotNum * 160 + (slotNum - 1) * 80) + 'px';
  }

}
