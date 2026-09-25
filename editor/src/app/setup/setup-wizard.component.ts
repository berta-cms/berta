import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, combineLatest, forkJoin, from, of } from 'rxjs';
import {
  catchError,
  concatMap,
  defaultIfEmpty,
  filter,
  finalize,
  map,
  shareReplay,
} from 'rxjs/operators';
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
}

/**
 * First-run setup wizard, shown while the site is not installed. Reuses the
 * same `<berta-setting>` input components and `UpdateSiteSettingsAction` the
 * normal Settings page (`SiteSettingsComponent`) uses for these fields.
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

        <p>
          <button
            type="button"
            class="button"
            [disabled]="saving"
            (click)="finishSetup()"
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
  private pendingUpdates = new Set<Observable<unknown>>();

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
    if (!siteHeading || !ownerName || !metaDescription) {
      return null;
    }

    return { siteHeading, ownerName, metaDescription };
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

    const update$ = this.store
      .dispatch(
        new UpdateSiteSettingsAction(group, { [event.field]: event.value }),
      )
      .pipe(
        catchError(() => of(null)),
        finalize(() => {
          this.settingUpdate[key] = false;
          this.pendingUpdates.delete(update$);
        }),
        shareReplay(1),
      );

    this.pendingUpdates.add(update$);
    update$.subscribe();
  }

  finishSetup() {
    this.saving = true;

    // Fields save on blur, so clicking "Done!" straight from a field starts
    // that field's save in the same gesture — wait for it, then read the
    // just-saved values from the store rather than the (stale) snapshot the
    // template rendered with.
    forkJoin([...this.pendingUpdates])
      .pipe(
        defaultIfEmpty(null),
        concatMap(() => from(this.buildFinishActions())),
        concatMap((action) => this.store.dispatch(action)),
      )
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

  private buildFinishActions(): UpdateSiteSettingsAction[] {
    const settings =
      this.store.selectSnapshot(SiteSettingsState.getCurrentSiteSettings) || [];
    const valueOf = (group: string, slug: string) =>
      settings
        .find((g) => g.slug === group)
        ?.settings.find((s) => s.slug === slug)?.value;

    const ownerName = valueOf('texts', 'ownerName');
    const siteHeading = valueOf('siteTexts', 'siteHeading');
    const actions: UpdateSiteSettingsAction[] = [];

    if (ownerName) {
      actions.push(
        new UpdateSiteSettingsAction('siteTexts', {
          // `siteFooter` renders with `|raw`, so the name must be escaped.
          siteFooter: `${this.escapeHtml(String(ownerName))} &copy; `,
        }),
      );
    }

    if (siteHeading) {
      actions.push(
        new UpdateSiteSettingsAction('texts', { pageTitle: siteHeading }),
      );
    }

    actions.push(new UpdateSiteSettingsAction('berta', { installed: 1 }));

    return actions;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
