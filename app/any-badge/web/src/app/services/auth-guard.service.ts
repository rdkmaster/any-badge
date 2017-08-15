import {Injectable} from '@angular/core';
import {CanLoad, Route, Router} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {AuthService} from './auth.service';

@Injectable()
export class BadgeAuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {
  }

  canLoad(route: Route): Observable<boolean> | boolean {
    const result = this.authService.checkLoginStatus();
    if (result instanceof Observable) {
      result.map(status => {
        this.router.navigate([this.authService.isLoggedIn ? '/badges' : '/login'], {});
        return status;
      });
    }
    return result;
  }
}
