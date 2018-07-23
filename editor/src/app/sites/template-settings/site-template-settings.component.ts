import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SiteTemplateSettingsModel } from './site-template-settings.interface';
import { map, switchMap, filter, tap } from 'rxjs/operators';

@Component({
  selector: 'berta-site-template-settings',
  template: `
    <h2>Site Template Settings</h2>
    <div *ngFor="let settingGroup of getSettingsGroups(templateSettings$) | async">
      <h3>{{ settingGroup[0] }}</h3>
      <ul>
        <li *ngFor="let setting of settingGroup[1]"><strong>{{setting[0]}}</strong>: {{setting[1]}}</li>
      </ul>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      overflow-x: hidden;
      height: 100%;
    }
    div {
      margin-bottom: 10px;
    }
  `]
})
export class SiteTemplateSettingsComponent implements OnInit {

  @Select(state => state.siteTemplateSettings[state.app.site]) templateSettings$: Observable<SiteTemplateSettingsModel>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  getSettingsGroups(settings$) {
    return settings$.pipe(
      switchMap(siteSettingsByTemplate => {
        return this.store.select(state => state).pipe(
          filter(state => !!(state.siteSettings && state.siteSettings[state.app.site])),
          map(state => state.siteSettings[state.app.site]),
          filter(siteSettings => siteSettings.template),
          map(siteSettings => siteSettingsByTemplate[siteSettings.template.template])
        );
      }),
      map((templateSettings: SiteTemplateSettingsModel) => {
        return templateSettings && Object.keys(templateSettings).map((settingGroup) => {
          return [
            this.generateTitle(settingGroup),
            Object.keys(templateSettings[settingGroup])
              .map(setting => [this.generateTitle(setting), templateSettings[settingGroup][setting]])
          ];
        }) || [];
      })
    );
  }

  generateTitle(setting: string): string {
    return setting.match(/(([a-z]|[A-Z])[a-z]*)/g)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
