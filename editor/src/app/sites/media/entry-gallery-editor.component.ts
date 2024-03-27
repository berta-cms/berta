import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Animations } from '../../shared/animations';
import {
  SectionEntry,
  SectionEntryGalleryFile,
} from '../sections/entries/entries-state/section-entries-state.model';
import {
  AddEntryGalleryFileAction,
  DeleteEntryGalleryFileAction,
  OrderEntryGalleryFilesAction,
  UpdateEntryGalleryFileAction,
} from '../sections/entries/entries-state/section-entries.actions';
import { SiteStateModel } from '../sites-state/site-state.model';
import { PopupService } from '../../../app/popup/popup.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SiteSectionsState } from '../sections/sections-state/site-sections.state';
import { SectionEntriesState } from '../sections/entries/entries-state/section-entries.state';
import { SiteSectionStateModel } from '../sections/sections-state/site-sections-state.model';
import { SitesState } from '../sites-state/sites.state';

@Component({
  selector: 'berta-entry-gallery-editor',
  template: `
    <aside>
      <div
        *ngIf="selectedFile"
        class="setting-group"
        [class.is-expanded]="fileSettingsIsOpen"
      >
        <h3
          (click)="fileSettingsIsOpen = !fileSettingsIsOpen"
          class="hoverable"
        >
          File setting
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
        <div class="settings" [@isExpanded]="fileSettingsIsOpen">
          <berta-setting
            [setting]="{ slug: '@value', value: selectedFile['@value'] }"
            [config]="{
              title: 'Caption',
              format: 'richtext',
              enabledOnUpdate: true
            }"
            [error]="''"
            (update)="updateFile($event)"
          >
          </berta-setting>
          <berta-setting
            *ngIf="selectedFile['@attributes']['type'] === 'video'"
            [setting]="{
              slug: '@attributes/autoplay',
              value: selectedFile['@attributes']['autoplay']
            }"
            [config]="{
              title: 'Autoplay',
              format: 'toggle',
              values: [
                { title: '', value: '0' },
                { title: '', value: '1' }
              ],
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateFile($event)"
          >
          </berta-setting>
        </div>
      </div>
    </aside>
    <div class="content" *ngIf="currentSection && currentEntry">
      <h3>
        Gallery editor / entry #{{ currentEntry.id }} /
        {{ currentSection.title || 'Untitled' }}
      </h3>

      <div class="entry-gallery-items">
        <div
          *ngFor="
            let file of currentEntry.mediaCacheData.file;
            trackBy: identifyGalleryItem
          "
          class="entry-gallery-item"
          [class.selected]="file === selectedFile"
          ngSortgridItem
          [ngSortGridGroup]="currentEntry.sectionName + currentEntry.id"
          [ngSortGridItems]="currentEntry.mediaCacheData.file"
          (sorted)="reorder($event)"
          (click)="setSelectedFile(file)"
        >
          <div *ngIf="file['@attributes'].type === 'image'" class="media image">
            <img
              draggable="false"
              src="{{ currentSite.mediaUrl }}/{{
                currentEntry.mediafolder
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
            (click)="deleteItem($event, file['@attributes'].src)"
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
  animations: [Animations.slideToggle],
})
export class EntryGalleryEditorComponent implements OnInit {
  @Select(SitesState.getCurrentSite)
  currentSite$: Observable<SiteStateModel>;
  currentSite: SiteStateModel;
  currentSection: SiteSectionStateModel;
  currentEntry: SectionEntry;
  selectedFile: SectionEntryGalleryFile;
  fileSettingsIsOpen = true;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private popupService: PopupService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        filter(
          (p) =>
            p['params']['section'] !== undefined &&
            p['params']['entry_id'] !== undefined
        )
      )
      .subscribe((params) => {
        const sectionName = params['params']['section'];
        const entryId = params['params']['entry_id'];

        combineLatest([
          this.currentSite$,
          this.store.select(SiteSectionsState.getCurrentSiteSections).pipe(
            filter((s) => s.length > 0),
            map((s) => s.find((s) => s.name === sectionName))
          ),
          this.store.select(SectionEntriesState.getCurrentSiteEntries).pipe(
            filter((e) => e.length > 0),
            map((e) =>
              e.find((e) => e.sectionName === sectionName && e.id === entryId)
            )
          ),
        ]).subscribe(([site, section, entry]) => {
          this.currentSite = site;
          this.currentSection = section;
          this.currentEntry = entry;

          this.setSelectedFile();
        });
      });
  }

  updateFile(e) {
    const index = this.currentEntry['mediaCacheData']['file'].findIndex(
      (f) => f === this.selectedFile
    );
    const path = `${this.currentSite.name}/entry/${this.currentEntry.sectionName}/${this.currentEntry.id}/mediaCacheData/file/${index}/${e.field}`;
    this.store.dispatch(new UpdateEntryGalleryFileAction(path, e.value));
  }

  setSelectedFile(selectedFile: SectionEntryGalleryFile = null) {
    if (this.currentEntry.mediaCacheData.file.length === 0) {
      this.selectedFile = null;
      return;
    }

    const lookupFile = selectedFile || this.selectedFile;
    if (lookupFile) {
      const selectedFile = this.currentEntry.mediaCacheData.file.find(
        (f) => f['@attributes'].src === lookupFile['@attributes'].src
      );

      if (selectedFile) {
        this.selectedFile = selectedFile;
        return;
      }
    }

    this.selectedFile = this.currentEntry.mediaCacheData.file[0];
  }

  uploadFiles(files: File[]) {
    files.map((file) => {
      this.store.dispatch(
        new AddEntryGalleryFileAction(
          this.currentSite.name,
          this.currentEntry.sectionName,
          this.currentEntry.id,
          file
        )
      );
    });
  }

  identifyGalleryItem(_, item: SectionEntryGalleryFile) {
    return item['@attributes'].src;
  }

  reorder(itemList: SectionEntryGalleryFile[]) {
    if (itemList.length < 2) {
      return;
    }
    this.store.dispatch(
      new OrderEntryGalleryFilesAction(
        this.currentSite.name,
        this.currentEntry.sectionName,
        this.currentEntry.id,
        itemList.map((f) => f['@attributes'].src)
      )
    );
  }

  deleteItem(event: PointerEvent, file: string) {
    event.stopPropagation();
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
                this.currentSite.name,
                this.currentEntry.sectionName,
                this.currentEntry.id,
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
