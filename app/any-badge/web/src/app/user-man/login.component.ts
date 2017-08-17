import {Component} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {UserManBase, UserManInfo} from "./user-man-base";
import {CookieUtils} from "../utils/utils";

@Component({
  templateUrl: './user-man.component.html'
})
export class LoginComponent extends UserManBase {
  constructor(public authService: AuthService, public router: Router) {
    super(authService);
    this.viewType = 'login';
    this.remember = CookieUtils.get('remember') !== '0';
  }

  action(loginInfo: UserManInfo) {
    if (this.remember) {
      CookieUtils.put('user', loginInfo.userName);
    } else {
      CookieUtils.del('user');
    }

    this.waitingForBadge = true;

    this.authService.login(loginInfo.userName, loginInfo.password).subscribe((errorMessage:string) => {
      this.errorMessage = errorMessage;
      if (this.authService.isLoggedIn) {
        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };
        // Redirect the user
        this.router.navigate(['/badges'], navigationExtras);
      }
    });
  }

  navigate2SignUp() {
    let navigationExtras: NavigationExtras = {
      queryParamsHandling: 'preserve',
      preserveFragment: true
    };
    // Redirect the user
    this.router.navigate([this.authService.isLoggedIn ? '/badges' : '/sign-up'], navigationExtras);
  }

  clearUserFromCookie(checked: boolean) {
    if (!checked) {
      CookieUtils.del('user');
    }
    CookieUtils.put('remember', checked);
  }
}
