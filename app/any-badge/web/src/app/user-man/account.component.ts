import {AfterContentInit, Component, ViewChild} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {ButtonInfo, DialogBase, JigsawDialog, JigsawInput, PopupInfo, PopupService} from "@rdkmaster/jigsaw";
import {HttpResult} from "../utils/typings";
import {AuthService} from "../services/auth.service";

type PasswordInfo = {
  password: string,
  newPassword: string,
  confirm: string
};

enum ConfirmType {
  changePrivateKey, deleteAccount
}

@Component({
  template: `
    <jigsaw-dialog width="400px" (answer)="onClose($event)">
      <div jigsaw-title>
        <i class="fa fa-question-circle"></i> Action Need Your Confirm
      </div>
      <div jigsaw-body>
        <p>{{message}}</p>
        <span>Enter your password to confirm:</span>
        <jigsaw-input (valueChange)="onInput()" [(value)]="password"></jigsaw-input>
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
  @ViewChild(JigsawInput) input: JigsawInput;
  password: string;
  message: string = 'Please process with caution.';

  buttons: ButtonInfo[] = [
    {label: 'OK', type: 'warning', disabled: true}, {label: 'Cancel'},
  ];

  set initData(value: ConfirmType) {
    this.message = value == ConfirmType.changePrivateKey ?
      'You are about to change your private key, which may make your in-using badges to be unavailable.' :
      'You are about to delete your account, which will remove everything and will NOT be recoverable.';
  }

  onClose(button: ButtonInfo) {
    //you can handle the button in the component, or catch them outside, see `changePrivateKey()`
    console.log(button);
  }

  onInput() {
    setTimeout(() => this.buttons[0].disabled = !this.password);
  }

  ngAfterContentInit() {
    setTimeout(() => this.input.focus(), 100);
  }
}

@Component({
  templateUrl: './account.component.html'
})
export class AccountComponent {
  errorMessage = '';

  constructor(private _httpClient: HttpClient, private _ps: PopupService, public authService: AuthService) {
  }

  changePasswordDone = false;
  changePasswordClass = {
    'fa': true, 'fa-check': false, 'fa-times': false,
    'change-pwd-success': true, 'change-pwd-failed': false
  };
  changePasswordResult = '';

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

  changeKeyDone = false;
  changeKeyClass = {
    'fa': true, 'fa-check': false, 'fa-times': false,
    'change-pwd-success': true, 'change-pwd-failed': false
  };
  changeKeyResult = '';

  changePrivateKey() {
    this.changeKeyDone = false;
    if (this.authService.password) {
      this.authService.changeAccountInfo({password: this.authService.password, changePrivateKey: true})
        .subscribe(result => this.onChangePrivateKeyResult(result));
    } else {
      const popupInfo: PopupInfo = this._ps.popup(ConfirmDialog, {modal: true}, ConfirmType.changePrivateKey);
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

  changeDescDone = false;
  changeDescClass = {
    'fa': true, 'fa-check': false, 'fa-times': false,
    'change-pwd-success': true, 'change-pwd-failed': false
  };
  changeDescResult = '';

  changeDescription(newDescription: string) {
    this.changeDescDone = false;
    this.authService.changeAccountInfo({description: newDescription})
      .subscribe(result => {
        this.changeDescDone = true;
        const isSuccess = result.error == 0;
        this.changeDescClass['fa-times'] = !isSuccess;
        this.changeDescClass['change-pwd-failed'] = !isSuccess;
        this.changeDescClass['fa-check'] = isSuccess;
        this.changeDescClass['change-pwd-success'] = isSuccess;
        this.changeDescResult = isSuccess ? 'successful' : 'failed, detail: ' + result.detail;
        if (isSuccess) {
          this.authService.description = newDescription;
        }
      });
  }

  deleteAccount() {
    const popupInfo: PopupInfo = this._ps.popup(ConfirmDialog, {modal: true}, ConfirmType.deleteAccount);
    popupInfo.answer.subscribe(button => {
      if (button && button.label == 'OK' && !button.disabled) {
        this.authService.deleteAccount(popupInfo.instance.password)
          .subscribe(result => {
            if (result.error == 0) {
              alert('done');
            } else {
              alert('unable to delete your account');
            }
          });
      }
      popupInfo.dispose();
    });
  }
}
