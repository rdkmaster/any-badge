import {Component} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Component({
  template: `
    <div class="container">
      <h1>
        Welcome to Jigsaw Any Badge
      </h1>
      <h2>
        Put any badges to your projects in minutes
      </h2>
      <div class="buttons">
        <jigsaw-button width="180px" routerLink="/badges" colorType="danger" preSize="large">
          <span class="text">My Badges</span>
        </jigsaw-button>
        <jigsaw-button width="180px" routerLink="/guides/getting-started" preSize="large">
          <span class="text">Getting Started</span>
        </jigsaw-button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      width: 980px;
      margin: 40px auto 0 auto;
      text-align: center;
    }

    .buttons {
      margin-top: 36px;
      font-size: 85px;
    }

    .text {
      font-size: 18px;
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
