import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router,
  RouterStateSnapshot
} from '@angular/router';
import {Observable} from "rxjs/Observable";
import {AuthService} from './auth.service';

@Injectable()
export class BadgeAuthGuard implements CanLoad, CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canLoad(null);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canLoad(null);
  }

  canLoad(route: Route): boolean {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }
    return this.authService.isLoggedIn;
  }
}
