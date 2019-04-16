import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/User';

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

    this.http.get<User>(url + '/sso/user')
      .subscribe((res) => {
        if (!res || res['request']['result'] === 'failed') {
          this.logout();
          return;
        }

        if (res['request']['result'] === 'success' && res['body']['user']) {
          localStorage.setItem('current_user', JSON.stringify(res['body']['user']));
          this.currentUserSubject.next(res['body']['user']);
        }
      });
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public login(event) {
    const callback = 'https://events.vatpac.org/' + event;
    window.location.href = url + '/sso?callback=' + encodeURIComponent(callback);
  }

  public logout() {
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);

    return this.http.get(`${url}/sso/logout`).subscribe((res) => {
      console.log('Logged out successfully');
    });
  }

  public loggedIn() {
    return this.currentUserValue !== null;
  }
}
