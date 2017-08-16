import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BadgeAuthGuard} from '../services/auth-guard.service';
import {AuthService} from '../services/auth.service';
import {LoginComponent} from './login.component';
import {SignUpComponent} from "./sign-up.component";

const loginRoutes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    BadgeAuthGuard,
    AuthService
  ]
})
export class LoginRoutingModule {
}