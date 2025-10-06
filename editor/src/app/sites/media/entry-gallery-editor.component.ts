import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import type { NgsgOrderChange } from 'ng-sortgrid';
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
  UpdateEntryGalleryVideoPosterAction,
  UpdateSectionEntryAction,
} from '../sections/entries/entries-state/section-entries.actions';
import { SiteStateModel } from '../sites-state/site-state.model';
import { PopupService } from '../../../app/popup/popup.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { SiteSectionsState } from '../sections/sections-state/site-sections.state';
import { SectionEntriesState } from '../sections/entries/entries-state/section-entries.state';
import { SiteSectionStateModel } from '../sections/sections-state/site-sections-state.model';
import { SitesState } from '../sites-state/sites.state';
import { SiteSettingsState } from '../settings/site-settings.state';

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
          Item settings
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
              title: 'Caption for ' + selectedFile['@attributes']['src'],
              placeholder: 'Enter item caption here...',
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
              slug: '@attributes/poster_frame',
              value: selectedFile['@attributes']['poster_frame']
            }"
            [config]="{
              title: 'Poster frame',
              format: 'image',
              enabledOnUpdate: true,
              disableRemove: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateVideoPosterFile($event)"
          ></berta-setting>

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

      <div
        *ngIf="currentEntry"
        class="setting-group"
        [class.is-expanded]="gallerySettingsIsOpen"
      >
        <h3
          (click)="gallerySettingsIsOpen = !gallerySettingsIsOpen"
          class="hoverable"
        >
          Gallery settings
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
        <div class="settings" [@isExpanded]="gallerySettingsIsOpen">
          <berta-setting
            [setting]="{
              slug: 'type',
              value: currentEntry['mediaCacheData']['@attributes'].type
            }"
            [config]="{
              title: 'Gallery type',
              format: 'select',
              values: [
                { title: 'Slideshow', value: 'slideshow' },
                { title: 'Row', value: 'row' },
                { title: 'Column', value: 'column' },
                { title: 'Pile', value: 'pile' },
                { title: 'Link', value: 'link' }
              ],
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateGallerySettings($event)"
          >
          </berta-setting>

          <berta-setting
            *ngIf="
              currentEntry['mediaCacheData']['@attributes'].type === 'slideshow'
            "
            [setting]="{
              slug: 'autoplay',
              value:
                currentEntry['mediaCacheData']['@attributes'].autoplay || '0'
            }"
            [config]="{
              title: 'Autoplay seconds',
              format: 'text',
              enabledOnUpdate: true,
              validation: 'zero_or_positive_integer'
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateGallerySettings($event)"
          >
          </berta-setting>

          <berta-setting
            *ngIf="
              currentEntry['mediaCacheData']['@attributes'].type === 'slideshow'
            "
            [setting]="{
              slug: 'slide_numbers_visible',
              value:
                currentEntry['mediaCacheData']['@attributes']
                  .slide_numbers_visible || 'yes'
            }"
            [config]="{
              title: 'Show image numbers',
              format: 'toggle',
              values: [
                { title: '', value: 'yes' },
                { title: '', value: 'no' }
              ],
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateGallerySettings($event)"
          >
          </berta-setting>

          <berta-setting
            *ngIf="
              currentEntry['mediaCacheData']['@attributes'].type ===
                'slideshow' && templateName === 'messy'
            "
            [setting]="{
              slug: 'gallery_width_by_widest_slide',
              value:
                currentEntry['mediaCacheData']['@attributes']
                  .gallery_width_by_widest_slide || 'no'
            }"
            [config]="{
              title: 'Width by widest slide',
              format: 'toggle',
              values: [
                { title: '', value: 'yes' },
                { title: '', value: 'no' }
              ],
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateGallerySettings($event)"
          >
          </berta-setting>

          <berta-setting
            *ngIf="currentEntry['mediaCacheData']['@attributes'].type === 'row'"
            [setting]="{
              slug: 'row_gallery_padding',
              value:
                currentEntry['mediaCacheData']['@attributes']
                  .row_gallery_padding || '0'
            }"
            [config]="{
              title: 'Image padding',
              format: 'text',
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateGallerySettings($event)"
          >
          </berta-setting>

          <berta-setting
            *ngIf="
              currentEntry['mediaCacheData']['@attributes'].type === 'link'
            "
            [setting]="{
              slug: 'link_address',
              value:
                currentEntry['mediaCacheData']['@attributes'].link_address || ''
            }"
            [config]="{
              title: 'Link address',
              format: 'url',
              placeholder: 'https://example.com',
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateGallerySettings($event)"
          >
          </berta-setting>

          <berta-setting
            *ngIf="
              currentEntry['mediaCacheData']['@attributes'].type === 'link'
            "
            [setting]="{
              slug: 'linkTarget',
              value:
                currentEntry['mediaCacheData']['@attributes'].linkTarget ||
                '_self'
            }"
            [config]="{
              title: 'Open in',
              format: 'select',
              values: [
                { title: 'Same window', value: '_self' },
                { title: 'New window', value: '_blank' }
              ],
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateGallerySettings($event)"
          >
          </berta-setting>

          <berta-setting
            [setting]="{
              slug: 'fullscreen',
              value:
                currentEntry['mediaCacheData']['@attributes'].fullscreen ||
                'yes'
            }"
            [config]="{
              title: 'Fullscreen mode',
              format: 'toggle',
              values: [
                { title: '', value: 'yes' },
                { title: '', value: 'no' }
              ],
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateGallerySettings($event)"
          >
          </berta-setting>

          <berta-setting
            [setting]="{
              slug: 'size',
              value:
                currentEntry['mediaCacheData']['@attributes'].size || 'large'
            }"
            [config]="{
              title: 'File size',
              format: 'select',
              values: [
                { title: 'Large', value: 'large' },
                { title: 'Medium', value: 'medium' },
                { title: 'Small', value: 'small' }
              ],
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateGallerySettings($event)"
          >
          </berta-setting>
        </div>
      </div>
    </aside>
    <div class="content" *ngIf="currentSection && currentEntry">
      <div class="header">
        <h3>
          Gallery editor / entry #{{ currentEntry.id }} /
          {{ currentSection.title || 'Untitled' }}
        </h3>
        <button class="close" (click)="closeEditor()">&#10006;</button>
      </div>

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
            <video
              [attr.poster]="
                file['@attributes'].poster_frame
                  ? currentSite.mediaUrl +
                    '/' +
                    currentEntry.mediafolder +
                    '/' +
                    file['@attributes'].poster_frame
                  : null
              "
            >
              <source
                src="{{ currentSite.mediaUrl }}/{{
                  currentEntry.mediafolder
                }}/{{ file['@attributes'].src }}"
                type="video/mp4"
              />
            </video>
          </div>
          <button title="move" class="action reorder">
            <bt-icon-move></bt-icon-move>
          </button>
          <button
            *ngIf="file['@attributes'].type === 'image'"
            title="crop"
            class="action crop"
            (click)="openCropItemPage($event, file['@attributes'].src)"
          >
            <bt-icon-crop></bt-icon-crop>
          </button>
          <button
            title="delete"
            class="action delete"
            (click)="deleteItem($event, file['@attributes'].src)"
          >
            <bt-icon-delete></bt-icon-delete>
          </button>
        </div>

        <berta-files-input
          [accept]="'image/*, video/mp4'"
          [label]="'add items'"
          [disabled]="disabled"
          [errors]="uploadFilesErrors"
          (update)="uploadFiles($event)"
        ></berta-files-input>
      </div>
    </div>
  `,
    animations: [Animations.slideToggle],
    standalone: false
})
export class EntryGalleryEditorComponent implements OnInit {
  @Select(SitesState.getCurrentSite)
  currentSite$: Observable<SiteStateModel>;
  currentSite: SiteStateModel;
  currentSection: SiteSectionStateModel;
  currentEntry: SectionEntry;
  templateName: string;
  selectedFile: SectionEntryGalleryFile;
  fileSettingsIsOpen = true;
  gallerySettingsIsOpen = true;
  uploadFilesErrors: string[] = [];

  constructor(
    private router: Router,
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
          this.store
            .select(SiteSettingsState.getCurrentSiteTemplate)
            .pipe(filter((template) => !!template)),
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
        ]).subscribe(([site, template, section, entry]) => {
          this.currentSite = site;
          this.currentSection = section;
          this.currentEntry = entry;
          this.templateName = template.split('-').shift();

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

  updateVideoPosterFile(e) {
    this.store.dispatch(
      new UpdateEntryGalleryVideoPosterAction(
        this.currentSite.name,
        this.currentEntry.sectionName,
        this.currentEntry.id,
        this.selectedFile['@attributes'].src,
        e.value
      )
    );
  }

  updateGallerySettings(e) {
    const path = `${this.currentSite.name}/entry/${this.currentEntry.sectionName}/${this.currentEntry.id}/mediaCacheData/@attributes/${e.field}`;
    this.store.dispatch(new UpdateSectionEntryAction(path, e.value));
  }

  setSelectedFile(selectedFile: SectionEntryGalleryFile = null) {
    if (
      !this.currentEntry ||
      this.currentEntry.mediaCacheData.file.length === 0
    ) {
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
    this.uploadFilesErrors = [];

    files.map((file) => {
      this.store
        .dispatch(
          new AddEntryGalleryFileAction(
            this.currentSite.name,
            this.currentEntry.sectionName,
            this.currentEntry.id,
            file
          )
        )
        .pipe(take(1))
        .subscribe(
          () => {},
          (error) => {
            this.uploadFilesErrors.push(error.error.error);
          }
        );
    });
  }

  identifyGalleryItem(_, item: SectionEntryGalleryFile) {
    return item['@attributes'].src;
  }

  reorder(orderChangeEvent: NgsgOrderChange<SectionEntryGalleryFile>) {
    if (orderChangeEvent.currentOrder.length < 2) {
      return;
    }
    this.store.dispatch(
      new OrderEntryGalleryFilesAction(
        this.currentSite.name,
        this.currentEntry.sectionName,
        this.currentEntry.id,
        orderChangeEvent.currentOrder.map((f) => f['@attributes'].src)
      )
    );
  }

  openCropItemPage(event: PointerEvent, fileName: string) {
    event.stopPropagation();
    const image_order = this.currentEntry.mediaCacheData.file.findIndex(
      (file) => file['@attributes'].src === fileName
    );
    const url = `/media/image/${this.currentEntry.sectionName}/${this.currentEntry.id}/${image_order}`;
    this.router.navigate([url], { queryParamsHandling: 'preserve' });
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

  closeEditor() {
    this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
  }
}
