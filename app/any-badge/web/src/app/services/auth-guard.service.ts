import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this._checkLoginStatus();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
    return this._checkLoginStatus();
  }

  canLoad(route: Route): Promise<boolean> | boolean {
    return this._checkLoginStatus();
  }

  private _checkLoginStatus() {
    const status = this.authService.checkLoginStatus();
    if (status instanceof Promise) {
      status.then(() => this._redirect('/login'))
    } else {
      this._redirect('/login');
    }
    return status;
  }

  private _redirect(redirectTo:string = '/login') {
    if (!this.authService.isLoggedIn) {
      this.router.navigate([redirectTo]);
    }
  }
}
