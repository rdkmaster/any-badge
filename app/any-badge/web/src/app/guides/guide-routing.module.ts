import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GettingStartedComponent} from "./getting-started.component";
import {AboutComponent} from "./about.component";


const routes: Routes = [
  {path: 'getting-started', component: GettingStartedComponent},
  {path: 'about', component: AboutComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class GuideRoutingModule {
}
