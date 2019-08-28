import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  @Input() title: string;
  @Input() line1: string;
  @Input() line2: string;
  @Input() icon: string;

  constructor() { }

  ngOnInit() {
  }

}
