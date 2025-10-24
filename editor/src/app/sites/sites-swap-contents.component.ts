import { Component, inject } from '@angular/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'berta-sites-swap-contents',
  template: `
    <p>You are about to swap the contents between sites:</p>

    <div class="bt-switch-sites">
      {{ data.currentSite.title || data.currentSite.name || 'untitled' }}
      <bt-icon-switch />
      <div>
        @for (site of data.sites; track site.name) {
          <div>
            <label>
              <input
                type="radio"
                name="selectedSiteSlug"
                [class.hidden]="data.sites.length < 2"
                [value]="site.name"
                [(ngModel)]="data.selectedSiteSlug"
              />

              {{ site.title || site.name || 'untitled' }}
            </label>
          </div>
        }
      </div>
    </div>

    <div class="bt-popup-action-wrap">
      <button (click)="dialogRef.close(data.selectedSiteSlug)" class="button">
        Swap
      </button>
      <button (click)="dialogRef.close()" class="button inverse">Cancel</button>
    </div>
  `,
  standalone: false,
})
export class SitesSwapContentsComponent {
  dialogRef = inject<DialogRef<string>>(DialogRef<string>);
  data = inject(DIALOG_DATA);
  constructor() {}
}
