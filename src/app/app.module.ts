import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TopnavComponent } from './topnav/topnav.component';
import { AboutComponent } from './about/about.component';
import { PilotInfoComponent } from './pilot-info/pilot-info.component';
import { ReserveATCComponent } from './reserve-atc/reserve-atc.component';
import { AirportLineComponent } from './reserve-atc/airport-line/airport-line.component';
import { AtcTimelineComponent } from './reserve-atc/atc-timeline/atc-timeline.component';
import {WINDOW_PROVIDERS} from './window.service';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';

@NgModule({
  declarations: [
    AppComponent,
    TopnavComponent,
    AboutComponent,
    PilotInfoComponent,
    ReserveATCComponent,
    AirportLineComponent,
    AtcTimelineComponent
  ],
  imports: [
    BrowserModule,
    ScrollToModule.forRoot()
  ],
  providers: [WINDOW_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule { }
