import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Router} from "@angular/router";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import {HttpResult} from "../utils/typings";
import {CookieUtils} from "../utils/utils";

export type AccountInfo = {
  password?: string, newPassword?: string, description?: string, changePrivateKey?: boolean
}

@Injectable()
export class AuthService {
  constructor(private _http: HttpClient, private _router: Router) {
  }

  public isLoggedIn = false;
  public nickName: string = 'unknown user';
  public privateKey:string = 'invalid private key';
  public description:string = '';
  public password:string = '';

  private _promise: Promise<boolean>;

  public checkLoginStatus(): Promise<boolean> | boolean {
    let p = new Promise<boolean>((resolve, reject) => {
      resolve(true);
      reject({});
    });
    if (this.isLoggedIn) {
      return true;
    }
    if (!this._promise) {
      this._promise = new Promise<boolean>(resolve => {
        this._http.get<HttpResult>('/rdk/service/app/any-badge/server/user/login')
          .subscribe(result => {
            this.isLoggedIn = result.error == 0;
            this.nickName = this.isLoggedIn ? result.detail.nickName : 'unknown user';
            this.privateKey = this.isLoggedIn ? result.detail.privateKey : 'unknown private key';
            this.description = this.isLoggedIn ? result.detail.description : '';
            resolve(this.isLoggedIn);
          });
      });
    }
    return this._promise;
  }

  public login(name: string, password: string): Observable<string> {
    const url = '/rdk/service/app/any-badge/server/user/login';
    return this._http.post(url, {name: name, password: password}).map((result: HttpResult) => {
      this.isLoggedIn = result.error == 0;

      if (this.isLoggedIn) {
        CookieUtils.put('session', result.detail.session);
        this.nickName = result.detail.nickName;
        this.privateKey = result.detail.privateKey;
        this.description = result.detail.description;
        //save the password for further usage.
        this.password = password;
      }

      return !this.isLoggedIn ? result.detail : '';
    });
  }

  public logout(): void {
    const url = '/rdk/service/app/any-badge/server/user/logout';
    this._http.post<HttpResult>(url, {})
      .subscribe(result => {
        CookieUtils.del('session');
        this.nickName = 'unknown user';
        if (result.error > 0) {
          console.error(result);
        }
      });
    this.isLoggedIn = false;

    this._router.navigate(['/']);
  }

  public signUp(user: string, password: string, nick: string = '', description: string = ''): Observable<string> {
    if (!nick) {
      nick = user;
    }

    const url = '/rdk/service/app/any-badge/server/user/register';
    const param: any = {
      name: user, password: password, nickName: nick, description: description
    };
    return this._http.post<HttpResult>(url, param).map(result => result.error > 0 ? result.detail : '');
  }

  public changeAccountInfo(info: AccountInfo): Observable<HttpResult> {
    return this._http.post<HttpResult>('/rdk/service/app/any-badge/server/user/account-man', info);
  }

  public deleteAccount(password:string) : Observable<HttpResult> {
    const p:HttpParams = new HttpParams();
    p.set('password', password);
    return this._http.delete<HttpResult>('/rdk/service/app/any-badge/server/user/account-man', {params: p});
  }
}
