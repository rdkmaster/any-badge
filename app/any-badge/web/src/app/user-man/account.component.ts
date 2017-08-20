import {AfterContentInit, Component, ElementRef, ViewChild} from "@angular/core";
import {
  ButtonInfo, DialogBase, JigsawDialog, JigsawInput, LoadingService, PopupInfo,
  PopupService
} from "@rdkmaster/jigsaw";
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

  constructor(private _popupService: PopupService, private _loading:LoadingService, public authService: AuthService) {
  }

  changePasswordDone = false;
  changePasswordClass = {
    'fa': true, 'fa-check': false, 'fa-times': false,
    'action-success': true, 'action-failed': false
  };
  changePasswordResult = '';

  changePassword(value: PasswordInfo) {
    if (value.newPassword != value.confirm) {
      this.errorMessage = 'new password mismatch';
      return;
    }

    const blockInfo = this._loading.show();
    this.changePasswordDone = false;
    // delete value.confirm;
    this.authService.changeAccountInfo(value).subscribe((result: HttpResult) => {
      this.changePasswordDone = true;
      blockInfo.dispose();
      const isSuccess = result.error == 0;
      this.changePasswordClass['fa-times'] = !isSuccess;
      this.changePasswordClass['action-failed'] = !isSuccess;
      this.changePasswordClass['fa-check'] = isSuccess;
      this.changePasswordClass['action-success'] = isSuccess;
      this.changePasswordResult = isSuccess ? 'successful' : 'failed';
    });
  }

  changeKeyDone = false;
  changeKeyClass = {
    'fa': true, 'fa-check': false, 'fa-times': false,
    'action-success': true, 'action-failed': false
  };
  changeKeyResult = '';

  changePrivateKey() {
    const blockInfo = this._loading.show();
    this.changeKeyDone = false;
    const popupInfo: PopupInfo = this._popupService.popup(
      ConfirmDialog, {modal: true}, ConfirmType.changePrivateKey);
    popupInfo.answer.subscribe(button => {
      blockInfo.dispose();
      if (button && button.label == 'OK' && !button.disabled) {
        this.authService.changeAccountInfo({password: popupInfo.instance.password, changePrivateKey: true})
          .subscribe(result => {
            this.changeKeyDone = true;
            const isSuccess = result.error == 0;
            this.changeKeyClass['fa-times'] = !isSuccess;
            this.changeKeyClass['action-failed'] = !isSuccess;
            this.changeKeyClass['fa-check'] = isSuccess;
            this.changeKeyClass['action-success'] = isSuccess;
            this.changeKeyResult = isSuccess ? 'successful' : 'failed, detail: ' + result.detail;
            if (isSuccess) {
              this.authService.privateKey = result.detail;
            }
          });
      }
      popupInfo.dispose();
    });
  }

  changeInfoDone = false;
  changeInfoClass = {
    'fa': true, 'fa-check': false, 'fa-times': false,
    'action-success': true, 'action-failed': false
  };
  changeInfoResult = '';

  changeInformation(newDescription: string, newNickName:string) {
    const blockInfo = this._loading.show();
    this.changeInfoDone = false;
    this.authService.changeAccountInfo({description: newDescription, nickName: newNickName})
      .subscribe(result => {
        blockInfo.dispose();
        this.changeInfoDone = true;
        const isSuccess = result.error == 0;
        this.changeInfoClass['fa-times'] = !isSuccess;
        this.changeInfoClass['action-failed'] = !isSuccess;
        this.changeInfoClass['fa-check'] = isSuccess;
        this.changeInfoClass['action-success'] = isSuccess;
        this.changeInfoResult = isSuccess ? 'successful' : 'failed, detail: ' + result.detail;
        if (isSuccess) {
          this.authService.description = newDescription;
        }
      });
  }

  deleteAccountDone = false;
  deleteAccountResult = '';

  deleteAccount() {
    const blockInfo = this._loading.show();
    this.deleteAccountDone = false;
    const popupInfo: PopupInfo = this._popupService.popup(
      ConfirmDialog, {modal: true}, ConfirmType.deleteAccount);
    popupInfo.answer.subscribe(button => {
      blockInfo.dispose();
      if (button && button.label == 'OK' && !button.disabled) {
        this.authService.deleteAccount(popupInfo.instance.password)
          .subscribe(result => {
            this.deleteAccountDone = true;
            if (result.error == 0) {
              alert('Everything in your Any Badge account has been removed, thanks for using Any Badge.\n' +
                'We are looking forward to see you again later. Good luck and goodbye.');
              this.authService.logout();
            } else {
              this.deleteAccountResult = result.detail;
            }
          });
      }
      popupInfo.dispose();
    });
  }
}
