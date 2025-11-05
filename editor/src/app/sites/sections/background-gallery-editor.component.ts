import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, combineLatest, Subject } from 'rxjs';
import { filter, map, take, debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SitesState } from '../sites-state/sites.state';
import { SiteStateModel } from '../sites-state/site-state.model';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SiteSectionBackgroundFile,
  SiteSectionStateModel,
} from './sections-state/site-sections-state.model';
import { SiteSectionsState } from '../sections/sections-state/site-sections.state';
import {
  AddSiteSectionBackgroundFileAction,
  DeleteSiteSectionBackgroundFileAction,
  OrderSiteSectionBackgroundAction,
  UpdateSectionBackgroundFileAction,
  UpdateSiteSectionAction,
  UpdateSiteSectionByPathAction,
} from './sections-state/site-sections.actions';
import { PopupService } from '../../../app/popup/popup.service';
import type { NgsgOrderChange } from 'ng-sortgrid';

@Component({
  selector: 'berta-background-gallery-editor',
  template: `
    @if (currentSection) {
      <aside>
        @if (selectedFile) {
          <div class="setting-group" [class.is-expanded]="fileSettingsIsOpen">
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
            <div class="settings">
              <div>
                <berta-setting
                  [setting]="{ slug: '@value', value: selectedFile['@value'] }"
                  [config]="{
                    title: 'Caption for ' + selectedFile['@attributes']['src'],
                    placeholder: 'Enter item caption here...',
                    format: 'richtext',
                    enabledOnUpdate: true,
                  }"
                  [error]="''"
                  (update)="updateFile($event)"
                >
                </berta-setting>
              </div>
            </div>
          </div>
        }
        <div class="setting-group" [class.is-expanded]="gallerySettingsIsOpen">
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
          <div class="settings">
            <div>
              <berta-setting
                [setting]="{
                  slug: 'image_size',
                  value:
                    currentSection.mediaCacheData &&
                    currentSection.mediaCacheData['@attributes'] &&
                    currentSection.mediaCacheData['@attributes'].image_size
                      ? currentSection.mediaCacheData['@attributes'].image_size
                      : 'medium',
                }"
                [config]="{
                  title: 'Image size',
                  format: 'select',
                  values: [
                    { title: 'Large', value: 'large' },
                    { title: 'Medium', value: 'medium' },
                    { title: 'Small', value: 'small' },
                  ],
                  enabledOnUpdate: true,
                }"
                [error]="''"
                [disabled]="false"
                (update)="updateGallerySettings($event)"
              >
              </berta-setting>
              <berta-setting
                [setting]="{
                  slug: 'autoplay',
                  value:
                    currentSection.mediaCacheData &&
                    currentSection.mediaCacheData['@attributes'] &&
                    currentSection.mediaCacheData['@attributes'].autoplay
                      ? currentSection.mediaCacheData['@attributes'].autoplay
                      : '0',
                }"
                [config]="{
                  title: 'Autoplay seconds',
                  format: 'text',
                  enabledOnUpdate: true,
                  validation: 'zero_or_positive_integer',
                }"
                [error]="''"
                [disabled]="false"
                (update)="updateGallerySettings($event)"
              >
              </berta-setting>
              <berta-setting
                [setting]="{
                  slug: 'sectionBgColor',
                  value: currentSection.sectionBgColor
                    ? currentSection.sectionBgColor
                    : '',
                }"
                [config]="{
                  title: 'Background color',
                  format: 'color',
                  enabledOnUpdate: true,
                }"
                [error]="''"
                [disabled]="false"
                (update)="updateSectionSettings($event)"
              >
              </berta-setting>
              <berta-setting
                [setting]="{
                  slug: 'caption_color',
                  value:
                    currentSection.mediaCacheData &&
                    currentSection.mediaCacheData['@attributes'] &&
                    currentSection.mediaCacheData['@attributes'].caption_color
                      ? currentSection.mediaCacheData['@attributes']
                          .caption_color
                      : '',
                }"
                [config]="{
                  title: 'Caption text color',
                  format: 'color',
                  enabledOnUpdate: true,
                }"
                [error]="''"
                [disabled]="false"
                (update)="updateGallerySettings($event)"
              >
              </berta-setting>
              <berta-setting
                [setting]="{
                  slug: 'caption_bg_color',
                  value:
                    currentSection.mediaCacheData &&
                    currentSection.mediaCacheData['@attributes'] &&
                    currentSection.mediaCacheData['@attributes']
                      .caption_bg_color
                      ? currentSection.mediaCacheData['@attributes']
                          .caption_bg_color
                      : '',
                }"
                [config]="{
                  title: 'Caption background color',
                  format: 'color',
                  enabledOnUpdate: true,
                }"
                [error]="''"
                [disabled]="false"
                (update)="updateGallerySettings($event)"
              >
              </berta-setting>
              <berta-setting
                [setting]="{
                  slug: 'hide_navigation',
                  value:
                    currentSection.mediaCacheData &&
                    currentSection.mediaCacheData['@attributes'] &&
                    currentSection.mediaCacheData['@attributes'].hide_navigation
                      ? currentSection.mediaCacheData['@attributes']
                          .hide_navigation
                      : 'no',
                }"
                [config]="{
                  title: 'Hide navigation arrows',
                  format: 'toggle',
                  values: [
                    { title: '', value: 'yes' },
                    { title: '', value: 'no' },
                  ],
                  enabledOnUpdate: true,
                }"
                [error]="''"
                [disabled]="false"
                (update)="updateGallerySettings($event)"
              >
              </berta-setting>
              <berta-setting
                [setting]="{
                  slug: 'animation',
                  value:
                    currentSection.mediaCacheData &&
                    currentSection.mediaCacheData['@attributes'] &&
                    currentSection.mediaCacheData['@attributes'].animation
                      ? currentSection.mediaCacheData['@attributes'].animation
                      : 'enabled',
                }"
                [config]="{
                  title: 'Animation',
                  format: 'toggle',
                  values: [
                    { title: '', value: 'enabled' },
                    { title: '', value: 'disabled' },
                  ],
                  enabledOnUpdate: true,
                }"
                [error]="''"
                [disabled]="false"
                (update)="updateGallerySettings($event)"
              >
              </berta-setting>
              <berta-setting
                [setting]="{
                  slug: 'fade_content',
                  value:
                    currentSection.mediaCacheData &&
                    currentSection.mediaCacheData['@attributes'] &&
                    currentSection.mediaCacheData['@attributes'].fade_content
                      ? currentSection.mediaCacheData['@attributes']
                          .fade_content
                      : 'disabled',
                }"
                [config]="{
                  title: 'Fade content',
                  format: 'toggle',
                  values: [
                    { title: '', value: 'enabled' },
                    { title: '', value: 'disabled' },
                  ],
                  enabledOnUpdate: true,
                }"
                [error]="''"
                [disabled]="false"
                (update)="updateGallerySettings($event)"
              >
              </berta-setting>
            </div>
          </div>
        </div>
      </aside>
    }
    @if (currentSection) {
      <div class="content">
        <div class="header">
          <h3>
            Background gallery editor / {{ currentSection.title || 'Untitled' }}
          </h3>
          <button class="close" (click)="closeEditor()">&#10006;</button>
        </div>
        <div class="entry-gallery-items">
          @for (
            file of currentSection.mediaCacheData?.file;
            track identifyGalleryItem($index, file)
          ) {
            <div
              class="entry-gallery-item"
              [class.selected]="file === selectedFile"
              ngSortgridItem
              [ngSortGridItems]="currentSection.mediaCacheData.file"
              (sorted)="reorder($event)"
              (click)="onFileClick(file)"
            >
              <div class="media image">
                <img
                  draggable="false"
                  src="{{ currentSite.mediaUrl }}/{{
                    currentSection.mediafolder
                  }}/_smallthumb_{{ file['@attributes'].src }}"
                />
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
          }
          <berta-files-input
            [accept]="'image/*'"
            [label]="'add items'"
            [disabled]="disabled"
            [errors]="uploadFilesErrors"
            (update)="uploadFiles($event)"
          ></berta-files-input>
        </div>
      </div>
    }
  `,
  standalone: false,
})
export class BackgroundGalleryEditorComponent implements OnInit {
  private readonly currentSite$: Observable<SiteStateModel>;
  private readonly destroyRef = inject(DestroyRef);
  private fileSelectionSubject$ = new Subject<SiteSectionBackgroundFile>();

  currentSite: SiteStateModel;
  currentSection: SiteSectionStateModel;
  selectedFile: SiteSectionBackgroundFile;
  uploadFilesErrors: string[] = [];
  fileSettingsIsOpen: boolean = true;
  gallerySettingsIsOpen: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private popupService: PopupService,
  ) {
    this.currentSite$ = this.store.select(SitesState.getCurrentSite);
  }

  ngOnInit() {
    // Debounce file selection to allow pending updates to complete first
    this.fileSelectionSubject$
      .pipe(
        debounceTime(200), // Wait 200ms for any pending updates
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((file) => {
        this.setSelectedFile(file);
      });

    this.route.paramMap
      .pipe(
        filter((p) => p['params']['section'] !== undefined),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((params) => {
        const sectionName = params['params']['section'];

        combineLatest([
          this.currentSite$,
          this.store.select(SiteSectionsState.getCurrentSiteSections).pipe(
            filter((s) => s.length > 0),
            map((s) => s.find((s) => s.name === sectionName)),
          ),
        ])
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(([site, section]) => {
            this.currentSite = site;
            this.currentSection = section;
            this.setSelectedFile();
          });
      });
  }

  onFileClick(file: SiteSectionBackgroundFile) {
    // Emit to the debounced subject instead of calling setSelectedFile directly
    this.fileSelectionSubject$.next(file);
  }

  setSelectedFile(selectedFile: SiteSectionBackgroundFile = null) {
    if (
      !this.currentSection ||
      !this.currentSection.mediaCacheData ||
      !this.currentSection.mediaCacheData.file ||
      this.currentSection.mediaCacheData.file.length === 0
    ) {
      this.selectedFile = null;
      return;
    }

    const lookupFile = selectedFile || this.selectedFile;
    if (lookupFile) {
      const selectedFile = this.currentSection.mediaCacheData.file.find(
        (f) => f['@attributes'].src === lookupFile['@attributes'].src,
      );

      if (selectedFile) {
        this.selectedFile = selectedFile;
        return;
      }
    }

    this.selectedFile = this.currentSection.mediaCacheData.file[0];
  }

  updateGallerySettings(e) {
    const path = `${this.currentSite.name}/section/${this.currentSection.order}/mediaCacheData/@attributes/${e.field}`;
    this.store.dispatch(new UpdateSiteSectionByPathAction(path, e.value));
  }

  updateSectionSettings(e) {
    this.store.dispatch(
      new UpdateSiteSectionAction(
        this.currentSite.name,
        this.currentSection.order,
        { [e.field]: e.value },
      ),
    );
  }

  updateFile(e) {
    const index = this.currentSection['mediaCacheData']['file'].findIndex(
      (f) => f === this.selectedFile,
    );
    const path = `${this.currentSite.name}/section/${this.currentSection.order}/mediaCacheData/file/${index}/${e.field}`;
    this.store.dispatch(new UpdateSectionBackgroundFileAction(path, e.value));
  }

  reorder(orderChangeEvent: NgsgOrderChange<SiteSectionBackgroundFile>) {
    if (orderChangeEvent.currentOrder.length < 2) {
      return;
    }
    this.store.dispatch(
      new OrderSiteSectionBackgroundAction(
        this.currentSite.name,
        this.currentSection.name,
        orderChangeEvent.currentOrder.map((f) => f['@attributes'].src),
      ),
    );
  }

  deleteItem(event: MouseEvent, file: string) {
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
              new DeleteSiteSectionBackgroundFileAction(
                this.currentSite.name,
                this.currentSection.name,
                file,
              ),
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

  uploadFiles(files: File[]) {
    this.uploadFilesErrors = [];

    files.map((file) => {
      this.store
        .dispatch(
          new AddSiteSectionBackgroundFileAction(
            this.currentSite.name,
            this.currentSection.name,
            file,
          ),
        )
        .pipe(take(1))
        .subscribe(
          () => {},
          (error) => {
            this.uploadFilesErrors.push(error.error.error);
          },
        );
    });
  }

  identifyGalleryItem(_, item: SiteSectionBackgroundFile) {
    return item['@attributes'].src;
  }

  closeEditor() {
    this.router.navigate(['/'], { queryParamsHandling: 'preserve' });
  }
}
