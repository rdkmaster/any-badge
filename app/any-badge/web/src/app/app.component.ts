import {Component, OnInit, Renderer2, ViewContainerRef} from '@angular/core';
import {AuthService} from "./services/auth.service";
import {Router} from "@angular/router";
import {PopupInfo, PopupService} from "@rdkmaster/jigsaw";

@Component({
  selector: 'jigsaw-any-badge',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService, private _router: Router, private _popupService: PopupService,
              public viewContainerRef: ViewContainerRef, public renderer: Renderer2) {
  }

  public logout() {
    this.authService.logout();
    this._router.navigate(['']);
  }

  private _popupInfo: PopupInfo;
  private _disposerTimer:any;

  public showMenu(menu, menuDocker) {
    if (this._popupInfo) {
      this._popupInfo.dispose();
    }
    this._popupInfo = this._popupService.popup(menu, {
      modal: false, pos: menuDocker, posOffset: {top: 36, right: 15}
    });
  }

  public hideMenuLater() {
    if (!this._popupInfo) {
      return;
    }
    clearTimeout(this._disposerTimer);
    this._disposerTimer = setTimeout(() => {
      this._popupInfo.dispose();
      this._disposerTimer = null;
    }, 300);
  }

  public onMenuMouseEnter() {
    clearTimeout(this._disposerTimer);
    this._disposerTimer = null;
  }

  public logoSvg = LOGO_SVG_URL;

  public changeColor() {
    // change the url to force the browser to refresh the image.
    this.logoSvg = LOGO_SVG_URL + '&_=' + (+new Date);
  }

  ngOnInit() {
    this.authService.checkLoginStatus();
  }
}

const LOGO_SVG_URL = '/rdk/service/app/any-badge/server/svg?subject=logo&privateKey=jigsaw-any-badge';

