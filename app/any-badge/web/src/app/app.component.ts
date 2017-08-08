import {Component, Renderer2, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'jigsaw-any-badge',
  template: `
    <div class="title">
      <h1 class="logo">Jigsaw Any Badge</h1>
      <span class="link">
        <a routerLink="/login" routerLinkActive="active">Login</a>
        <a routerLink="/sign-up" routerLinkActive="active">Sign Up</a>
      </span>
    </div>
    <hr class="title-separator">
    <router-outlet></router-outlet>
  `,
  styles: [
      `
      .title {
      }

      .logo {
        display: inline-block;
      }
      
      .link {
        float: right;
        padding-top: 12px;
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
    `
  ]
})
export class AppComponent {
  constructor(public viewContainerRef: ViewContainerRef, public renderer: Renderer2) {
  }
}



