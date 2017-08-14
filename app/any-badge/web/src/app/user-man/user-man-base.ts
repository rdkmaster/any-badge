import {CookieUtils} from "../utils/utils";


export type UserManInfo = {
  userName: string,
  nickName?: string,
  password: string,
  confirm?: string,
  description?: string
};

export abstract class UserManBase {
  public abstract action(value: UserManInfo):void;

  public viewType: string = 'sign-up';
  public userName: string = CookieUtils.get('user');
  public userNamePattern = /^\w+$/;
  public errorMessage: string = '';

  //login view property, to prevent IDE mis-error message.
  public remember:boolean = true;
  public clearUserFromCookie(checked: boolean):void {
  }
  public navigate2SignUp() {
  }
}
