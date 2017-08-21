import {NgModule} from '@angular/core';
import {CommonModule} from "@angular/common";
import {TranslateModule, TranslateService} from "@ngx-translate/core";
import {JigsawScrollBarModule} from "@rdkmaster/jigsaw";

import {GettingStartedComponent} from "./getting-started.component";
import {AboutComponent} from "./about.component";
import {GuideRoutingModule} from "./guide-routing.module";


@NgModule({
  imports: [
    GuideRoutingModule, JigsawScrollBarModule, TranslateModule.forRoot(), CommonModule
  ],
  declarations: [
    GettingStartedComponent, AboutComponent
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
        detail: `
          <p>
          首先你需要注册一个 Any Badge 账号，仅需要填写一个非常简单的表单就可以完成这个步骤。
          有了这个账号，你就可以创建任何你需要的徽章了。
          </p>
        `
      },
      createBadge: {
        header: '创建徽章',
        detail: `
          <p>
          一旦你成功登录了 Any Badge，你就可以通过主页上的“My Badge”链接跳转到你的<a href="/badges">徽章列表</a>，
          你可以在那里完成徽章的增删改查，请随意创建任何你想要的徽章吧。下面这个图片介绍了如何使用这个功能：
          </p>
          <p class="guides-img-wrapper"><img src="${document.baseURI}assets/badges-table.png"></p>
        `
      },
      useBadge: {
        header: '使用徽章',
        detail: `
          <p>
          单击<a href="/badges">徽章列表</a>中的 <i class="fa fa-copy"></i> 图标，
          一个包含如何使用此徽章的链接的对话框会弹出来。
          </p>
          <p class="guides-img-wrapper"><img src="${document.baseURI}assets/copy-badge.png"></p>
          <p>
          拷贝 markdown 格式的链接文本到你的工程的README文档，保存之后，你的徽章应该就可以被显示出来了。
          注意：url中的 private key 与你的账号绑定了，最好能够对它保密，你可以在 <a href="/account">account view</a>
          中修改它。
          </p>
        `
      },
      updateBadge: {
        header: '随时随地更新徽章',
        detail: `
          <p>
          虽然你可以在<a href="/badges">徽章列表</a>中手工对徽章的状态做修改，但是 Any Badge 提供了一个更好的方式来做这事，
          这也我们推荐的方式。对下面的 url 发出一个 <code>PUT</code> 请求：
          </p>
          <p class="guides-code-block">http://rdkmaster.com/rdk/service/app/any-badge/server/badge</p>
          <p>
          在请求的body中，带上下面的参数：
          </p>
          <p class="guides-code-block">
          {<br>
          &nbsp;&nbsp;&nbsp;&nbsp;privateKey: '',&nbsp;&nbsp;&nbsp;// 必选的，在 account 视图中可以找到它<br>
          &nbsp;&nbsp;&nbsp;&nbsp;subject: '',&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 必选的<br>
          &nbsp;&nbsp;&nbsp;&nbsp;subjectColor: '',&nbsp;// 可选的，subject的颜色，支持css格式的颜色字符串<br>
          &nbsp;&nbsp;&nbsp;&nbsp;status: '',&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// 可选的，徽章的状态<br>
          &nbsp;&nbsp;&nbsp;&nbsp;statusColor: '',&nbsp;&nbsp;// 可选的，状态的颜色, 支持css格式的颜色字符串或者
          good/normal/bad 等枚举项<br>
          &nbsp;&nbsp;&nbsp;&nbsp;description: ''&nbsp;&nbsp;&nbsp;// 可选的，徽章的描述<br>
          }</p>
          <p>
          它将返回一个如下的对象：
          </p>
          <p class="guides-code-block">{ error: 0, detail: 'ok' }</p>
          <p>
          其中 <code>error</code> 属性的值等于0表示操作成功，如果它大于0，则表示出了一些问题，可以通过 <code>detail</code>
          属性获知问题所在。
          </p>
          <p>
          有了这个 api 你就可以随时随地的更新你的徽章了。在你的CI系统中更新徽章是一个典型的场景，一旦你的脚本完成了计算工作，
          它就可以使用 <code>curl</code> 命令来更新徽章了，命令看起来像这样：
          </p>
          <p class="guides-code-block">
           curl -X PUT -d '{"privateKey":"AgqwCXQK-fOYrWBtK-MFrB2BoM-vEuhkaA7","subject":"some count","subjectColor":"#555","status":"123","color":"bad"}'
           http://rdkmaster.com/rdk/service/app/any-badge/server/badge
          </p>
          <p>
          不仅如此，除了能够更新徽章的状态，你还可以利用这个 api 来创建、删除徽章。使用 <code>POST</code> 来创建一个新徽章：
          </p>
          <p class="guides-code-block">
           curl -X POST -d '{"privateKey":"AgqwCXQK-fOYrWBtK-MFrB2BoM-vEuhkaA7","subject":"some count","subjectColor":"#555","status":"123","color":"bad"}'
           http://rdkmaster.com/rdk/service/app/any-badge/server/badge
          </p>
          <p>
          使用 <code>DELETE</code> 来删除徽章：
          </p>
          <p class="guides-code-block">
           curl -X DELETE -d '{"subject":"some count","privateKey":"AgqwCXQK-fOYrWBtK-MFrB2BoM-vEuhkaA7"}'
           http://rdkmaster.com/rdk/service/app/any-badge/server/badge
          </p>
        `
      },
      contribute: {
        header: '需要帮助？',
        detail: `
          <p>
          你可以在github上通过<a href="https://github.com/rdkmaster/any-badge/issues/new">创建 issue</a>
          的方式给我们提任何需求或者报告bug。你也可以给我们推送PR来帮助我们改进 Any Badge。
          </p>
        `
      }
    }, true);
    ts.setTranslation('en', {
      switchLang: '中文版',
      signIn: {
        header: 'Sign up and sign in',
        detail: `
          <p>
          First of all, you need to create an Any Badge account and login,
          with this account, you can create any badges you want. You will
          need to fill a very simple form to sign up, I swear.
          </p>
        `
      },
      createBadge: {
        header: 'Create a badge',
        detail: `
          <p>
          Once you'v logged in Any Badge successfully, you can follow the "My Badges" link
          in the front page of Any Badge to check your <a href="/badges">badges list</a>,
          you can create or modify or remove the badges there. Feel free to create any badge
          you want. The following picture explains everything:
          </p>
          <p class="guides-img-wrapper"><img src="${document.baseURI}assets/badges-table.png"></p>
        `
      },
      useBadge: {
        header: 'Put the badge to your project',
        detail: `
          <p>
          Click the <i class="fa fa-copy"></i> icon in the <a href="/badges">badges list</a>,
          Any Badge will popup a dialog, in which shows the link of the current badge:
          </p>
          <p class="guides-img-wrapper"><img src="${document.baseURI}assets/copy-badge.png"></p>
          <p>
          Copy the markdown formatted link text or the svg image url to your project readme file and
          the badge should display. Notice that the private key in the url is bound to your account,
          it is good to keep it private. You can change it in <a href="/account">the account view</a>.
          </p>
        `
      },
      updateBadge: {
        header: 'Update the badges anytime and anywhere',
        detail: `
          <p>
          Although you can update your badges in the <a href="/badges">badges list</a> manually,
          but Any Badge provides a http api, which is a better and recommended way to do this. Just simply
          issue a http <code>PUT</code> request to the following url:
          </p>
          <p class="guides-code-block">http://rdkmaster.com/rdk/service/app/any-badge/server/badge</p>
          Put these parameters in the body of the request:
          <p class="guides-code-block">
          {<br>
          &nbsp;&nbsp;&nbsp;&nbsp;privateKey: '',&nbsp;&nbsp;&nbsp;// required, you can find it in the account view<br>
          &nbsp;&nbsp;&nbsp;&nbsp;subject: '',&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// required<br>
          &nbsp;&nbsp;&nbsp;&nbsp;subjectColor: '',&nbsp;// optional, color of the subject, support css styled color<br>
          &nbsp;&nbsp;&nbsp;&nbsp;status: '',&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;// optional, a status string<br>
          &nbsp;&nbsp;&nbsp;&nbsp;statusColor: '',&nbsp;&nbsp;// optional, color of the status, support css styled color and
          good/normal/bad enum items<br>
          &nbsp;&nbsp;&nbsp;&nbsp;description: ''&nbsp;&nbsp;&nbsp;// optional, the description of the badge<br>
          }</p>
          <p>
          It should return an object looks like this:
          </p>
          <p class="guides-code-block">{ error: 0, detail: 'ok' }</p>
          <p>
          The <code>error</code> property equals 0 represents everything is fine, in the other hand, <code>error</code> &gt; 0
          represents something wrong, and the <code>detail</code> property should tell what problem is.
          </p>
          <p>
          You can update the badge status anytime anywhere with this api. The best scenario is your CI
          system, as soon as your script finishes its calculation, it can update the badge by using the
          <code>curl</code> command, it looks like this:
          </p>
          <p class="guides-code-block">
           curl -X PUT -d '{"privateKey":"AgqwCXQK-fOYrWBtK-MFrB2BoM-vEuhkaA7","subject":"some count","subjectColor":"#555","status":"123","color":"bad"}'
           http://rdkmaster.com/rdk/service/app/any-badge/server/badge
          </p>
          <p>
          What's more, you can not only use it to update the status, but also use it to create or remove a badge.
          Use http <code>POST</code> to create a new badge: 
          </p>
          <p class="guides-code-block">
           curl -X POST -d '{"privateKey":"AgqwCXQK-fOYrWBtK-MFrB2BoM-vEuhkaA7","subject":"some count","subjectColor":"#555","status":"123","color":"bad"}'
           http://rdkmaster.com/rdk/service/app/any-badge/server/badge
          </p>
          <p>
          Use http <code>DELETE</code> to remove a badge:
          </p>
          <p class="guides-code-block">
           curl -X DELETE -d '{"subject":"some count","privateKey":"AgqwCXQK-fOYrWBtK-MFrB2BoM-vEuhkaA7"}'
           http://rdkmaster.com/rdk/service/app/any-badge/server/badge
          </p>
        `
      },
      contribute: {
        header: 'Want to help or need help?',
        detail: `
          <p>
          Feel free to send us a feature request or report us a bug by
          <a href="https://github.com/rdkmaster/any-badge/issues/new">submitting an issue</a> via github.
          You can also push us a PR to help us to make Any Badge better.
          </p>
        `
      }
    }, true);

    // We use English as the default language due to the other parts of Any Badge
    // are created with English, in the real world, you can use `ts.getDefaultLang()`
    // to get the language from the browser, or fetch it from your server.
    ts.setDefaultLang('en');
  }
}
