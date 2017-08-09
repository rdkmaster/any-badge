import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {JigsawButtonModule, JigsawCheckBoxModule, JigsawInputModule} from "@rdkmaster/jigsaw";
import {LoginRoutingModule} from "./login-routing.module";
import {LoginComponent} from "./login.component";
import {SignUpComponent} from "./sign-up.component";

@NgModule({
  imports: [CommonModule, HttpClientModule, LoginRoutingModule, JigsawInputModule, JigsawButtonModule, JigsawCheckBoxModule],
  declarations: [LoginComponent, SignUpComponent],
  providers: [HttpClient]
})
export class LoginModule {
}
