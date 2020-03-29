export interface Time {
  start: number;
  end: number;
  user?: string;
  name: string;
  rating: string;
  available: boolean;
}

export interface SelectedTimes {
  date: Date;
  position: string;
}
