import {Component, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'jigsaw-any-badge',
  template: `
    <div class="title">
      <h1 class="logo"><a routerLink="/">Jigsaw Any Badge</a></h1>
      <p>Put any badges to your github project.</p>
      <span class="link">
        <a *ngIf="!authService.isLoggedIn" routerLink="/login" routerLinkActive="active">Login</a>
        <a *ngIf="!authService.isLoggedIn" routerLink="/sign-up" routerLinkActive="active">Sign Up</a>
        <a *ngIf="authService.isLoggedIn" (click)="logout()">Logout</a>
      </span>
    </div>
    <hr class="title-separator">
    <router-outlet></router-outlet>
  `,
  styles: [`
    .title {
      height: 54px;
      margin: 6px;
    }

    .logo {
      display: inline-block;
    }

    .link {
      float: right;
      margin-top: -44px;
    }
    
    .title-separator {
      margin-bottom: 12px;
      color: #000;
    }

    h1 {
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 30px;
    }

    a {
      color: #fff;
      text-decoration: none;
    }
    p {
      color: #fff;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService, private _router: Router,
              public viewContainerRef: ViewContainerRef, public renderer: Renderer2) {
  }

  public logout() {
    this.authService.logout();
    this._router.navigate(['']);
  }

  ngOnInit() {
    const result = this.authService.checkLoginStatus();
    if (result instanceof Observable) {
      result.subscribe();
    }
  }
}



