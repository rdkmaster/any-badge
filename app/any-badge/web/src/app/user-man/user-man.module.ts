import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {
  JigsawButtonModule,
  JigsawCheckBoxModule,
  JigsawDialogModule,
  JigsawInputModule,
  JigsawLoadingModule,
  JigsawScrollbarModule,
  JigsawTooltipModule,
  LoadingService,
  PopupService
} from "@rdkmaster/jigsaw";
import {LoginRoutingModule} from "./user-man-routing.module";
import {LoginComponent} from "./login.component";
import {SignUpComponent} from "./sign-up.component";
import {AuthService} from "../services/auth.service";
import {AccountComponent, ConfirmDialog} from "./account.component";

@NgModule({
  imports: [
    CommonModule, HttpClientModule, LoginRoutingModule, FormsModule,
    JigsawInputModule, JigsawButtonModule, JigsawCheckBoxModule, JigsawTooltipModule,
    JigsawDialogModule, JigsawScrollbarModule, JigsawLoadingModule
  ],
  declarations: [LoginComponent, SignUpComponent, AccountComponent, ConfirmDialog],
  providers: [AuthService, PopupService, LoadingService],
  entryComponents: [ConfirmDialog]
})
export class LoginModule {
}
