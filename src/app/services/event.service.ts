import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Event} from '../models/Event';

const url = 'https://core.vatpac.org';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  public getEvents(): Observable<Event[]> {
    return <Observable<Event[]>> this.http.get<Event[]>(`${url}/events`, { withCredentials: true });
  }

  public getMinEvents(): Observable<Event[]> {
    return <Observable<Event[]>> this.http.get<Event[]>(`${url}/events/min`, { withCredentials: true });
  }

  public getEvent(event_sku): Observable<Event> {
    return <Observable<Event>> this.http.get<Event>(`${url}/events/${event_sku}`, { withCredentials: true });
  }

  public submitATC(event_sku, event_id, positions, privacy_level) {
    return this.http.post(`${url}/events/${event_sku}/submitATC`, {'event_id': event_id, 'positions': JSON.stringify(positions), 'privacy_level': privacy_level});
  }

}
