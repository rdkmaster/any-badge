import {Component, Renderer2, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'jigsaw-any-badge',
  template: `
    <h1 class="title">Jigsaw Any Badge</h1>
    <nav>
      <a routerLink="/badges" routerLinkActive="active">Badges</a>
      <a routerLink="/admin" routerLinkActive="active">Admin</a>
      <a routerLink="/login" routerLinkActive="active">Login</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(public viewContainerRef: ViewContainerRef, public renderer: Renderer2) {
  }
}



