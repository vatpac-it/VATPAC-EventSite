import { Component, OnInit } from '@angular/core';
import {Event} from '../models/Event';
import {EventService} from '../services/event.service';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  data: Event;

  constructor(private eventService: EventService, private titleService: Title, private activeRoute: ActivatedRoute, private router: Router) {
    const event_sku = this.activeRoute.snapshot.paramMap.get('sku');

    this.eventService.getEvent(event_sku).subscribe((event) => {
      if (event === null) {
        window.location.pathname = '';
      }
      this.data = event;

      this.titleService.setTitle(event.title + ' | VATPAC Events');

      for (let i in this.data.sections) {
        this.data.sections[i].content = this.data.sections[i].content.replace(/\n/g, '<br />');
      }
      let start = this.data.start.toString();
      this.data.start = new Date(this.data.start.toString());
      this.data.end = new Date(this.data.end.toString());
    }, (err) => {
      this.router.navigateByUrl('');
    });
  }

  ngOnInit() {
  }

  formatDate(date: Date) {
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();

    return monthNames[monthIndex] + ' ' + day + this.nth(day);
  }

  nth(d) {
    if (d > 3 && d < 21) { return 'th'; }
    switch (d % 10) {
      case 1:  return 'st';
      case 2:  return 'nd';
      case 3:  return 'rd';
      default: return 'th';
    }
  }

  formatTime(date: Date) {
    const time = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});

    return time + ' (Browser Local)';
  }

}
