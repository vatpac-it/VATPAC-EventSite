export class Event {
  id: number;
  sku: string;
  title: string;
  subTitle: string;
  shiftLength: number;
  start: string | Date;
  end: string | Date;
  published: number;
  sections: {title: string, content: string}[];
  airports: {icao: string, type: number}[];
  positions: {[icao: string]: {[position: string]: {[date: string]: {name: string, rating: string, start: number, end: number}}}};
  selected: {[date: string]: {[time: string]: {airport: string, position: string}}};
}
