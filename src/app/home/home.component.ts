import {Component, OnInit} from '@angular/core';
import {EventService} from '../services/event.service';
import {Event} from '../models/Event';
import {NavigationEnd, Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {CoreResponse} from '../models/CoreResponse';
import {AlertService} from '../services/alert.service';
import {UserService} from '../services/user.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    currentEvents: Event[] = [];
    pastEvents: Event[];
    showingPastEvents = false;
    fetchedPastEvents = false;

    constructor(private eventService: EventService, private userService: UserService, private titleService: Title, private router: Router, private alertService: AlertService) {

        this.router.events.subscribe(revent => {
            if (revent instanceof NavigationEnd) {
                this.titleService.setTitle('VATPAC Events');
            }
        });

        userService.currentUser.subscribe(u => {
            eventService.getMinEvents().subscribe((res) => {
                res = new CoreResponse(res);
                if (!res.success()) {
                    alertService.add('danger', 'Error getting currentEvents');
                    return;
                }

                this.currentEvents = (res.body.events as Event[]).map((event) => {
                    event.start = (typeof event.start === 'string' ? new Date(event.start) : event.start).toLocaleDateString('en-AU');
                    return event;
                });
            });
        });
    }

    ngOnInit() {
    }

    get events() {
        return this.currentEvents.concat(this.showingPastEvents ? this.pastEvents : []);
    }

    togglePastEvents() {
        if (!this.fetchedPastEvents) {
            this.eventService.getPastMinEvents().subscribe((res) => {
                res = new CoreResponse(res);
                if (!res.success()) {
                    this.alertService.add('danger', 'Error getting currentEvents');
                    return;
                }

                this.pastEvents = (res.body.events as Event[]).map((event) => {
                    event.start = (typeof event.start === 'string' ? new Date(event.start) : event.start).toLocaleDateString('en-AU');
                    return event;
                });
                this.fetchedPastEvents = true;
            });
        }

        this.showingPastEvents = !this.showingPastEvents;
    }

}
