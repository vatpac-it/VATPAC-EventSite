import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {WINDOW} from '../window.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {

  scrolled = false;

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window: Window) { }

  ngOnInit() {
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollNum = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    this.scrolled = scrollNum > 400;
  }

  menuIconClick() {
    // TODO: Fix scroll to top when shows menu
    if (this.document.querySelector('.navbar').classList.contains('visible')) {
      this.document.querySelector('.navbar').classList.remove('visible');
    } else {
      this.document.querySelector('.navbar').classList.add('visible');
    }
  }

  @HostListener('body:click', ['$event.target'])
  bodyClick(el: any) {
    const visible = this.document.getElementById('menu-icon').offsetWidth > 0 || this.document.getElementById('menu-icon').offsetHeight > 0;
    if (el === this.document.getElementById('menu-icon') || !visible) { return; }
    this.document.querySelector('.navbar').classList.remove('visible');
  }
}
