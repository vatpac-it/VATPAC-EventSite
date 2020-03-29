import {SafeUrl} from "@angular/platform-browser";

export class Event {
  _id: string;
  sku: string;
  title: string;
  subtitle: string;
  shiftLength: number;
  start: Date | string;
  end: Date | string;
  published: number | string;
  backgroundImage: string;
  sections: {_id?: number, title: string, content: string, files: {_id: number | string, name: string, file?: SafeUrl}[]}[];
  airports: {airport: {_id: string, icao: string}, kind: string}[];
  available: string[];
  positions: {user: {_id: string, cid: string, first_name: string, last_name: string, atc_rating: string}, airport: {_id: string, icao: string}, position: string, date: Date, hidden: boolean}[];
  selected: {date: Date, positions: string[], private: boolean}[];
  applications: {user: {cid: string, first_name: string, last_name: string}, positions: string[], date: Date, private: boolean}[];

  constructor() {
    this.sku = '';
    this.title = '';
    this.subtitle = '';
    this.shiftLength = 60;
    this.start = new Date(Date.now());
    this.end = new Date(Date.now() + 259200000);
    this.sections = [];
    this.published = 0;
    this.backgroundImage = '';
    this.airports = [];
    this.available = [];
    this.positions = [];
    this.selected = [];
    this.applications = [];
  }
}
