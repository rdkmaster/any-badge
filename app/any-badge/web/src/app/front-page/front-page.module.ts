import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {JigsawButtonModule} from "@rdkmaster/jigsaw";
import {FrontPageComponent} from "./front-page.component";
import {AuthService} from "../services/auth.service";

@NgModule({
  imports: [RouterModule.forChild([]), JigsawButtonModule],
  declarations: [FrontPageComponent],
  providers: [AuthService]
})
export class FrontPageModule {
}
