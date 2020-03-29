import {Component, Inject, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {WINDOW} from '../../window.service';

@Component({
  selector: 'app-pilot-info',
  templateUrl: './pilot-info.component.html',
  styleUrls: ['./pilot-info.component.css']
})
export class PilotInfoComponent implements OnInit {

  @Input() data;
  viewerURL: string;
  frameVisible = false;

  constructor(private sanatiser: DomSanitizer, @Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window: Window) { }

  ngOnInit() {
    this.viewerURL = this.data.airports[0].chart;

    // const $this = this;
    // this.document.querySelector('.charts--container .chart--slider .chart--wrapper iframe').addEventListener('load', function() {
    //   $this.frameVisible = true;
    //   if (window.frames['chartFrame'] && !window['userSet']) {
    //     window['userSet'] = true;
    //     console.log(this);
    //     this.location.href = 'http://docs.google.com/gview?url=' + $this.viewerURL + '&embedded=true';
    //   }
    // });
  }

  setURL(url: string) {
    this.frameVisible = false;
    this.viewerURL = url;
  }

  safeURL() {
    return this.sanatiser.bypassSecurityTrustResourceUrl('http://docs.google.com/gview?url=' + this.viewerURL + '&embedded=true');
  }

}
