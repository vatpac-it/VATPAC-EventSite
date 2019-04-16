import {Component, Input, OnInit} from '@angular/core';
import { AboutItem } from './AboutItem';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  @Input() item: AboutItem;

  constructor() { }

  ngOnInit() {
  }

}
