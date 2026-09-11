import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, combineLatest, from } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { SiteSettingsState } from '../sites/settings/site-settings.state';
import { UpdateSiteSettingsAction } from '../sites/settings/site-settings.actions';
import { PreviewService } from '../preview/preview.service';
import {
  SettingModel,
  SettingConfigModel,
  SettingsGroupModel,
  SettingGroupConfigModel,
} from '../shared/interfaces';

interface WizardField {
  group: string;
  setting: SettingModel;
  config: SettingConfigModel;
}

interface WizardFields {
  siteHeading: WizardField;
  ownerName: WizardField;
  metaDescription: WizardField;
  metaKeywords: WizardField;
}

/**
 * Real Angular replacement for the legacy first-run setup page
 * (`INSTALL/includes/wizzard.php`), which rendered its 3 fields as
 * `xEditable`-class inline-edit spans inside the preview iframe. Reuses the
 * exact same `<berta-setting>` input components and `UpdateSiteSettingsAction`
 * the normal Settings page (`SiteSettingsComponent`) already uses for these
 * same fields, so only the presentation changes, not the save mechanism.
 */
@Component({
  selector: 'berta-setup-wizard',
  template: `
    <div class="setup-wizard">
      <h2>Setup your site</h2>

      @if (fields$ | async; as fields) {
        <div class="setting-group">
          <berta-setting
            [setting]="fields.siteHeading.setting"
            [config]="fields.siteHeading.config"
            [disabled]="
              isSaving(
                fields.siteHeading.group,
                fields.siteHeading.setting.slug
              )
            "
            (update)="updateSetting(fields.siteHeading.group, $event)"
          ></berta-setting>
        </div>

        <div class="setting-group">
          <berta-setting
            [setting]="fields.ownerName.setting"
            [config]="fields.ownerName.config"
            [disabled]="
              isSaving(fields.ownerName.group, fields.ownerName.setting.slug)
            "
            (update)="updateSetting(fields.ownerName.group, $event)"
          ></berta-setting>
        </div>

        <div class="setting-group">
          <berta-setting
            [setting]="fields.metaDescription.setting"
            [config]="fields.metaDescription.config"
            [disabled]="
              isSaving(
                fields.metaDescription.group,
                fields.metaDescription.setting.slug
              )
            "
            (update)="updateSetting(fields.metaDescription.group, $event)"
          ></berta-setting>
        </div>

        <div class="setting-group">
          <berta-setting
            [setting]="fields.metaKeywords.setting"
            [config]="fields.metaKeywords.config"
            [disabled]="
              isSaving(
                fields.metaKeywords.group,
                fields.metaKeywords.setting.slug
              )
            "
            (update)="updateSetting(fields.metaKeywords.group, $event)"
          ></berta-setting>
        </div>

        <p>
          <button
            type="button"
            class="button"
            [disabled]="saving"
            (click)="finishSetup(fields)"
          >
            Done!
          </button>
        </p>
      }
    </div>
  `,
  styles: [
    `
      .setup-wizard {
        padding: 1.5em;
        display: flex;
        flex-direction: column;
        row-gap: 1em;
      }

      h2 {
        margin-top: 0;
      }

      berta-setting {
        margin: 0;
      }

      .setup-wizard p:last-child {
        margin-bottom: 0;
      }
    `,
  ],
  standalone: false,
})
export class SetupWizardComponent implements OnInit {
  fields$: Observable<WizardFields>;
  saving = false;
  private settingUpdate: { [k: string]: boolean } = {};

  constructor(
    private store: Store,
    private router: Router,
    private previewService: PreviewService,
  ) {}

  ngOnInit() {
    this.fields$ = combineLatest([
      this.store.select(SiteSettingsState.getCurrentSiteSettings),
      this.store.select((state) => state.siteSettingsConfig),
    ]).pipe(
      filter(
        ([settings, config]) =>
          !!settings &&
          settings.length > 0 &&
          !!config &&
          Object.keys(config).length > 0,
      ),
      map(([settings, config]) =>
        this.buildFields(settings as SettingsGroupModel[], config),
      ),
      filter((fields): fields is WizardFields => !!fields),
    );
  }

  private buildFields(
    settings: SettingsGroupModel[],
    config: { [group: string]: SettingGroupConfigModel },
  ): WizardFields | null {
    const siteHeading = this.findField(
      settings,
      config,
      'siteTexts',
      'siteHeading',
    );
    const ownerName = this.findField(settings, config, 'texts', 'ownerName');
    const metaDescription = this.findField(
      settings,
      config,
      'texts',
      'metaDescription',
    );
    const metaKeywords = this.findField(
      settings,
      config,
      'texts',
      'metaKeywords',
    );

    if (!siteHeading || !ownerName || !metaDescription || !metaKeywords) {
      return null;
    }

    return { siteHeading, ownerName, metaDescription, metaKeywords };
  }

  private findField(
    settings: SettingsGroupModel[],
    config: { [group: string]: SettingGroupConfigModel },
    group: string,
    slug: string,
  ): WizardField | null {
    const settingGroup = settings.find((g) => g.slug === group);
    const setting = settingGroup?.settings.find((s) => s.slug === slug);
    const settingConfig =
      config[group] && (config[group][slug] as SettingConfigModel);

    if (!setting || !settingConfig) {
      return null;
    }

    return { group, setting, config: settingConfig };
  }

  isSaving(group: string, slug: string): boolean {
    return this.settingUpdate[`${group}:${slug}`];
  }

  updateSetting(group: string, event: { field: string; value: any }) {
    const key = `${group}:${event.field}`;
    this.settingUpdate[key] = true;

    this.store
      .dispatch(
        new UpdateSiteSettingsAction(group, { [event.field]: event.value }),
      )
      .subscribe({
        next: () => {
          this.settingUpdate[key] = false;
        },
        error: () => {
          this.settingUpdate[key] = false;
        },
      });
  }

  finishSetup(fields: WizardFields) {
    this.saving = true;

    const ownerName = fields.ownerName.setting.value;
    const siteHeading = fields.siteHeading.setting.value;
    const actions: UpdateSiteSettingsAction[] = [];

    if (ownerName) {
      actions.push(
        new UpdateSiteSettingsAction('siteTexts', {
          siteFooter: `${ownerName} &copy; `,
        }),
      );
    }

    if (siteHeading) {
      actions.push(
        new UpdateSiteSettingsAction('texts', { pageTitle: siteHeading }),
      );
    }

    actions.push(new UpdateSiteSettingsAction('berta', { installed: 1 }));

    from(actions)
      .pipe(concatMap((action) => this.store.dispatch(action)))
      .subscribe({
        complete: () => {
          this.previewService.reloadIframe();
          this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
        },
        error: () => {
          this.saving = false;
        },
      });
  }
}
