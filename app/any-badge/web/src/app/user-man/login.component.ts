import {Component} from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {CookieUtils} from "../utils/utils";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public rememberMe: boolean = CookieUtils.get('remember') !== '0';
  public userName: string = CookieUtils.get('user');
  public userNameInvalid: boolean = false;

  public password: string = 'mypass';
  public errorMessage: string = '';

  constructor(public authService: AuthService, public router: Router) {
  }

  login() {
    this.authService.login(this.userName, this.password).subscribe(() => {
      this.errorMessage = this.authService.errorMessage;
      if (this.authService.isLoggedIn) {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/badges';

        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };

        // Redirect the user
        this.router.navigate([redirect], navigationExtras);

        if (this.rememberMe) {
          CookieUtils.put('user', this.userName);
        } else {
          CookieUtils.del('user');
        }
      }
    });
  }

  signUp() {
    alert('unsupported yet');
  }

  clearUserFromCookie(checked: boolean) {
    if (!checked) {
      CookieUtils.del('user');
    }
    CookieUtils.put('remember', checked);
  }

  checkUserName() {
    this.userNameInvalid = this.userName == '';
  }
}
