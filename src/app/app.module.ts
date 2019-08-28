import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TopnavComponent } from './event/topnav/topnav.component';
import { AboutComponent } from './event/about/about.component';
import { PilotInfoComponent } from './event/pilot-info/pilot-info.component';
import { ReserveATCComponent } from './event/reserve-atc/reserve-atc.component';
import { AirportLineComponent } from './event/reserve-atc/airport-line/airport-line.component';
import { AtcTimelineComponent } from './event/reserve-atc/atc-timeline/atc-timeline.component';
import {WINDOW_PROVIDERS} from './window.service';
import {ScrollToModule} from '@nicky-lenaers/ngx-scroll-to';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import { EventComponent } from './event/event.component';
import { HomeComponent } from './home/home.component';
import { CountdownComponent } from './components/countdown/countdown.component';

import {AppRoutingModule} from './app-routing.module';
import {httpInterceptor} from "./interceptors/http-interceptor.service";
import {AlertService} from "./services/alert.service";
import {AlertComponent} from "./components/alert/alert.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import './helpers/date-prototypes';

import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faClock, faPlane, faPlaneArrival, faPlaneDeparture} from "@fortawesome/free-solid-svg-icons";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    TopnavComponent,
    AboutComponent,
    PilotInfoComponent,
    ReserveATCComponent,
    AirportLineComponent,
    AtcTimelineComponent,
    EventComponent,
    HomeComponent,
    CountdownComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }),
    NgbModule,
    BrowserAnimationsModule,
    ScrollToModule.forRoot(),
    FontAwesomeModule,
    AppRoutingModule
  ],
  providers: [
    AlertService,
    { provide: HTTP_INTERCEPTORS, useClass: httpInterceptor, multi: true },
    WINDOW_PROVIDERS],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(faClock, faPlane, faPlaneArrival, faPlaneDeparture);
  }
}
