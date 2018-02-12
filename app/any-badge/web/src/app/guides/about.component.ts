import 'rxjs/add/operator/switchMap';
import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  template:`
    <div class="guides-container" jigsawScrollBar scrollBarAxis="y">
      <div class="guides-section">
        <h3>About the purpose</h3>
        <p>
          Any Badge is a full featured web application, including a front end based on
          <a href="https://github.com/rdkmaster/jigsaw" target="_blank">Jigsaw七巧板</a>, which is a web component set
          based on Angular, and it is also including a back end based on <a href="https://github.com/rdkmaster/rdk" target="_blank">RDK</a>,
          which is an open source and light weight RESTful framework.
          Any Badge shows how to build a not every complex but full featured web application with these libraries,
          it is the best practise of making use of them, specially it shows the best way to use Jigsaw and
          <a href="https://angular.io" target="_blank">Angular</a> which is yet still quite new to everyone.
        </p>
        <p>
          One of the major purpose of Any badge is teaching, it shows the best way to manage your front end and back end code together,
          it shows the best way to invoke a REST service, it shows the best way to manage routes, and how to navigate between them,
          it shows the best way to manage the status of an application, it shows the best way to make an application to use multi languages,
          it shows the best way to pass params between components, and how to make them to work perfect together, it show the best way
          to many more others, leaving you to dicover. Feel free to copy the code from Any Badge.
        </p>
        <p>
          Another purpose of Any Badge is providing highly customized badges for
          <a href="https://github.com/rdkmaster/jigsaw" target="_blank">Jigsaw七巧板</a> because that it needs some
          highly customized badges, like
          <img src="/rdk/service/app/any-badge/server/svg?subject=documentation&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l">
          <img src="/rdk/service/app/any-badge/server/svg?subject=components&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l">
          <img src="/rdk/service/app/any-badge/server/svg?subject=e2e testcases&privateKey=qgvxHISQ-Zi8LZ3Wc-OihYOz7U-uik3BA9l">.
          And we can't find anyone who provides such a service, so we have to make the badges by ourselves, by Any Badge.
        </p>
        <p>
          At the mean time, we will make Any Badge as an online service to provide highly customized badges.
          If you are running a project like <a href="https://github.com/rdkmaster/jigsaw" target="_blank">Jigsaw七巧板</a>,
          which needs some highly customized badge, Any Badge is your best choice, jump to <a routerLink="/guides/getting-started">getting-started</a>
          to learn more about how to make your own badges and put it on your project in minutes.
        </p>
      </div>

      <div class="guides-section">
        <h3>About the libraries involved</h3>
        <p>
          <a href="https://github.com/rdkmaster/jigsaw" target="_blank">Jigsaw七巧板</a> provides a set of web components
          based on Angular4+. The main purpose of Jigsaw is to help the application developers to construct complex &
          intensive interacting & use friendly web pages. Jigsaw is the next generation of web component set of RDK
          which supports developing of all applications of Big Data Product of ZTE. Visit
          <a href="http://rdk.zte.com.cn/jigsaw" target="_blank">Big Data UED</a> to learn more about Jigsaw七巧板.
        </p>
        <p>
          <a href="https://github.com/rdkmaster/rdk" target="_blank">RDK</a> is an open source and light weight RESTful framework.
          It is uses JavaScript as developing language of REST service like NodeJS, but RDK is not based on NodeJs.
          It uses SPRAY container to provide basic web services, it uses the AKKA the none blocking thread modal to provide
          better and higher performance of concurrency, and it uses the Java 8 nashorn script engine to run JavaScript.
          Visit <a href="http://rdk.zte.com.cn" target="_blank">Big Data UED</a> to learn more about RDK.
        </p>
      </div>

      <div class="guides-section">
        <h3>About us</h3>
        <p>
          You can <a href="https://github.com/rdkmaster/any-badge/issues/new" target="_blank">submit</a> issues to us
          if you have any trouble with Any Badge.
        </p>
        <p>
          We are ZTEers, who are working for the Big Data product of ZTE, and we are also the open source lovers and contributors,
          we are running several open source projects on github, which can be found <a href="https://github.com/rdkmaster" target="_blank">here</a>.
          Feel free submit any issues if you have any ideas or any troubles with any of these libraries, you can
          push us PRs to help us to make these libraries better and better. Visit <a href="http://rdk.zte.com.cn" target="_blank">here</a>
          to learn more about us.
        </p>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AboutComponent {
}
