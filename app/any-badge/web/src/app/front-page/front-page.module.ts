import {NgModule} from "@angular/core";
import {FrontPageComponent} from "./front-page.component";
import {AuthService} from "../services/auth.service";

@NgModule({
  declarations: [FrontPageComponent],
  providers: [AuthService]
})
export class FrontPageModule {
}
