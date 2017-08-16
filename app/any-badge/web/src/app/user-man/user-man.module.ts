import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {JigsawButtonModule, JigsawCheckBoxModule, JigsawInputModule} from "@rdkmaster/jigsaw";
import {LoginRoutingModule} from "./user-man-routing.module";
import {LoginComponent} from "./login.component";
import {SignUpComponent} from "./sign-up.component";
import {AuthService} from "../services/auth.service";
import {AccountComponent} from "./account.component";

@NgModule({
  imports: [CommonModule, HttpClientModule, LoginRoutingModule, FormsModule,
    JigsawInputModule, JigsawButtonModule, JigsawCheckBoxModule],
  declarations: [LoginComponent, SignUpComponent, AccountComponent],
  providers: [HttpClient, AuthService]
})
export class LoginModule {
}
