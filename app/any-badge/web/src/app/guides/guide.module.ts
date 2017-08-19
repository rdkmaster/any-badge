import {NgModule} from '@angular/core';
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {JigsawScrollBarModule} from "@rdkmaster/jigsaw";

import {GettingStartedComponent} from "./getting-started.component";
import {FeaturesComponent} from "./features.component";
import {GuideRoutingModule} from "./guide-routing.module";


@NgModule({
  imports: [
    GuideRoutingModule, JigsawScrollBarModule, TranslateModule.forRoot()
  ],
  declarations: [
    GettingStartedComponent, FeaturesComponent
  ],
  providers: [TranslateService]
})
export class GuideModule {
  constructor(ts: TranslateService) {
    // these codes shows how to make your app to support i18n translation.
    // here we add 2 translations for Any Badge, which are zh and en,
    // and we gonna make the guides of Any Badge dual language supported.
    // You can load the translation from json async, visit the following
    // link to learn how:
    // https://github.com/ngx-translate/core#configuration
    //
    // But in the real development of an app, the number of translation
    // entries is not generally a lot, we may do not want to save them to
    // a json file and download it async, which will make our app more complex,
    // so I think the following codes is the best way to perform a translation.
    ts.setTranslation('zh', {
      switchLang: 'English Version',
      signIn: {
        header: '注册与登录',
        detail: '不啦不啦'
      }
    }, true);
    ts.setTranslation('en', {
      switchLang: '中文版',
      signIn: {
        header: 'Sign Up and Sign In',
        detail: `
          First of all, you need to create an Any Badge account and login,
          with this account, you can create any badges you want. You will
          need to fill a very simple form to sign up, I swear.
        `
      },
      createBadge: {
        header: 'Create a Badge',
        detail: `
          Once you'v logged in Any Badge successfully, you can follow the "My Badges" link
          in the front page of Any Badge to check your badge list, you can create or modify
          or remove the badges there. Feel free to create any badge you want. The following
          picture explains everything:
          <p class="guide-img-wrapper"><img src="../../assets/badges-table.png"></p>
        `
      },
      useBadge: {
        header: 'Put the badge to your project',
        detail:`
        `
      }
    }, true);

    // We use English as the default language due to the other parts of Any Badge
    // are created with English, in the real world, you can use `ts.getDefaultLang()`
    // to get the language from the browser, or fetch it from your server.
    ts.setDefaultLang('en');
  }
}
