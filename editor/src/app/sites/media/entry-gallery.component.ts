import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { SectionEntry } from '../sections/entries/entries-state/section-entries-state.model';
import { AppState } from '../../../app/app-state/app.state';
import { SiteStateModel } from '../sites-state/site-state.model';

@Component({
  selector: 'berta-entry-gallery',
  template: `
    <div class="entry-gallery">
      <div class="header">
        entry #{{ entry.id }}
        @if (entry && entry.tags && entry.tags.tag.length > 0) {
        <span>({{ entry.tags.tag.join(', ') }})</span>
        }
      </div>
      <div class="entry-gallery-items">
        @for (file of entry.mediaCacheData.file; track file) {
        <div class="entry-gallery-item">
          @if (file['@attributes'].type === 'image') {
          <div class="media image">
            <img
              src="{{ currentSite.mediaUrl }}/{{
                entry.mediafolder
              }}/_smallthumb_{{ file['@attributes'].src }}"
            />
          </div>
          } @if (file['@attributes'].type === 'video') {
          <div class="media video">
            <video
              [attr.poster]="
                file['@attributes'].poster_frame
                  ? currentSite.mediaUrl +
                    '/' +
                    entry.mediafolder +
                    '/' +
                    file['@attributes'].poster_frame
                  : null
              "
            >
              <source
                src="{{ currentSite.mediaUrl }}/{{ entry.mediafolder }}/{{
                  file['@attributes'].src
                }}"
                type="video/mp4"
              />
            </video>
          </div>
          }
        </div>
        }
      </div>
      <berta-route-button
        [label]="'Edit gallery'"
        [route]="'/media/gallery/' + entry.sectionName + '/' + entry.id"
      ></berta-route-button>
    </div>
  `,
  standalone: false,
})
export class EntryGalleryComponent {
  @Input('entry') entry: SectionEntry;
  @Input('currentSite') currentSite: SiteStateModel;

  site = this.store.selectSnapshot(AppState.getSite);
  mediaUrl = `/storage/${this.site ? `-sites/${this.site}/` : ''}media`;

  constructor(private store: Store) {}
}
