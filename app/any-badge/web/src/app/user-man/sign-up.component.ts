import {Component} from '@angular/core';
import {NavigationExtras, Router} from "@angular/router";
import {UserManBase, UserManInfo} from "./user-man-base";
import {AuthService} from "../services/auth.service";

@Component({
  templateUrl: './user-man.component.html'
})
export class SignUpComponent extends UserManBase {
  constructor(public authService: AuthService, public router: Router) {
    super(authService);
    this.viewType = 'sign-up';
  }

  public action(value: UserManInfo): void {
    if (value.password != value.confirm) {
      this.errorMessage = 'Password mismatch!';
      return;
    }
    this.waitingForBadge = true;
    this.authService.signUp(value.userName, value.password, value.nickName, value.description)
      .subscribe(msg => {
        this.errorMessage = msg;
        if (msg) {
          //sign up failed, leave the user in the registration view.
          return;
        }

        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };
        // Redirect the user
        this.router.navigate(['/login'], navigationExtras);
      });
  }
}
