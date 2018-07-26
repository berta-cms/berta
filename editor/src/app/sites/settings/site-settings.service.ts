import { Injectable } from '@angular/core';
import { SitesModule } from '../sites.module';
import { AppStateService } from '../../app-state/app-state.service';
import { switchMap, take, map } from 'rxjs/operators';
import { SitesSettingsStateModel } from './site-settings.interface';
import { Observable } from 'node_modules/rxjs';

@Injectable({
  providedIn: SitesModule
})
export class SiteSettingsService {

  constructor(private appStateService: AppStateService) { }

  getInitialState(): Observable<SitesSettingsStateModel> {
    return this.appStateService.getInitialState('', 'site_settings').pipe(  // @todo: initialize default settings in service
      switchMap(siteSettings => {
        return this.appStateService.getInitialState('', 'siteSettingsConfig').pipe(
          map(siteSettingsConfig => [siteSettings, siteSettingsConfig]));
      }),
      take(1),
      map(([siteSettings, siteSettingsConfig]) => {

        return siteSettings;
      })
    );
  }
}
