import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {Router} from '@angular/router';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {PageNotFoundComponent} from './not-found.component';
import {LoginModule} from "./user-man/user-man.module";
import {FrontPageModule} from "./front-page/front-page.module";
import {AuthService} from "./services/auth.service";


@NgModule({
  imports: [
    BrowserModule, FormsModule, BrowserAnimationsModule, LoginModule,
    AppRoutingModule, FrontPageModule
  ],
  declarations: [
    AppComponent, PageNotFoundComponent
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
  // Diagnostic only: inspect router configuration
  constructor(router: Router) {
    console.log('Routes: ', JSON.stringify(router.config, undefined, 2));
  }
}
