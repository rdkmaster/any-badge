import {Component, ViewEncapsulation} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  templateUrl: 'getting-started.component.html',
  encapsulation: ViewEncapsulation.None
})
export class GettingStartedComponent {
  constructor(private _ts:TranslateService) {

  }
  switchLang() {
    this._ts.setDefaultLang(this._ts.getDefaultLang() == 'en' ? 'zh' : 'en');
  }
}
