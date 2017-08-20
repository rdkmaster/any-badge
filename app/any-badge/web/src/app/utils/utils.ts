import {TableData, TableMatrixRow} from "@rdkmaster/jigsaw";

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

  public static del(key: string):void {
    CookieUtils.put(key, '');
  }
}

export class Utils {
  public static isValidSubject(tableData:TableData, row:number):boolean {
    const rowData:TableMatrixRow = tableData.data[row];
    return !!rowData[1].toString().match(/^[a-z0-9-_][a-z0-9-_ ]+[a-z0-9-_]$/i);
  }
}
