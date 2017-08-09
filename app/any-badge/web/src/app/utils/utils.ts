export class CookieUtils {
  private static _toObject(): any {
    const values = document.cookie.split(/\s*;\s*/g);
    const result = {};
    values.forEach(keyValue => {
      if (!keyValue) {
        return;
      }
      const arr = keyValue.split('=');
      result[arr[0]] = arr[1];
    });
    return result;
  }

  public static get(key: string): string {
    return CookieUtils._toObject()[key];
  }

  public static put(key: string, value: string|number|boolean): void {
    document.cookie = `${key}=${value};`;
  }

  static del(key: string):void {
    CookieUtils.put(key, '');
  }
}
