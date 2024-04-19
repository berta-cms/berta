import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Animations } from '../../shared/animations';
import {
  SectionEntry,
  SectionEntryGalleryFile,
} from '../sections/entries/entries-state/section-entries-state.model';
import { UpdateEntryGalleryImageCropAction } from '../sections/entries/entries-state/section-entries.actions';
import { SiteStateModel } from '../sites-state/site-state.model';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { SectionEntriesState } from '../sections/entries/entries-state/section-entries.state';
import { SiteSectionStateModel } from '../sections/sections-state/site-sections-state.model';
import { SitesState } from '../sites-state/sites.state';
import { HttpClient } from '@angular/common/http';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'berta-entry-gallery-image-editor',
  template: `
    <aside>
      <div class="setting-group" [class.is-expanded]="fileSettingsIsOpen">
        <h3
          (click)="fileSettingsIsOpen = !fileSettingsIsOpen"
          class="hoverable"
        >
          File settings
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
          <div class="setting">
            <button
              *ngIf="cropperIsReady"
              type="button"
              class="button"
              [class.disabled]="!canCrop"
              (click)="cropImage()"
            >
              Crop
            </button>
            <button
              type="button"
              class="button inverse"
              (click)="navigateBack()"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </aside>
    <div class="content">
      <div>
        <image-cropper
          [imageFile]="galleryFileBlob"
          [maintainAspectRatio]="false"
          format="png"
          (imageCropped)="imageCropped($event)"
          (cropperReady)="cropperReady()"
        ></image-cropper>
      </div>
    </div>
  `,
  animations: [Animations.slideToggle],
})
export class EntryGalleryImageEditorComponent implements OnInit {
  @Select(SitesState.getCurrentSite) currentSite$: Observable<SiteStateModel>;
  site: SiteStateModel;
  sectionName: SiteSectionStateModel['name'];
  entryId: SectionEntry['id'];
  imageOrder: number;
  galleryFile: SectionEntryGalleryFile;
  galleryFileBlob: Blob;
  fileSettingsIsOpen = true;
  cropperIsReady = false;
  canCrop = false;
  imageCroppedEvent: ImageCroppedEvent | undefined;

  constructor(
    private _location: Location,
    private store: Store,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        filter(
          (p) =>
            p['params']['section'] !== undefined &&
            p['params']['entry_id'] !== undefined &&
            p['params']['image_order'] !== undefined
        )
      )
      .subscribe((params) => {
        this.sectionName = params['params']['section'];
        this.entryId = params['params']['entry_id'];
        this.imageOrder = params['params']['image_order'];
        combineLatest([
          this.currentSite$,
          this.store.select(SectionEntriesState.getCurrentSiteEntries).pipe(
            filter((e) => e.length > 0),
            map((e) =>
              e.find(
                (e) =>
                  e.sectionName === this.sectionName && e.id === this.entryId
              )
            )
          ),
        ]).subscribe(([site, entry]) => {
          this.site = site;
          this.galleryFile = entry.mediaCacheData.file[this.imageOrder];

          const path = `${site.mediaUrl}/${entry.mediafolder}/${this.galleryFile['@attributes'].src}`;

          this.http
            .get(path, { responseType: 'blob' })
            .subscribe((imageBlob) => {
              this.galleryFileBlob = imageBlob;
            });
        });
      });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.imageCroppedEvent = event;
    this.canCrop =
      event.width !== parseInt(this.galleryFile['@attributes'].width) ||
      event.height !== parseInt(this.galleryFile['@attributes'].height);
  }

  cropperReady() {
    this.cropperIsReady = true;
  }

  navigateBack() {
    this._location.back();
  }

  cropImage() {
    this.store.dispatch(
      new UpdateEntryGalleryImageCropAction(
        this.site.name,
        this.sectionName,
        this.entryId,
        this.imageOrder.toString(),
        {
          x: this.imageCroppedEvent.imagePosition.x1,
          y: this.imageCroppedEvent.imagePosition.y1,
          width: this.imageCroppedEvent.width,
          height: this.imageCroppedEvent.height,
        }
      )
    );
  }
}
