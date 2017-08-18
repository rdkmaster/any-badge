import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GettingStartedComponent} from "./getting-started.component";
import {FeaturesComponent} from "./features.component";


const routes: Routes = [
  {path: 'getting-started', component: GettingStartedComponent},
  {path: 'features', component: FeaturesComponent},
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
