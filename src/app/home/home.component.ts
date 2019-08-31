import { Component, OnInit } from '@angular/core';
import {EventService} from '../services/event.service';
import {Event} from '../models/Event';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Title} from "@angular/platform-browser";
import {CoreResponse} from "../models/CoreResponse";
import {AlertService} from "../services/alert.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  events: Event[];

  constructor(private eventService: EventService, private titleService: Title, private router: Router, private alertService: AlertService) {

    this.router.events.subscribe(revent => {
      if (revent instanceof NavigationEnd) this.titleService.setTitle('VATPAC Events');
    });

    eventService.getMinEvents().subscribe((res) => {
      res = new CoreResponse(res);
      if (!res.success()) {
        alertService.add('danger', 'Error getting events');
        return;
      }

      this.events = (res.body.events as Event[]).map((event) => {
        event.start = (typeof event.start === 'string' ? new Date(event.start) : event.start).toLocaleDateString('en-AU');
        return event;
      });
    });
  }

  ngOnInit() {
  }

}
