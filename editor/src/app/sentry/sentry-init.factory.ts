import { SentryConfigService } from './sentry-config.service';
import * as Sentry from '@sentry/angular';

export function sentryInitFactory(sentryConfigService: SentryConfigService) {
  return async () => {
    const dsn = await sentryConfigService.getSentryDsn();

    if (!dsn) {
      return;
    }

    Sentry.init({ dsn });
  };
}
