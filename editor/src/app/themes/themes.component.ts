import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Store } from '@ngxs/store';

import { PopupService } from '../popup/popup.service';
import { AppStateModel } from '../app-state/app-state.interface';
import { AppState } from '../app-state/app.state';
import {
  PreviewThemeSitesAction,
  ApplyThemeSitesAction
} from '../sites/sites-state/sites.actions';

@Component({
  selector: 'berta-themes',
  template: `
  <ul class="themes-container">
    <li *ngFor="let theme of themes">
      <div class="image-container">
        <img [src]="theme.imageSrc">
        <a href="#" class="preview" (click)="previewTheme($event, theme.name)">
          <span>
            <svg height="20" viewBox="0 0 29.999994 20" width="29.999994" xmlns="http://www.w3.org/2000/svg"><path d="m14.999998 4.1666a5.7781364 5.7781364 0 0 0 -1.627087.259992 2.8854222 2.8854222 0 0 1 .37708 1.406208 2.9166724 2.9166724 0 0 1 -2.916673 2.916696 2.8854222 2.8854222 0 0 1 -1.4062524-.377 5.8182406 5.8182406 0 1 0 5.5729284-4.206304zm14.81878 5.073c-2.824486-5.511-8.416164-9.2396-14.81878-9.2396-6.4026172 0-11.9958567 3.731192-14.81877902 9.240096a1.6848991 1.6848991 0 0 0 0 1.520304c2.82448482 5.510904 8.41616182 9.2396 14.81877902 9.2396 6.402616 0 11.995856-3.731304 14.81878-9.240104a1.6848991 1.6848991 0 0 0 0-1.520296zm-14.81878 8.260408c-5.1380316 0-9.8484566-2.864608-12.3922118-7.500016 2.5437552-4.635392 7.2536594-7.5 12.3922118-7.5 5.138552 0 9.848456 2.864608 12.392212 7.5-2.543234 4.635408-7.25366 7.500016-12.392212 7.500016z" fill="#a2afff" stroke-width=".052083"></path></svg>
            Preview
          </span>
        </a>
        <a href="#" class="apply" (click)="applyTheme($event, theme.name)">
          <span>
            <svg height="19.999998" viewBox="0 0 26.819992 19.999998" width="26.819992" xmlns="http://www.w3.org/2000/svg"><path d="m9.1092592 19.607203-8.71650571-8.71651c-.52367132-.52367-.52367132-1.3727405 0-1.8964705l1.89641621-1.89647c.5236713-.52372 1.3727972-.52372 1.8964686 0l5.8718547 5.8718105 12.57686-12.5768105c.523671-.52367 1.372797-.52367 1.896469 0l1.896416 1.89647c.523671.52367.523671 1.37274 0 1.89647l-15.42151 15.4215605c-.523724.52367-1.3727975.52367-1.8964688-.00005z" fill="#a2afff" stroke-width=".052383"></path></svg>
            Apply
          </span>
        </a>
      </div>
      <p>{{ theme.name }}</p>
    </li>
  </ul>
  `
})
export class ThemesComponent implements OnInit {
  appState: AppStateModel;
  themes: { name: string, imageSrc: SafeUrl }[];

  constructor(
    private store: Store,
    private router: Router,
    private sanitizer: DomSanitizer,
    private popupService: PopupService) {
  }

  ngOnInit() {
    this.store.select(AppState).subscribe((state: AppStateModel) => {
      this.appState = state;
      this.themes = this.appState.themes.map(theme => {
        const url = window.location.origin + '/_themes/' + theme + '.png';
        return {
          name: theme,
          imageSrc: this.sanitizer.bypassSecurityTrustResourceUrl(url)
        };
      });
    });
  }

  previewTheme(event, theme) {
    event.preventDefault();
    if (this.appState.isLoading) {
      return;
    }

    this.store.dispatch(new PreviewThemeSitesAction({
      site: this.appState.site,
      theme: theme
    })).subscribe({
      next: () => {
        const url = window.location.origin + (this.appState.site ? '/' + this.appState.site : '') + '?preview=1';
        window.open(url, '_blank');
      },
      error: (error) => console.error(error)
    });
  }

  applyTheme(event, theme) {
    event.preventDefault();
    if (this.appState.isLoading) {
      return;
    }

    this.popupService.showPopup({
      type: 'warn',
      content: 'Are you sure you want to apply this theme? All design related settings will be overwritten and can\'t be undone!',
      showOverlay: true,
      actions: [
        {
          type: 'primary',
          label: 'OK',
          callback: (popupService) => {
            this.store.dispatch(new ApplyThemeSitesAction({
              site: this.appState.site,
              theme: theme
            })).subscribe({
              next: () => {
                // @TODO update merged site state
                // Current workaround is to reload the window
                this.router.navigate(['/'], { replaceUrl: true, queryParams: { section: null }, queryParamsHandling: 'merge' }).then(() => {
                  window.location.reload();
                });
              },
              error: (error) => console.error(error)
            });
            popupService.closePopup();
          }
        },
        {
          label: 'Cancel'
        }
      ],
    });
  }
}
