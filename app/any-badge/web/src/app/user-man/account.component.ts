import {
  AfterContentInit, Component, QueryList, ViewChild,
  ViewChildren
} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ButtonInfo, DialogBase, JigsawDialog, JigsawInput, PopupInfo, PopupService} from "@rdkmaster/jigsaw";
import {HttpResult} from "../utils/typings";
import {AuthService} from "../services/auth.service";

type PasswordInfo = {
  password: string,
  newPassword: string,
  confirm: string
};

@Component({
  template: `
    <jigsaw-dialog width="400px" (answer)="onClose($event)">
      <div jigsaw-title>
        <i class="fa fa-question-circle"></i> Action Need Your Confirm
      </div>
      <div jigsaw-body>
        <p>{{message}}</p>
        <span>Enter your {{needPasswordConfirm ? 'password' : 'user name'}} to confirm:</span>
        <jigsaw-input *ngIf="needPasswordConfirm" (valueChange)="onInput()"
                      [(value)]="password"></jigsaw-input>
        <jigsaw-input *ngIf="needUserNameConfirm" (valueChange)="onInput()"
                      [(value)]="userName"></jigsaw-input>
      </div>
    </jigsaw-dialog>
  `,
  styles: [`
    div[jigsaw-body] {
      padding: 12px;
    }

    p {
      margin-bottom: 12px;
    }

    jigsaw-input {
      /*margin-bottom: 36px;*/
      width: 200px;
    }
  `]
})
export class ConfirmDialog extends DialogBase implements AfterContentInit {
  @ViewChild(JigsawDialog) dialog: JigsawDialog;
  @ViewChildren(JigsawInput) inputs: QueryList<JigsawInput>;
  password: string;
  userName: string;
  needPasswordConfirm: boolean = true;
  needUserNameConfirm: boolean = false;
  message: string = 'Please process with caution.';

  buttons: ButtonInfo[] = [
    {label: 'OK', type: 'warning', disabled: true},
    {label: 'Cancel'},
  ];

  set initData(value: any) {
    this.needPasswordConfirm = value.needPasswordConfirm;
    this.needUserNameConfirm = value.needUserNameConfirm;
    this.message = this.needPasswordConfirm ?
      'You are about to change your private key, which may make your in-using badges to be unavailable.' :
      'You are about to delete your account, which will remove everything and will NOT be recoverable.';
  }

  onClose(button: ButtonInfo) {
    //you can handle the button in the component, or catch them outside, see `changePrivateKey()`
    console.log(button);
  }

  onInput() {
    setTimeout(() => this.buttons[0].disabled = !(this.needPasswordConfirm ? this.password : this.userName));
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.inputs.forEach(input => input.focus());
    }, 100);
  }
}

@Component({
  templateUrl: './account.component.html'
})
export class AccountComponent {
  errorMessage = '';

  changePasswordDone = false;
  changePasswordClass = {
    'fa': true, 'fa-check': false, 'fa-times': false,
    'change-pwd-success': true, 'change-pwd-failed': false
  };
  changePasswordResult = '';

  changeKeyDone = false;
  changeKeyClass = {
    'fa': true, 'fa-check': false, 'fa-times': false,
    'change-pwd-success': true, 'change-pwd-failed': false
  };
  changeKeyResult = '';

  constructor(private _httpClient: HttpClient, private _ps: PopupService, public authService: AuthService) {
  }

  changePassword(value: PasswordInfo) {
    if (value.newPassword != value.confirm) {
      this.errorMessage = 'new password mismatch';
      return;
    }

    this.changePasswordDone = false;
    // delete value.confirm;
    this.authService.changeAccountInfo(value).subscribe((result: HttpResult) => {
      this.changePasswordDone = true;
      const isSuccess = result.error == 0;
      this.changePasswordClass['fa-times'] = !isSuccess;
      this.changePasswordClass['change-pwd-failed'] = !isSuccess;
      this.changePasswordClass['fa-check'] = isSuccess;
      this.changePasswordClass['change-pwd-success'] = isSuccess;
      this.changePasswordResult = isSuccess ? 'successful' : 'failed';

      if (isSuccess) {
        //save the password for further usage.
        this.authService.password = value.password;
      }
    });
  }

  changePrivateKey() {
    this.changeKeyDone = false;
    if (this.authService.password) {
      this.authService.changeAccountInfo({password: this.authService.password, changePrivateKey: true})
        .subscribe(result => this.onChangePrivateKeyResult(result));
    } else {
      const popupInfo: PopupInfo = this._ps.popup(ConfirmDialog, {modal: true},
        {needPasswordConfirm: true, needUserNameConfirm: false});
      popupInfo.answer.subscribe(button => {
        if (button && button.label == 'OK' && !button.disabled) {
          this.authService.changeAccountInfo({password: popupInfo.instance.password, changePrivateKey: true})
            .subscribe(result => {
              if (result.error == 0) {
                this.authService.password = popupInfo.instance.password;
              }
              this.onChangePrivateKeyResult(result);
            });
        }
        popupInfo.dispose();
      });
    }
  }

  onChangePrivateKeyResult(result: HttpResult) {
    this.changeKeyDone = true;
    const isSuccess = result.error == 0;
    this.changeKeyClass['fa-times'] = !isSuccess;
    this.changeKeyClass['change-pwd-failed'] = !isSuccess;
    this.changeKeyClass['fa-check'] = isSuccess;
    this.changeKeyClass['change-pwd-success'] = isSuccess;
    this.changeKeyResult = isSuccess ? 'successful' : 'failed, detail: ' + result.detail;
    if (isSuccess) {
      this.authService.privateKey = result.detail;
    }
  }
}
