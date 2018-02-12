import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import {HttpResult} from "../utils/typings";
import {CookieUtils} from "../utils/utils";

export type AccountInfo = {
  password?: string,
  newPassword?: string,
  nickName?: string,
  description?: string,
  changePrivateKey?: boolean
}

@Injectable()
export class AuthService {
  constructor(private _http: HttpClient, private _router: Router) {
  }

  public isLoggedIn = false;
  public nickName: string = 'unknown user';
  public privateKey:string = 'invalid private key';
  public description:string = '';

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
        this._http.get('/rdk/service/app/any-badge/server/login')
          .subscribe((result: any) => {
            this.isLoggedIn = result.error == 0;
            this.nickName = this.isLoggedIn ? result.detail.nickName : 'unknown user';
            this.privateKey = this.isLoggedIn ? result.detail.privateKey : 'unknown private key';
            this.description = this.isLoggedIn ? result.detail.description : '';
            resolve(this.isLoggedIn);
            this._promise = null;
          });
      });
    }
    return this._promise;
  }

  public login(name: string, password: string): Observable<string> {
    const url = '/rdk/service/app/any-badge/server/login';
    return this._http.post(url, {name: name, password: password})
      .map((result: HttpResult) => {
      this.isLoggedIn = result.error == 0;

      if (this.isLoggedIn) {
        CookieUtils.put('session', result.detail.session);
        this.nickName = result.detail.nickName;
        this.privateKey = result.detail.privateKey;
        this.description = result.detail.description;
      }

      return !this.isLoggedIn ? result.detail : '';
    });
  }

  public logout(): void {
    const url = '/rdk/service/app/any-badge/server/logout';
    this._http.post(url, {})
      .subscribe((result:any) => {
        CookieUtils.del('session');
        this.nickName = 'unknown user';
        if (result.error) {
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

    const url = '/rdk/service/app/any-badge/server/account';
    const param: any = {
      name: user, password: password, nickName: nick, description: description
    };
    return this._http.post(url, param).map((result: any) => result.error > 0 ? result.detail : '');
  }

  public changeAccountInfo(info: AccountInfo): Observable<any> {
    return this._http.put('/rdk/service/app/any-badge/server/account', info);
  }

  public deleteAccount(password:string) : Observable<any> {
    // let opt = <RequestOptionsArgs>{body: {password: password}};
    return this._http.delete('/rdk/service/app/any-badge/server/account', {params: {password: password}});
  }
}
