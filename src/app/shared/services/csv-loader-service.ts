import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvLoaderService {

  constructor(private http: HttpClient) {}  // HttpClientをDIするためにサービスにしている

  /**
   * CSV ファイルを読み込み、各行を mapper で任意の型に変換して返す。
   *
   * - CSV は「1行目がヘッダーである」前提
   * - このメソッド自体はヘッダー行も含めて処理する
   * - ヘッダーを除去したい場合は loadWithoutHeader を使う
   */
  load<T>(path: string, mapper: (row: string[]) => T): Observable<T[]> {
    return this.http.get(path, { responseType: 'text' }).pipe(
      map(text => {
        const lines = text.split('\n').filter(l => l.trim() !== '');  // 空行を除外し、CSV を行単位に分割
        return lines.map(line => mapper(line.split(',').map(col => col.trim())));  // 各行をカンマ区切りで分割し、mapper で型変換
      })
    );
  }


  /**
   * CSV ファイルを読み込み、ヘッダー行（1行目）を除外して返す。
   *
   * - 内部的には load() を呼び出している
   * - mapper は load() 側で適用済み
   * - ここでは「先頭要素を取り除く」だけに責務を限定している
   */
  loadWithoutHeader<T>(path: string, mapper: (row: string[]) => T): Observable<T[]> {
    return this.load(path, mapper).pipe(
      map(items => {
        return items.slice(1);  // 1行目（ヘッダー相当）を削除
      })
    );
  }
}