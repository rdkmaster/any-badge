import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GettingStartedComponent} from "./getting-started.component";
import {FeaturesComponent} from "./about.component";


const routes: Routes = [
  {path: 'getting-started', component: GettingStartedComponent},
  {path: 'about', component: FeaturesComponent},
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
