import { Component, OnInit } from '@angular/core';
import {EventService} from '../services/event.service';
import {Event} from '../models/Event';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  events: Event[];

  constructor(private eventService: EventService, private titleService: Title, private router: Router) {

    this.router.events.subscribe(revent => {
      if (revent instanceof NavigationEnd) {
        this.titleService.setTitle('VATPAC Events');
      }
    });

    eventService.getMinEvents().subscribe((data) => {
      this.events = data.map((event) => {
        event.start = (typeof event.start === 'string' ? new Date(event.start) : event.start).toLocaleDateString('en-AU');
        return event;
      });
    });
  }

  ngOnInit() {
  }

}
