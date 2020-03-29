import {Component, OnInit} from '@angular/core';
import {Event} from '../models/Event';
import {EventService} from '../services/event.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer, SafeUrl, Title} from '@angular/platform-browser';
import {CoreResponse} from '../models/CoreResponse';
import {AlertService} from '../services/alert.service';

@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

    event: Event;
    bgLocation: SafeUrl;
    currentDate = Date.now();

    constructor(private eventService: EventService, private alertService: AlertService, private titleService: Title, private activeRoute: ActivatedRoute, private router: Router, private _sanitizer: DomSanitizer) {
        const event_sku = this.activeRoute.snapshot.paramMap.get('sku');

        this.eventService.getEvent(event_sku).subscribe((res) => {
            res = new CoreResponse(res);
            if (!res.success()) {
                this.alertService.add('danger', 'Error getting Event.');
                return router.navigate(['/']);
            }

            const event = res.body.event as Event;

            this.event = event;

            this.titleService.setTitle(event.title + ' | VATPAC Events');

            this.event.sections = this.event.sections.map(s => {
                s.content.replace(/\n/g, '<br />');
                return s;
            });

            this.event.start = new Date(this.event.start.toString());
            this.event.end = new Date(this.event.end.toString());

            this.event.airports = this.event.airports.sort((a, b) => (a.kind === 'departing') ? -1 : (b.kind === 'departing' ? 1 : (a.kind === 'arriving' ? 1 : (b.kind === 'arriving' ? -1 : 0))));

            if (event.backgroundImage) {
                this.bgLocation = this._sanitizer.bypassSecurityTrustStyle(`url(https://core.vatpac.org/files/${event.backgroundImage})`);
            }

            const sel = [];
            this.event.selected.forEach(s => {
                s.positions.forEach(p => {
                    sel.push({date: s.date, position: p, private: s.private});
                });
            });
            this.event.selected = sel;
        }, (err) => {
            this.alertService.add('danger', 'Error getting Event.');
            return this.router.navigate(['/']);
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
        if (d > 3 && d < 21) {
            return 'th';
        }
        switch (d % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    }

    formatTime(date: Date) {
        const time = date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false});

        return time + ' <small class="text-muted">(' + Intl.DateTimeFormat().resolvedOptions().timeZone + ')</small>';
    }

    capitalize(s) {
        return s.replace(/\b./g, function (m) {
            return m.toUpperCase();
        });
    }

}
