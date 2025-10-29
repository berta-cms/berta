import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map, filter, scan, take } from 'rxjs/operators';
import { splitCamel, uCFirst, getIconFromUrl } from '../../shared/helpers';
import { UserStateModel } from '../../user/user.state.model';
import { AppStateModel } from '../../app-state/app-state.interface';
import { SiteSettingsState } from './site-settings.state';
import {
  UpdateSiteSettingsAction,
  AddSiteSettingChildrenAction,
  DeleteSiteSettingChildrenAction,
  UpdateSiteSettingChildrenAction,
} from './site-settings.actions';
import {
  SettingModel,
  SettingChildModel,
  SettingConfigModel,
  SettingGroupConfigModel,
  SettingsGroupModel,
} from '../../shared/interfaces';

@Component({
  selector: 'berta-site-settings',
  template: `
    @for (settingGroup of settings$ | async; track settingGroup) {
      <div
        class="setting-group"
        [class.is-expanded]="camelifySlug(currentGroup) === settingGroup.slug"
      >
        <h3
          [routerLink]="[
            '/settings',
            camelifySlug(currentGroup) === settingGroup.slug
              ? ''
              : slugifyCamel(settingGroup.slug),
          ]"
          queryParamsHandling="preserve"
          role="link"
          class="hoverable"
        >
          {{ settingGroup.config.title || settingGroup.slug }}
          <svg
            class="drop-icon"
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 1L4.75736 5.24264L0.514719 1"
              stroke="#9b9b9b"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </h3>
        <div class="settings">
          <div>
            @for (setting of settingGroup.settings; track setting) {
              <div>
                @if (!setting.config.children) {
                  <berta-setting
                    [setting]="setting.setting"
                    [config]="setting.config"
                    [disabled]="
                      isDisabled(
                        settingGroup,
                        setting.setting,
                        setting.config,
                        user$ | async
                      )
                    "
                    [disabledReason]="
                      disabledReason(
                        setting.config,
                        user$ | async,
                        appState$ | async
                      )
                    "
                    [error]="
                      settingError[
                        settingGroup.slug + ':' + setting.setting.slug
                      ]
                    "
                    (update)="updateSetting(settingGroup.slug, $event)"
                  ></berta-setting>
                }
                @if (setting.config.children) {
                  <div>
                    <div class="setting">
                      <h4>{{ setting.config.title }}</h4>
                    </div>
                    @for (
                      inputFields of setting.children;
                      track inputFields;
                      let index = $index
                    ) {
                      <berta-setting-row
                        [inputFields]="inputFields"
                        (update)="
                          updateChildren(
                            settingGroup.slug,
                            setting.setting.slug,
                            index,
                            $event
                          )
                        "
                        (delete)="
                          deleteChildren(
                            settingGroup.slug,
                            setting.setting.slug,
                            index
                          )
                        "
                      >
                      </berta-setting-row>
                    }
                    <berta-setting-row-add
                      [config]="setting.config.children"
                      (add)="
                        addChildren(
                          settingGroup.slug,
                          setting.setting.slug,
                          $event
                        )
                      "
                    >
                    </berta-setting-row-add>
                    @if (setting.config.description) {
                      <div class="setting">
                        <p
                          class="setting-description"
                          [innerHTML]="
                            getSettingDescription(setting.config.description)
                          "
                        ></p>
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  standalone: false,
})
export class SiteSettingsComponent implements OnInit {
  defaultGroup = 'template';
  currentGroup: string;
  settings$: Observable<
    Array<{
      config: SettingGroupConfigModel['_'];
      settings: Array<{
        setting: SettingModel;
        config: SettingConfigModel;
        children?: Array<SettingChildModel[]>;
      }>;
      slug: string;
    }>
  >;
  settingUpdate: { [k: string]: boolean } = {};
  settingError: { [k: string]: string } = {};

  readonly user$: Observable<UserStateModel>;
  readonly appState$: Observable<AppStateModel>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) {
    this.user$ = this.store.select((state) => state.user);
    this.appState$ = this.store.select((state) => state.app);
  }

  ngOnInit() {
    this.settings$ = combineLatest([
      this.store.select(SiteSettingsState.getCurrentSiteSettings),
      this.store.select((state) => state.siteSettingsConfig),
      this.appState$,
    ]).pipe(
      filter(
        ([settings, config]) =>
          settings &&
          settings.length > 0 &&
          config &&
          Object.keys(config).length > 0,
      ),
      map(([settings, config, appState]) => {
        return settings
          .filter((settingGroup) => !config[settingGroup.slug]._.invisible)
          .filter(
            (settingGroup) =>
              settingGroup.slug !== 'theme' || appState.themes.length > 0,
          )
          .map((settingGroup) => {
            return {
              settings: settingGroup.settings
                .filter((setting) => !!config[settingGroup.slug][setting.slug]) // don't show settings that have no config
                .map((setting) => {
                  let settingObj: {
                    setting: SettingModel;
                    config: SettingConfigModel;
                    children?: Array<SettingChildModel[]>;
                  } = {
                    setting: setting,
                    config: config[settingGroup.slug][setting.slug],
                  };
                  const childrenConfig =
                    config[settingGroup.slug][setting.slug].children;

                  if (childrenConfig) {
                    const children = (setting.value as any).map((row) => {
                      return row.map((child) => {
                        return {
                          setting: child,
                          config: childrenConfig[child.slug],
                        };
                      });
                    });

                    settingObj = { ...settingObj, ...{ children: children } };
                  }

                  return settingObj;
                }),
              config: config[settingGroup.slug]._,
              slug: settingGroup.slug,
            };
          });
      }),
      /**
       * settingGroups in this step aren't the ones we get from the store,
       * they are virtual objects created in prev step (the map function)
       */
      scan((prevSettingGroups, settingGroups) => {
        if (!prevSettingGroups || prevSettingGroups.length === 0) {
          return settingGroups;
        }

        return settingGroups.map((settingGroup) => {
          const prevSettingGroup = prevSettingGroups.find((psg) => {
            return (
              psg.slug === settingGroup.slug &&
              psg.config === settingGroup.config &&
              psg.settings.length === settingGroup.settings.length
            );
          });

          if (prevSettingGroup) {
            if (
              settingGroup.settings.some(
                (setting, index) =>
                  prevSettingGroup.settings[index].setting !== setting.setting,
              )
            ) {
              /* Careful, not to mutate anything coming from the store: */
              prevSettingGroup.settings = settingGroup.settings.map(
                (setting, index) => {
                  const prevSetting = prevSettingGroup.settings.find((ps) => {
                    return (
                      ps.setting === setting.setting &&
                      ps.config === setting.config
                    );
                  });

                  if (prevSetting) {
                    return prevSetting;
                  }

                  // @todo this doesn't work as expected, needs to be fixed to use previous objects
                  if (setting.children) {
                    const prevSettingChildren =
                      prevSettingGroup.settings[index].children;

                    if (prevSettingChildren.length > 0) {
                      setting.children = setting.children.map((row, index) => {
                        const prevSettingRow = prevSettingChildren[index];

                        if (prevSettingRow) {
                          return row.map((child, i) => {
                            const prevChild = prevSettingRow[i];

                            if (
                              prevChild &&
                              prevChild.setting === child.config
                            ) {
                              return prevChild;
                            }

                            return child;
                          });
                        }

                        return row;
                      });
                    }
                  }

                  return setting;
                },
              );
            }
            return prevSettingGroup;
          }
          return settingGroup;
        });
      }),
    );

    this.route.paramMap.subscribe((params) => {
      this.currentGroup =
        params['params']['group'] ||
        (params['params']['group'] === undefined ? this.defaultGroup : '');
    });
  }

  slugifyCamel(camelText: string) {
    return splitCamel(camelText)
      .map((piece) => piece.toLowerCase())
      .join('-');
  }

  camelifySlug(slug: string) {
    return slug
      .split('-')
      .map((piece, i) => {
        return i ? uCFirst(piece) : piece;
      })
      .join('');
  }

  getSettingDescription(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  isDisabled(
    settingGroup: SettingsGroupModel,
    setting: SettingModel,
    config: SettingConfigModel,
    user: UserStateModel,
  ) {
    return (
      this.settingUpdate[settingGroup.slug + ':' + setting.slug] ||
      (config.requires_feature &&
        user.features.indexOf(config.requires_feature) === -1)
    );
  }

  disabledReason(
    config: SettingConfigModel,
    user: UserStateModel,
    appState: AppStateModel,
  ) {
    if (
      !config.requires_feature ||
      user.features.indexOf(config.requires_feature) > -1
    ) {
      return;
    }

    const requiredPlan = appState.plans.find(
      (plan) => plan.features.indexOf(config.requires_feature) > -1,
    );
    if (!requiredPlan) {
      return;
    }

    return `(Upgrade to ${requiredPlan.name} plan)`;
  }

  updateSetting(settingGroup: string, updateEvent) {
    const data = { [updateEvent.field]: updateEvent.value };
    this.settingError[`${settingGroup}:${updateEvent.field}`] = '';
    this.settingUpdate[`${settingGroup}:${updateEvent.field}`] = true;

    this.store
      .dispatch(new UpdateSiteSettingsAction(settingGroup, data))
      .pipe(take(1))
      .subscribe(
        () => {
          this.settingUpdate[`${settingGroup}:${updateEvent.field}`] = false;
        },
        (error) => {
          if (error.error && error.error.message) {
            this.settingError[`${settingGroup}:${updateEvent.field}`] =
              error.error.message;
          }
          this.settingUpdate[`${settingGroup}:${updateEvent.field}`] = false;
        },
      );
  }

  addChildren(settingGroup: string, slug: string, updateEvent) {
    const hasSomeValue = Object.keys(updateEvent).some(
      (item) => updateEvent[item].trim().length > 0,
    );
    if (hasSomeValue) {
      // Update social media icon by url
      if (
        settingGroup === 'socialMediaLinks' &&
        slug === 'links' &&
        updateEvent.url !== undefined
      ) {
        const iconName = getIconFromUrl(updateEvent.url);
        updateEvent['icon'] = iconName;
      }

      this.store.dispatch(
        new AddSiteSettingChildrenAction(settingGroup, slug, updateEvent),
      );
    }
  }

  updateChildren(
    settingGroup: string,
    slug: string,
    index: number,
    updateEvent,
  ) {
    const data = { [updateEvent.field]: updateEvent.value };
    this.store.dispatch(
      new UpdateSiteSettingChildrenAction(settingGroup, slug, index, data),
    );

    // Update social media icon by url
    if (
      settingGroup === 'socialMediaLinks' &&
      slug === 'links' &&
      updateEvent.field === 'url'
    ) {
      const iconName = getIconFromUrl(updateEvent.value);
      this.store.dispatch(
        new UpdateSiteSettingChildrenAction(settingGroup, slug, index, {
          icon: iconName,
        }),
      );
    }
  }

  deleteChildren(settingGroup: string, slug: string, index: number) {
    this.store.dispatch(
      new DeleteSiteSettingChildrenAction(settingGroup, slug, index),
    );
  }
}
