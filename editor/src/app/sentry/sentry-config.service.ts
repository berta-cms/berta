import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SentryConfigService {
  constructor(private http: HttpClient) {}

  async getSentryDsn(): Promise<string> {
    try {
      const dsn = await firstValueFrom(
        this.http.get('/_api/v1/sentry-dsn', { responseType: 'text' }),
      );
      return dsn;
    } catch (error) {
      return '';
    }
  }
}
