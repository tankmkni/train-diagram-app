import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvLoaderService {
  constructor(private http: HttpClient) {}

  load<T>(path: string, mapper: (row: string[]) => T): Observable<T[]> {
    return this.http.get(path, { responseType: 'text' }).pipe(
      map(text => {
        const lines = text.split('\n').filter(l => l.trim() !== '');
        lines.shift();  // ヘッダー行（1行目）を削除
        return lines.map(line => mapper(line.split(',')));
      })
    );
  }
}