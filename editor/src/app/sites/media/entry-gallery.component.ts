import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  SectionEntry,
  SectionEntryGalleryFile,
} from '../sections/entries/entries-state/section-entries-state.model';
import { AppState } from '../../../app/app-state/app.state';
import {
  AddEntryGalleryFileAction,
  DeleteEntryGalleryFileAction,
  OrderEntryGalleryFilesAction,
} from '../sections/entries/entries-state/section-entries.actions';
import { SiteStateModel } from '../sites-state/site-state.model';
import { PopupService } from '../../../app/popup/popup.service';

@Component({
  selector: 'berta-entry-gallery',
  template: `
    <div class="entry-gallery">
      entry #{{ entry.id }}

      <div
        class="entry-gallery-items"
        dragula="entryItems"
        (dragulaModelChange)="reorder($event)"
        [(dragulaModel)]="itemList"
      >
        <div *ngFor="let file of itemList" class="entry-gallery-item">
          <div *ngIf="file['@attributes'].type === 'image'" class="media image">
            <img
              src="{{ currentSite.mediaUrl }}/{{
                entry.mediafolder
              }}/_smallthumb_{{ file['@attributes'].src }}"
            />
          </div>
          <div *ngIf="file['@attributes'].type === 'video'" class="media video">
            [ video ]
          </div>
          <button title="move" class="action reorder">
            <bt-icon-move></bt-icon-move>
          </button>
          <button
            title="delete"
            class="action delete"
            (click)="deleteItem(file['@attributes'].src)"
          >
            <bt-icon-delete></bt-icon-delete>
          </button>
        </div>
      </div>
      <berta-files-input
        [accept]="'image/*, video/mp4'"
        [disabled]="disabled"
        [errors]="errors"
        (update)="uploadFiles($event)"
      ></berta-files-input>
    </div>
  `,
})
export class EntryGalleryComponent implements OnInit {
  @Input('entry') entry: SectionEntry;
  @Input('currentSite') currentSite: SiteStateModel;

  itemList: SectionEntryGalleryFile[];
  site = this.store.selectSnapshot(AppState.getSite);
  mediaUrl = `/storage/${this.site ? `-sites/${this.site}/` : ''}media`;

  constructor(private store: Store, private popupService: PopupService) {}

  ngOnInit() {
    this.itemList = [...this.entry.mediaCacheData.file];
  }

  uploadFiles(files: File[]) {
    files.map((file) => {
      this.store.dispatch(
        new AddEntryGalleryFileAction(
          this.site,
          this.entry.sectionName,
          this.entry.id,
          file
        )
      );
    });
  }

  reorder(itemList: SectionEntryGalleryFile[]) {
    this.store.dispatch(
      new OrderEntryGalleryFilesAction(
        this.site,
        this.entry.sectionName,
        this.entry.id,
        itemList.map((f) => f['@attributes'].src)
      )
    );
  }

  deleteItem(file: string) {
    this.popupService.showPopup({
      type: 'warn',
      content: 'Are you sure you want to delete this item?',
      showOverlay: true,
      actions: [
        {
          type: 'primary',
          label: 'OK',
          callback: (popupService) => {
            this.store.dispatch(
              new DeleteEntryGalleryFileAction(
                this.site,
                this.entry.sectionName,
                this.entry.id,
                file
              )
            );

            popupService.closePopup();
          },
        },
        {
          label: 'Cancel',
        },
      ],
    });
  }
}
