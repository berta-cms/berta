import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Observable, combineLatest, Subscription, Observer } from 'rxjs';
import { take, filter, debounceTime, pairwise } from 'rxjs/operators';
import { Store } from '@ngxs/store';

import { AppState } from '../app-state/app.state';
import { UserState } from '../user/user.state';
import { SitesState } from '../sites/sites-state/sites.state';
import { SiteTemplateSettingsState } from '../sites/template-settings/site-template-settings.state';
import { PreviewService } from './preview.service';
import { AppShowLoading, UpdateAppStateAction } from '../app-state/app.actions';
import { UserLogoutAction } from '../user/user.actions';
import { StyleService } from './style.service';
import { SiteSettingsState } from '../sites/settings/site-settings.state';
import { ShopSettingsState } from '../shop/settings/shop-settings.state';

interface IframeLocation {
  site: null | string;
  section: null | string;
  tag: null | string;
}

@Component({
  selector: 'berta-preview',
  template: `
    <iframe
      sandbox="allow-same-origin allow-scripts allow-modals allow-popups allow-forms"
      [src]="previewUrl"
      (load)="onLoad($event)"
      frameborder="0"
    ></iframe>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
      }
      iframe {
        flex-grow: 1;
        width: 100%;
        height: 100%;
        align-self: stretch;
      }
    `,
  ],
})
export class PreviewComponent implements OnInit {
  previewUrl: SafeUrl;
  iframeLocation: IframeLocation = {
    site: undefined,
    section: undefined,
    tag: undefined,
  };
  styleChangesSubscription: Subscription;
  shopStyleChangesSubscription: Subscription;

  constructor(
    private router: Router,
    private store: Store,
    private ngZone: NgZone,
    private service: PreviewService,
    private styleService: StyleService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // We need a start value for previewUrl while Observable is not ready
    // otherwise iframe loads wrong iframe src url: current url + 'null' (http://local.berta.me/engine/null)
    // This solves iframe in iframe loading
    // this.previewUrl =
    //   this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');

    // Load iframe with current site and section
    combineLatest(
      combineLatest(
        this.store.select(AppState.getSite),
        this.store.select(AppState.getSection)
      ).pipe(
        debounceTime(10),
        filter(([site, section]) => {
          return (
            site !== this.iframeLocation.site ||
            section !== this.iframeLocation.section
          );
        })
      ),
      this.store.select(UserState.isLoggedIn)
    ).subscribe(([[site, section], isLoggedIn]) => {
      let url =
        location.protocol + '//' + location.hostname + ':' + location.port;
      const queryParams = [];

      if (isLoggedIn) {
        url += '/engine/editor/';

        if (site) {
          queryParams.push({
            key: 'site',
            value: site,
          });
        }

        if (section) {
          queryParams.push({
            key: 'section',
            value: section,
          });
        }

        if (queryParams.length) {
          url +=
            '?' +
            queryParams.map((param) => param.key + '=' + param.value).join('&');
        }
      }

      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }

  onLoad(event) {
    this.waitFullLoad(event.target).subscribe({
      next: (iframe) => {
        window.addEventListener('message', (event) => {
          switch (event.data.action) {
            case 'EntryGalleryEditorOpen':
              this.router.navigate(
                [`/media/gallery/${event.data.section}/${event.data.entryId}`],
                {
                  queryParamsHandling: 'merge',
                  queryParams: {
                    site: event.data.site || null,
                  },
                }
              );
              break;

            case 'BackgroundGalleryEditorOpen':
              this.router.navigate(
                [`/background-gallery/${event.data.section}`],
                {
                  queryParamsHandling: 'merge',
                  queryParams: {
                    site: event.data.site || null,
                  },
                }
              );
              break;
          }
        });

        const lastUrlPart = iframe.contentDocument.location.href
          .replace(/\/$/, '')
          .split('/')
          .pop();
        const isSetup =
          iframe.contentDocument.body &&
          /xSetupWizard/.test(iframe.contentDocument.body.className);
        const urlParams = new URLSearchParams(
          iframe.contentDocument.location.search
        );
        this.iframeLocation = {
          site: urlParams.get('site') || '',
          section: urlParams.get('section'),
          tag: urlParams.get('tag'),
        };

        // Switch sites from iframe
        this.router.navigate([], {
          queryParams: {
            site: urlParams.get('site'),
            section: this.iframeLocation.section,
            tag: this.iframeLocation.tag,
          },
          queryParamsHandling: 'merge',
        });

        this.store.dispatch(new UpdateAppStateAction({ setup: isSetup }));

        /*
          Check for iframe login page
          try to login user with existing token
        */
        if (lastUrlPart === 'login.php' || lastUrlPart === 'engine') {
          const user = this.store.selectSnapshot(UserState);

          if (!user.token) {
            this.store.dispatch(UserLogoutAction);
            return;
          }

          const appState = this.store.selectSnapshot(AppState);

          return this.http
            .get(appState.authenticateUrl, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest', // Otherwise Lumen don't recognize AJAX request
              },
              params: {
                auth_key: user.token,
              },
            })
            .pipe(take(1))
            .subscribe({
              next: () => {
                // Token is valid, reload irame
                iframe.src += '';
              },
              error: (error) => {
                console.error(error);
                this.store.dispatch(UserLogoutAction);
              },
            });
        }

        if (typeof iframe.contentWindow['sync'] === 'function') {
          iframe.contentWindow['syncState'] = (url, data, method) => {
            /* Return promise to the old berta */
            return new Promise((resolve, reject) => {
              this.ngZone.run(() => {
                this.store.dispatch(AppShowLoading);
                this.service.sync(url, data, method).subscribe({
                  next: (response) => {
                    resolve(response);
                  },
                  error: (err) => {
                    reject(err);
                  },
                });
              });
            });
          };
        }

        this.service.loadRerenderService(iframe);

        /* Reload the iframe when the settings change */
        // this.service.connectIframeReload(iframe);
        // iframe.contentWindow.onbeforeunload = () => {
        //   this.service.disconnectIframeView(iframe);
        // };

        const styleElement = iframe.contentDocument.createElement('style');
        iframe.contentDocument.head.appendChild(styleElement);

        this.styleService.initializeStyleSheet(
          iframe.contentWindow,
          styleElement.sheet as CSSStyleSheet
        );

        this.styleChangesSubscription = combineLatest(
          this.store.select(SitesState.getCurrentSite),
          this.store
            .select(SiteSettingsState.getCurrentSiteTemplate)
            .pipe(filter((template) => !!template)),
          this.store
            .select(SiteTemplateSettingsState.getCurrentSiteTemplateSettings)
            .pipe(
              pairwise(),
              filter(([_, curSettings]) => !!curSettings)
            )
        ).subscribe(([site, template, [prevSettings, curSettings]]) => {
          if (!prevSettings) return;

          const stylesToChange = curSettings.reduce(
            (stylesToChange: any, settingsGroup) => {
              settingsGroup.settings.forEach((setting) => {
                const prevSettingGroup = prevSettings.find(
                  (prevSettingsGroup) =>
                    prevSettingsGroup.slug == settingsGroup.slug
                );
                if (!prevSettingGroup) {
                  return stylesToChange;
                }
                const prevSetting = prevSettingGroup.settings.find(
                  (prevSetting) => prevSetting.slug == setting.slug
                );
                if (!prevSetting) {
                  return stylesToChange;
                }
                if (setting.value !== prevSetting.value) {
                  stylesToChange.push({
                    group: settingsGroup.slug,
                    slug: setting.slug,
                    value: setting.value,
                  });
                }
              });

              return stylesToChange;
            },
            []
          );

          stylesToChange.forEach((styleToChange) => {
            this.styleService.updateStyle(
              site,
              template,
              styleToChange,
              curSettings
            );
          });
        });

        this.shopStyleChangesSubscription = combineLatest([
          this.store.select(ShopSettingsState.getCurrentSiteSettings).pipe(
            pairwise(),
            filter(([_, curSettings]) => !!curSettings)
          ),
        ]).subscribe(([[prevSettings, curSettings]]) => {
          if (!prevSettings) return;

          const shopStylesToChange = curSettings.reduce(
            (shopStylesToChange: any, settingsGroup) => {
              settingsGroup.settings.forEach((setting) => {
                const prevSettingGroup = prevSettings.find(
                  (prevSettingsGroup) =>
                    prevSettingsGroup.slug == settingsGroup.slug
                );
                if (!prevSettingGroup) {
                  return shopStylesToChange;
                }
                const prevSetting = prevSettingGroup.settings.find(
                  (prevSetting) => prevSetting.slug == setting.slug
                );
                if (!prevSetting) {
                  return shopStylesToChange;
                }
                if (
                  setting.value !== prevSetting.value &&
                  settingsGroup.slug === 'group_price_item'
                ) {
                  shopStylesToChange.push({
                    group: settingsGroup.slug,
                    slug: setting.slug,
                    value: setting.value,
                  });
                }
              });

              return shopStylesToChange;
            },
            []
          );

          shopStylesToChange.forEach((shopStyleToChange) => {
            this.styleService.updateShopStyle(shopStyleToChange, curSettings);
          });
        });

        // Unsubscribe from style changes if template has changed
        // After iframe reload styles updates again
        this.store
          .select(SiteSettingsState.getCurrentSiteTemplate)
          .pipe(pairwise(), take(1))
          .subscribe(() => {
            this.styleChangesSubscription.unsubscribe();
            this.shopStyleChangesSubscription.unsubscribe();
            iframe.contentWindow.location.reload();
          });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  private waitFullLoad(
    iframe: HTMLIFrameElement
  ): Observable<HTMLIFrameElement> {
    return Observable.create((observer: Observer<HTMLIFrameElement>) => {
      const maxChecks = 120;
      let intervalCount = 0;
      let lastError = '';
      const lastUrlPart = iframe.contentDocument.location.href
        .replace(/\/$/, '')
        .split('/')
        .pop();

      while (intervalCount < maxChecks) {
        if (!iframe.contentDocument) {
          lastError = 'Iframe has no contentDocument';
          intervalCount++;
          continue;
        }

        if (lastUrlPart === 'login.php' || lastUrlPart === 'engine') {
          observer.next(iframe);
          observer.complete();
        }

        if (
          iframe.contentDocument.body &&
          (iframe.contentDocument.body.classList.length === 0 ||
            !/(xLoginPageBody|xContent-|xSectionType-)/.test(
              iframe.contentDocument.body.className
            ))
        ) {
          lastError =
            'Berta classes `xLoginPageBody` or `xContent-[]` or `xSectionType-` are missing from body element';
          intervalCount++;
          continue;
        }

        observer.next(iframe);
        observer.complete();
        return;
      }

      observer.error({
        message: 'Could not load iframe: ' + lastError,
        data: iframe,
      });
      observer.complete();
    });
  }
}
