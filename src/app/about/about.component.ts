import {Component, Input, OnInit} from '@angular/core';
import { About_Item } from "./About_Item";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  @Input() item: About_Item;

  constructor() { }

  ngOnInit() {
  }

}
