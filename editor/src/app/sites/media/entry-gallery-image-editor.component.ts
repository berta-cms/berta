import { Component, OnInit } from '@angular/core';
import { Location, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Animations } from '../../shared/animations';
import {
  SectionEntry,
  SectionEntryGalleryFile,
} from '../sections/entries/entries-state/section-entries-state.model';
import { UpdateEntryGalleryImageCropAction } from '../sections/entries/entries-state/section-entries.actions';
import { SiteStateModel } from '../sites-state/site-state.model';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { SectionEntriesState } from '../sections/entries/entries-state/section-entries.state';
import { SiteSectionStateModel } from '../sections/sections-state/site-sections-state.model';
import { SitesState } from '../sites-state/sites.state';
import { HttpClient } from '@angular/common/http';
import {
  ImageCropperComponent,
  CropperPosition,
  ImageCroppedEvent,
  LoadedImage,
} from 'ngx-image-cropper';
import { SitesSharedModule } from '../shared/sites-shared.module';

@Component({
  selector: 'berta-entry-gallery-image-editor',
  standalone: true,
  imports: [ImageCropperComponent, NgIf, SitesSharedModule],
  template: `
    <aside>
      <div class="setting-group" [class.is-expanded]="fileSettingsIsOpen">
        <h3
          (click)="fileSettingsIsOpen = !fileSettingsIsOpen"
          class="hoverable"
        >
          Crop settings
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
            *ngIf="cropperIsReady"
            [setting]="{
              slug: 'width',
              value: size.width
            }"
            [config]="{
              title: 'Width',
              format: 'text',
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateSize($event)"
          >
          </berta-setting>
          <berta-setting
            *ngIf="cropperIsReady"
            [setting]="{
              slug: 'height',
              value: size.height
            }"
            [config]="{
              title: 'Height',
              format: 'text',
              enabledOnUpdate: true
            }"
            [error]="''"
            [disabled]="false"
            (update)="updateSize($event)"
          >
          </berta-setting>
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
          (imageLoaded)="imageLoaded($event)"
          (cropperReady)="cropperReady()"
          (imageCropped)="imageCropped($event)"
          [cropper]="position"
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
  position: CropperPosition;
  size: { width: number; height: number };

  constructor(
    private _location: Location,
    private store: Store,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.position = { x1: 0, y1: 0, x2: 0, y2: 0 };
  }

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

        this.currentSite$
          .pipe(
            switchMap((site) => {
              this.site = site;
              return this.store
                .select(SectionEntriesState.getCurrentSiteEntries)
                .pipe(
                  map(
                    (e) =>
                      e.length > 0 &&
                      e.find(
                        (e) =>
                          e.sectionName === this.sectionName &&
                          e.id === this.entryId
                      )
                  ),
                  filter((e) => !!e)
                );
            })
          )
          .subscribe((entry) => {
            this.galleryFile = entry.mediaCacheData.file[this.imageOrder];

            const path = `${this.site.mediaUrl}/${entry.mediafolder}/${this.galleryFile['@attributes'].src}`;

            this.http
              .get(path, { responseType: 'blob' })
              .subscribe((imageBlob) => {
                this.galleryFileBlob = imageBlob;
              });
          });
      });
  }

  imageLoaded(image: LoadedImage) {
    this.size = {
      width: image.original.size.width,
      height: image.original.size.height,
    };
  }

  cropperReady() {
    this.position = { x1: 0, y1: 0, x2: this.size.width, y2: this.size.height };
    this.cropperIsReady = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.imageCroppedEvent = event;
    this.canCrop =
      event.width !== parseInt(this.galleryFile['@attributes'].width) ||
      event.height !== parseInt(this.galleryFile['@attributes'].height);
    this.size = { width: event.width, height: event.height };
  }

  updateSize(e) {
    let value = parseInt(e.value);

    if (isNaN(value) || value < 1) {
      value = 1;
    }

    if (e.field === 'width') {
      const x2 =
        this.imageCroppedEvent.cropperPosition.x1 +
        value *
          (this.imageCroppedEvent.cropperPosition.x2 /
            this.imageCroppedEvent.imagePosition.x2);
      this.position = {
        ...this.imageCroppedEvent.cropperPosition,
        x2,
      };
    }

    if (e.field === 'height') {
      this.position = {
        ...this.imageCroppedEvent.cropperPosition,
        y2:
          this.imageCroppedEvent.cropperPosition.y1 +
          value *
            (this.imageCroppedEvent.cropperPosition.y2 /
              this.imageCroppedEvent.imagePosition.y2),
      };
    }
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
