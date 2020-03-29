import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CoreResponse} from '../models/CoreResponse';
import {environment} from '../../environments/environment';

const url = environment.url;

@Injectable({
    providedIn: 'root'
})
export class EventService {

    constructor(private http: HttpClient) {
    }

    public getEvents(): Observable<CoreResponse> {
        return this.http.get<CoreResponse>(`${url}/events`);
    }

    public getPastMinEvents(): Observable<CoreResponse> {
        return this.http.get<CoreResponse>(`${url}/events/past/min`);
    }

    public getMinEvents(): Observable<CoreResponse> {
        return this.http.get<CoreResponse>(`${url}/events/min`);
    }

    public getEvent(event_sku): Observable<CoreResponse> {
        return this.http.get<CoreResponse>(`${url}/events/${event_sku}`);
    }

    public submitATC(event_sku, positions, privacy_level) {
        return this.http.post<CoreResponse>(`${url}/events/${event_sku}/submitATC`, {
            positions: JSON.stringify(positions),
            'privacy_level': privacy_level
        });
    }

}
