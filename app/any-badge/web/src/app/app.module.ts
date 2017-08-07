import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {JigsawModule} from '@rdkmaster/jigsaw';

import {AppComponent} from './app.component';

const router = [
  {
    path: 'login',
    loadChildren: 'app/user-man/user-man.module#LoginComponent'
  },
  {
    path: 'sign-in',
    loadChildren: 'app/user-man/user-man.module#SignInComponent'
  },
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FormsModule, HttpModule, BrowserAnimationsModule,
    TranslateModule.forRoot(), RouterModule.forRoot(router), JigsawModule
  ],
  providers: [TranslateService],
  bootstrap: [AppComponent],
  entryComponents: []
})
export class AppModule {
  constructor(translateService: TranslateService) {
    translateService.setTranslation('zh', {
      'get-started': '马上开始',
      'give-star': '给 Jigsaw 点个星星'
    });
    translateService.setTranslation('en', {
      'get-started': 'Get started',
      'give-star': 'Give us a star on Github.com'
    });

    const lang: string = translateService.getBrowserLang();
    translateService.setDefaultLang(lang);
    translateService.use(lang);
  }
}
