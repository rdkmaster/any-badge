import {Component} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Component({
  template: `
    <div class="container">
      <h1>
        Welcome to Jigsaw Any Badge
      </h1>
      <h2>
        Put any badges to your github projects
      </h2>
      <div class="links">
        <jigsaw-button colorType="danger" preSize="large"><span class="text">Badges</span></jigsaw-button>
        <jigsaw-button preSize="large"><span class="text">About Jigsaw</span></jigsaw-button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      width: 980px;
      margin-right: auto;
      margin-left: auto;
      text-align: center;
    }
    
    .links {
      margin-top: 66px;
      font-size: 85px;
    }
    
    .text {
      font-size: 25px;
    }
    
    h1, h2 {
      color: #fff;
      margin-top: 36px;
    }
    
    h1 {
      font-size: 55px;
    }
  `]
})
export class FrontPageComponent {
  constructor(public authService: AuthService) {
  }
}
