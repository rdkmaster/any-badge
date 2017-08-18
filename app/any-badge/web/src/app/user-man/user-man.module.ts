import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {
  JigsawButtonModule, JigsawCheckBoxModule, JigsawDialogModule, JigsawInputModule,
  JigsawTooltipModule, PopupService, JigsawScrollBarModule
} from "@rdkmaster/jigsaw";
import {LoginRoutingModule} from "./user-man-routing.module";
import {LoginComponent} from "./login.component";
import {SignUpComponent} from "./sign-up.component";
import {AuthService} from "../services/auth.service";
import {AccountComponent, ConfirmDialog} from "./account.component";

@NgModule({
  imports: [
    CommonModule, HttpModule, LoginRoutingModule, FormsModule,
    JigsawInputModule, JigsawButtonModule, JigsawCheckBoxModule, JigsawTooltipModule,
    JigsawDialogModule, JigsawScrollBarModule
  ],
  declarations: [LoginComponent, SignUpComponent, AccountComponent, ConfirmDialog],
  providers: [AuthService, PopupService],
  entryComponents: [ConfirmDialog]
})
export class LoginModule {
}
