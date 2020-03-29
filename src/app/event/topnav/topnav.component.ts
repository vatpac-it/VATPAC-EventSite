import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {WINDOW} from '../../window.service';
import {UserService} from '../../services/user.service';
import {ActivatedRoute} from '@angular/router';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
    selector: 'app-topnav',
    templateUrl: './topnav.component.html',
    styleUrls: ['./topnav.component.css'],
    animations: [
        trigger('collapse', [
            state('open', style({
                opacity: '1'
            })),
            state('closed', style({
                opacity: '0',
            })),
            transition('closed => open', animate('400ms ease-in')),
            transition('open => closed', animate('100ms ease-out'))
        ])
    ]
})
export class TopnavComponent implements OnInit {

    navToggled = false;
    _isNavbarCollapsedAnim = 'closed';

    scrolled = false;
    name: string;

    constructor(@Inject(DOCUMENT) private document: Document, @Inject(WINDOW) private window: Window, private userService: UserService, private activeRoute: ActivatedRoute) {
    }

    ngOnInit() {
        this.userService.currentUser.subscribe((user) => {
            if (user) {
                this.name = user.first_name + ' ' + user.last_name;
            }
        });

        this.onResize(window);
    }

    @HostListener('window:resize', ['$event.target'])
    onResize(event) {
        if (event.innerWidth > 767) {
            this._isNavbarCollapsedAnim = 'open';
            this.navToggled = false;
        }
    }

    toggleNavbar() {
        if (this.navToggled) {
            this._isNavbarCollapsedAnim = 'closed';
            this.navToggled = false;
        } else {
            this._isNavbarCollapsedAnim = 'open';
            this.navToggled = true;
        }
    }

    get isNavbarCollapsedAnim(): string {
        return this._isNavbarCollapsedAnim;
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const scrollNum = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
        this.scrolled = scrollNum > 400;
    }

    loggedIn() {
        return this.userService.loggedIn();
    }

    login() {
        this.userService.login(this.activeRoute.snapshot.paramMap.get('sku'));
    }

    logout() {
        this.userService.logout();
    }
}
