import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { SiteSettingsModel } from './sites-settings.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'berta-site-settings',
  template: `
    <h2>Site settings</h2>
    <div *ngFor="let settingGroup of getSettingsGroups(settings$) | async">
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
export class SiteSettingsComponent implements OnInit {
  @Select(state => state.siteSettings[state.app.site]) settings$: Observable<SiteSettingsModel>;

  constructor() { }

  ngOnInit() {
  }

  getSettingsGroups(settings$) {
    return settings$.pipe(
      map((settings: SiteSettingsModel) => {
        return settings && Object.keys(settings).map((settingGroup) => {
          return [
            this.generateTitle(settingGroup),
            Object.keys(settings[settingGroup]).map(setting => [this.generateTitle(setting), settings[settingGroup][setting]])
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
