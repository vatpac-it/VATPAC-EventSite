import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/User';
import {CoreResponse} from "../models/CoreResponse";
import {map} from "rxjs/operators";

const url = 'https://core.vatpac.org';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('current_user')));
    this.currentUser = this.currentUserSubject.asObservable();


    this.http.get<CoreResponse>(url + '/sso/user')
      .subscribe((res) => {
        res = new CoreResponse(res);
        if (!res.success() || !res.body || !res.body.user) {
          if (localStorage.getItem('current_user') !== null) {
            this.logout();
          }
          return;
        }

        let u = res.body.user;

        this.getPerms().subscribe(p => {
          u.perms = p;

          localStorage.setItem('current_user', JSON.stringify(u));
          this.currentUserSubject.next(u);
        });
      }, error1 => {
        if (localStorage.getItem('current_user') !== null) {
          this.logout();
        }
      });
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public getPerms() {
    return this.http.get<CoreResponse>(url + '/sso/user/perms')
      .pipe(map((res) => {
        res = new CoreResponse(res);
        if (!res.success()) {
          this.logout();
          return;
        }

        return res.body.perms;
      }));
  }

  public login(event?: string) {
    const callback = 'https://events.vatpac.org/' + event;
    window.location.href = url + '/sso?callback=' + encodeURIComponent(callback);
  }

  public logout() {
    this.logoutData((res) => {
      console.log('Logged out successfully');
      window.location.reload();
    });
  }

  public logoutData(cb) {
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);

    return this.http.get(`${url}/sso/logout`).subscribe(cb);
  }

  public loggedIn() {
    return this.currentUserValue !== null;
  }


  /***************************************
   * Perms
   * ---
   * Check if user has specific perm
   ***************************************/

  public hasEventAccess() {
    return this.currentUserValue !== null && this.currentUserValue.perms.filter(perm => perm.level === 3 && perm.perm.sku === 'EDIT_EVENTS').length > 0;
  }
}
