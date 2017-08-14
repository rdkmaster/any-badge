import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import {HttpResult} from "../utils/typings";
import {CookieUtils} from "../utils/utils";


@Injectable()
export class AuthService {
  constructor(private _http: HttpClient) {
  }

  public isLoggedIn = false;
  // public errorMessage = '';

  // store the URL so we can redirect after logging in
  public redirectUrl: string;

  public login(name: string, password: string): Observable<string> {
    const url = '/rdk/service/app/any-badge/server/user/login';
    return this._http.post(url, {name: name, password: password}).map((result: HttpResult) => {
      this.isLoggedIn = result.error == 0;

      if (this.isLoggedIn) {
        CookieUtils.put('session', result.detail);
      }

      return !this.isLoggedIn ? result.detail : '';
    });
  }

  public logout(): void {
    const url = '/rdk/service/app/any-badge/server/user/logout';
    this._http.post(url, {}).subscribe((result: HttpResult) => {
      CookieUtils.del('session');
      this.isLoggedIn = result.error > 0;
      if (result.error > 0) {
        console.error(result);
      }
    });
  }

  public signUp(user: string, password: string, nick: string = '', description: string = ''): Observable<string> {
    if (!nick) {
      nick = user;
    }

    const url = '/rdk/service/app/any-badge/server/user/register';
    const param: any = {
      name: user, password: password, nickName: nick, description:description
    };
    return this._http.post(url, param).map((result: HttpResult) => result.error > 0 ? result.detail : '');
  }
}
