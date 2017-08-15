import {Component} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Component({
  template: `
    <p style="font-size: 14px; padding: 12px;">
      Hi <b>{{authService.loggedInUser}}</b>, welcome to Jigsaw Any Badge home page.
      You can check out your <a routerLink="/badges">badges</a> now.
    </p>
  `
})
export class FrontPageComponent {
  constructor(public authService: AuthService) {
  }
}
