import {Component, Renderer2, ViewContainerRef} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'jigsaw-any-badge',
  template: `
    <div class="title">
      <h1 class="logo">Jigsaw Any Badge</h1>
      <p>Put any badge to your github project.</p>
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

    h1 {
      color: #369;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 30px;
    }

    /* Navigation link styles */
    a {
      padding: 5px 10px;
      text-decoration: none;
      margin-right: 10px;
      margin-top: 10px;
      display: inline-block;
      background-color: #eee;
      border-radius: 4px;
    }

    a:visited, a:link {
      color: #607D8B;
    }

    a:hover {
      color: #039be5;
      background-color: #CFD8DC;
    }

    a.active {
      color: #039be5;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private _router: Router,
              public viewContainerRef: ViewContainerRef, public renderer: Renderer2) {
  }

  public logout() {
    this.authService.logout();
    this._router.navigate(['']);
  }
}



