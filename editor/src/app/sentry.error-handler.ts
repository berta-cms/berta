import * as Sentry from '@sentry/browser';

import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SentryErrorHandler extends ErrorHandler {
  sentryDSN: string | null = null;

  constructor(private http: HttpClient) {
    super();
    this.initSentry();
  }

  initSentry() {
    this.http
      .get('/_api/v1/sentry-dsn', { responseType: 'text' })
      .subscribe((response) => {
        this.sentryDSN = response;
        Sentry.init({ dsn: response });
      });
  }

  handleError(error) {
    if (this.sentryDSN) {
      Sentry.captureException(error.originalError || error);
    }

    super.handleError(error);
  }
}
