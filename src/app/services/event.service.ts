import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Event} from '../models/Event';
import {CoreResponse} from "../models/CoreResponse";

const url = 'https://core.vatpac.org';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  public getEvents(): Observable<CoreResponse> {
    return this.http.get<CoreResponse>(`${url}/events`, { withCredentials: true });
  }

  public getMinEvents(): Observable<CoreResponse> {
    return this.http.get<CoreResponse>(`${url}/events/min`, { withCredentials: true });
  }

  public getEvent(event_sku): Observable<CoreResponse> {
    return this.http.get<CoreResponse>(`${url}/events/${event_sku}`, { withCredentials: true });
  }

  public submitATC(event_sku, positions, privacy_level) {
    return this.http.post<CoreResponse>(`${url}/events/${event_sku}/submitATC`, {positions: JSON.stringify(positions), 'privacy_level': privacy_level});
  }

}
