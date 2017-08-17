import {CookieUtils} from "../utils/utils";
import {AuthService} from "../services/auth.service";


export type UserManInfo = {
  userName: string,
  nickName?: string,
  password: string,
  confirm?: string,
  description?: string
};

export abstract class UserManBase {
  public abstract action(value: UserManInfo):void;

  constructor(public authService:AuthService) {
  }

  public viewType: string = 'sign-up';
  public userName: string = CookieUtils.get('user');
  public userNamePattern = /^\w+$/;
  public errorMessage: string = '';
  public waitingForBadge: boolean = false;

  //login view property, to prevent mis-error message from WebStorm.
  public remember:boolean = true;
  public clearUserFromCookie(checked: boolean):void {
  }
  public navigate2SignUp() {
  }
}
