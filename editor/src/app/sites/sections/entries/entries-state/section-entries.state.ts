import { concat } from 'rxjs';
import { take, switchMap, tap } from 'rxjs/operators';
import {
  State,
  Action,
  StateContext,
  NgxsOnInit,
  Actions,
  ofActionSuccessful,
  Selector,
} from '@ngxs/store';

import { assignByPath } from '../../../../../app/shared/helpers';
import { AppState } from '../../../../app-state/app.state';
import { AppStateService } from '../../../../app-state/app-state.service';
import {
  SectionEntriesStateModel,
  SectionEntry,
  SectionEntryGalleryFile,
} from './section-entries-state.model';
import {
  DeleteSiteSectionsEntriesAction,
  RenameSectionEntriesSitenameAction,
  DeleteSectionEntriesAction,
  RenameSectionEntriesAction,
  AddSiteEntriesAction,
  AddSectionEntriesAction,
  ResetSectionEntriesAction,
  InitSectionEntriesAction,
  UpdateSectionEntryFromSyncAction,
  OrderSectionEntriesFromSyncAction,
  DeleteSectionEntryFromSyncAction,
  UpdateEntryGalleryFromSyncAction,
  AddSectionEntryFromSyncAction,
  MoveSectionEntryFromSyncAction,
  DeleteSectionLastEntry,
  AddEntryGalleryFileAction,
  OrderEntryGalleryFilesAction,
  DeleteEntryGalleryFileAction,
  UpdateEntryGalleryFileAction,
  UpdateSectionEntryAction,
  UpdateEntryGalleryVideoPosterAction,
  UpdateEntryGalleryImageCropAction,
} from './section-entries.actions';
import { UserLoginAction } from '../../../../user/user.actions';
import { UpdateSiteSectionAction } from '../../sections-state/site-sections.actions';
import { UpdateSectionTagsAction } from '../../tags/section-tags.actions';
import { FileUploadService } from '../../../../../app/sites/shared/file-upload.service';

@State<SectionEntriesStateModel>({
  name: 'sectionEntries',
  defaults: {},
})
export class SectionEntriesState implements NgxsOnInit {
  @Selector([AppState.getSite])
  static getCurrentSiteEntries(state, site): SectionEntry[] {
    const entries = state[site] || [];
    return entries;
  }

  constructor(
    private actions$: Actions,
    private appStateService: AppStateService,
    private fileUploadService: FileUploadService
  ) {}

  ngxsOnInit({ dispatch }: StateContext<SectionEntriesStateModel>) {
    concat(
      this.appStateService.getInitialState('', 'sectionEntries').pipe(take(1)),
      this.actions$.pipe(
        ofActionSuccessful(UserLoginAction),
        switchMap(() => {
          return this.appStateService
            .getInitialState('', 'sectionEntries')
            .pipe(take(1));
        })
      )
    ).subscribe((sectionEntries) => {
      dispatch(new InitSectionEntriesAction(sectionEntries));
    });
  }

  @Action(AddSectionEntryFromSyncAction)
  addSectionEntryFromSync(
    { getState, patchState, dispatch }: StateContext<SectionEntriesStateModel>,
    action: AddSectionEntryFromSyncAction
  ) {
    return this.appStateService
      .sync(
        'sectionEntries',
        {
          site: action.site,
          section: action.section,
          tag: action.payload.tag,
          before_entry: action.payload.before_entry,
        },
        'POST'
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            /* This should probably be handled in sync */
            console.error(response.error_message);
          } else {
            const currentState = getState();

            patchState({
              [action.site]: [
                ...currentState[action.site].map((entry) => {
                  if (
                    entry.sectionName === action.section &&
                    entry.order >= response.entry.order
                  ) {
                    return { ...entry, order: entry.order + 1 };
                  }
                  return entry;
                }),
                response.entry,
              ],
            });

            dispatch(
              new UpdateSiteSectionAction(action.site, response.section_order, {
                '@attributes': {
                  entry_count: response.entry_count,
                },
              })
            );

            dispatch(
              new UpdateSiteSectionAction(action.site, response.section_order, {
                '@attributes': {
                  has_direct_content: response.has_direct_content,
                },
              })
            );

            if (response.tags) {
              dispatch(
                new UpdateSectionTagsAction(
                  action.site,
                  action.section,
                  response.tags
                )
              );
            }

            if (response.entry.tags) {
              dispatch(
                new UpdateSectionEntryFromSyncAction(
                  `${action.site}/entry/${action.section}/${response.entry.id}/tags/tag`,
                  response.entry.tags.tag[0],
                  1
                )
              );
            }
          }
        })
      );
  }

  @Action(MoveSectionEntryFromSyncAction)
  moveSectionEntryFromSync(
    { getState, patchState, dispatch }: StateContext<SectionEntriesStateModel>,
    action: MoveSectionEntryFromSyncAction
  ) {
    return this.appStateService
      .sync('sectionEntriesMove', {
        site: action.site,
        currentSection: action.currentSection,
        entryId: action.entryId,
        toSection: action.toSection,
      })
      .pipe(
        tap((response) => {
          if (response.error_message) {
            console.error(response.error_message);
          } else {
            const currentState = getState();
            const deletedEntry = currentState[action.site].find(
              (entry) =>
                entry.sectionName === action.currentSection &&
                entry.id === action.entryId
            );

            patchState({
              [action.site]: [
                ...currentState[action.site]
                  .filter(
                    (entry) =>
                      !(
                        entry.sectionName === action.currentSection &&
                        entry.id === action.entryId
                      )
                  )
                  .map((entry) => {
                    if (
                      entry.sectionName === action.currentSection &&
                      entry.order > deletedEntry.order
                    ) {
                      return { ...entry, order: entry.order - 1 };
                    }

                    return entry;
                  }),
                response.entry,
              ],
            });

            dispatch(
              new UpdateSiteSectionAction(
                action.site,
                response.deleted_entry.section_order,
                {
                  '@attributes': {
                    entry_count: response.deleted_entry.entry_count,
                  },
                }
              )
            );

            dispatch(
              new UpdateSiteSectionAction(
                action.site,
                response.deleted_entry.section_order,
                {
                  '@attributes': {
                    has_direct_content:
                      response.deleted_entry.has_direct_content,
                  },
                }
              )
            );

            if (response.deleted_entry.tags) {
              dispatch(
                new UpdateSectionTagsAction(
                  action.site,
                  action.currentSection,
                  response.deleted_entry.tags
                )
              );
            }

            dispatch(
              new UpdateSiteSectionAction(action.site, response.section_order, {
                '@attributes': {
                  entry_count: response.entry_count,
                },
              })
            );

            dispatch(
              new UpdateSiteSectionAction(action.site, response.section_order, {
                '@attributes': {
                  has_direct_content: response.has_direct_content,
                },
              })
            );
          }
        })
      );
  }

  @Action(AddSectionEntriesAction)
  addSectionEntries(
    { patchState, getState }: StateContext<SectionEntriesStateModel>,
    action: AddSectionEntriesAction
  ) {
    const state = getState();
    patchState({
      [action.siteName]: [...state[action.siteName], ...action.entries],
    });
  }

  @Action(AddSiteEntriesAction)
  addSiteEntries(
    { patchState, getState }: StateContext<SectionEntriesStateModel>,
    action: AddSiteEntriesAction
  ) {
    const currentState = getState();
    const newEntries = {};
    newEntries[action.site.name] = action.entries;
    patchState({ ...currentState, ...newEntries });
  }

  @Action(RenameSectionEntriesAction)
  renameSectionEntries(
    { patchState, getState }: StateContext<SectionEntriesStateModel>,
    action: RenameSectionEntriesAction
  ) {
    const state = getState();

    if (!state[action.section.site_name]) {
      return;
    }

    patchState({
      [action.section.site_name]: state[action.section.site_name].map(
        (entry) => {
          if (entry.sectionName === action.section.name) {
            return { ...entry, sectionName: action.newSectionName };
          }
          return entry;
        }
      ),
    });
  }

  @Action(RenameSectionEntriesSitenameAction)
  renameSectionEntriesSitename(
    { setState, getState }: StateContext<SectionEntriesStateModel>,
    action: RenameSectionEntriesSitenameAction
  ) {
    const state = getState();
    const newState = {};

    /* Using the loop to retain the element order in the map */
    for (const siteName in state) {
      if (siteName === action.site.name) {
        newState[action.siteName] = state[siteName];
      } else {
        newState[siteName] = state[siteName];
      }
    }

    setState(newState);
  }

  @Action(DeleteSectionEntriesAction)
  deleteSectionEntries(
    { patchState, getState }: StateContext<SectionEntriesStateModel>,
    action: DeleteSectionEntriesAction
  ) {
    const state = getState();

    if (!state[action.section.site_name]) {
      return;
    }

    patchState({
      [action.section.site_name]: state[action.section.site_name].filter(
        (entry) => {
          return entry.sectionName !== action.section.name;
        }
      ),
    });
  }

  @Action(DeleteSiteSectionsEntriesAction)
  deleteSiteSectionsEntries(
    { getState, setState }: StateContext<SectionEntriesStateModel>,
    action: DeleteSiteSectionsEntriesAction
  ) {
    const newState = { ...getState() };
    delete newState[action.siteName];
    setState(newState);
  }

  @Action(ResetSectionEntriesAction)
  resetSectionEntries({ setState }: StateContext<SectionEntriesStateModel>) {
    setState({});
  }

  @Action(InitSectionEntriesAction)
  initSectionEntries(
    { setState }: StateContext<SectionEntriesStateModel>,
    action: InitSectionEntriesAction
  ) {
    setState(action.payload);
  }

  @Action(UpdateSectionEntryFromSyncAction)
  updateSectionEntryFromSync(
    { getState, patchState, dispatch }: StateContext<SectionEntriesStateModel>,
    action: UpdateSectionEntryFromSyncAction
  ) {
    if (action.nOfReq >= 2) return;

    return this.appStateService
      .sync('sectionEntries', {
        path: action.path,
        value: action.payload,
      })
      .pipe(
        tap((response) => {
          if (response.error_message) {
            /* This should probably be handled in sync */
            console.error(response.error_message);
          } else {
            const currentState = getState();
            const [currentSite, , currentSection, entryId] =
              action.path.split('/');
            const siteName = currentSite === '0' ? '' : currentSite;
            let lastPathPart = action.path.split('/').slice(4).join('/');
            let payload = action.payload;

            if (lastPathPart === 'tags/tag') {
              // slugs update
              // piece of a logic to update entry 'slugs' field right after 'tag' field was changed
              dispatch(
                new UpdateSectionEntryFromSyncAction(
                  action.path,
                  action.payload,
                  ++action.nOfReq
                )
              );
              // end slugs update

              lastPathPart = 'tags';
              payload = response.entry.tags;
            }

            patchState({
              [siteName]: currentState[siteName].map((entry) => {
                if (
                  entry.id !== entryId ||
                  entry.sectionName !== currentSection
                ) {
                  return entry;
                }

                return assignByPath(entry, lastPathPart, payload);
              }),
            });

            if (response.section) {
              dispatch(
                new UpdateSiteSectionAction(siteName, response.section_order, {
                  '@attributes': {
                    has_direct_content: response.has_direct_content,
                  },
                })
              );
            }

            if (response.tags) {
              dispatch(
                new UpdateSectionTagsAction(
                  siteName,
                  currentSection,
                  response.tags
                )
              );
            }
          }
        })
      );
  }

  @Action(UpdateSectionEntryAction)
  updateSectionEntry(
    { getState, patchState }: StateContext<SectionEntriesStateModel>,
    action: UpdateSectionEntryAction
  ) {
    return this.appStateService
      .sync('sectionEntries', {
        path: action.path,
        value: action.payload,
      })
      .pipe(
        tap((response) => {
          if (response.error_message) {
            /* This should probably be handled in sync */
            console.error(response.error_message);
          } else {
            const currentState = getState();
            const [currentSite, , currentSection, entryId] =
              action.path.split('/');
            const siteName = currentSite === '0' ? '' : currentSite;
            let lastPathPart = action.path.split('/').slice(4).join('/');
            let payload = action.payload;

            patchState({
              [siteName]: currentState[siteName].map((entry) => {
                if (
                  entry.id !== entryId ||
                  entry.sectionName !== currentSection
                ) {
                  return entry;
                }

                return assignByPath(entry, lastPathPart, payload);
              }),
            });
          }
        })
      );
  }

  @Action(OrderSectionEntriesFromSyncAction)
  OrderSectionEntriesFromSyncAction(
    { getState, patchState }: StateContext<SectionEntriesStateModel>,
    action: OrderSectionEntriesFromSyncAction
  ) {
    return this.appStateService
      .sync(
        'sectionEntries',
        {
          site: action.site,
          section: action.section,
          entryId: action.entryId,
          value: action.value,
        },
        'PUT'
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            /* This should probably be handled in sync */
            console.error(response.error_message);
          } else {
            const currentState = getState();

            patchState({
              [action.site]: currentState[action.site].map((entry) => {
                if (entry.sectionName !== action.section) {
                  return entry;
                }

                return { ...entry, order: response.order.indexOf(entry.id) };
              }),
            });
          }
        })
      );
  }

  @Action(DeleteSectionEntryFromSyncAction)
  deleteSectionEntryFromSync(
    { getState, patchState, dispatch }: StateContext<SectionEntriesStateModel>,
    action: DeleteSectionEntryFromSyncAction
  ) {
    // taking deleted entry in order to compare find out if it was the last entry in submenu
    const entriesList = getState()[action.site];
    const deletedEntry = entriesList.find(
      (entry) =>
        entry.id === action.entryId && entry.sectionName === action.section
    );

    return this.appStateService
      .sync(
        'sectionEntries',
        {
          site: action.site,
          section: action.section,
          entryId: action.entryId,
        },
        'DELETE'
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            /* This should probably be handled in sync */
            console.error(response.error_message);
          } else {
            const currentState = getState();
            const deletedEntry = currentState[action.site].find(
              (entry) =>
                entry.sectionName === action.section &&
                entry.id === action.entryId
            );

            patchState({
              [action.site]: currentState[action.site]
                .filter(
                  (entry) =>
                    !(
                      entry.sectionName === action.section &&
                      entry.id === action.entryId
                    )
                )
                .map((entry) => {
                  if (
                    entry.sectionName === action.section &&
                    entry.order > deletedEntry.order
                  ) {
                    return { ...entry, order: entry.order - 1 };
                  }

                  return entry;
                }),
            });

            dispatch(
              new UpdateSiteSectionAction(action.site, response.section_order, {
                '@attributes': {
                  entry_count: response.entry_count,
                },
              })
            );

            dispatch(
              new UpdateSiteSectionAction(action.site, response.section_order, {
                '@attributes': {
                  has_direct_content: response.has_direct_content,
                },
              })
            );

            if (response.tags) {
              dispatch(
                new UpdateSectionTagsAction(
                  action.site,
                  action.section,
                  response.tags
                )
              );
            }
          }

          // if deleted entry was the last in submenu, then emit the event in order to redirect to main section
          const entriesList = getState()[action.site];
          if (deletedEntry.tags) {
            const entriesWithSameTag = entriesList.filter(
              (entry) =>
                entry.sectionName === action.section &&
                entry.tags &&
                entry.tags.tag.includes(deletedEntry.tags.tag[0])
            );

            if (!entriesWithSameTag.length) {
              dispatch(new DeleteSectionLastEntry(action.section));
            }
          }
        })
      );
  }

  @Action(UpdateEntryGalleryFromSyncAction)
  updateEntryGalleryFromSync(
    { getState, patchState }: StateContext<SectionEntriesStateModel>,
    action: UpdateEntryGalleryFromSyncAction
  ) {
    return this.appStateService
      .sync(
        'entryGallery',
        {
          site: action.site,
          section: action.section,
          entryId: action.entryId,
          files: action.files,
        },
        'PUT'
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const currentState = getState();

            patchState({
              [action.site]: currentState[action.site].map((entry) => {
                if (
                  entry.sectionName === action.section &&
                  entry.id === action.entryId
                ) {
                  const mediaCacheData = {
                    ...entry.mediaCacheData,
                    file: response.files,
                  };
                  return {
                    ...entry,
                    mediafolder: response.mediafolder,
                    mediaCacheData: mediaCacheData,
                  };
                }

                return entry;
              }),
            });
          }
        })
      );
  }

  @Action(AddEntryGalleryFileAction)
  addEntryGalleryFile(
    { getState, patchState }: StateContext<SectionEntriesStateModel>,
    action: AddEntryGalleryFileAction
  ) {
    const data = {
      path: `${action.site}/entry/${action.section}/${action.entryId}`,
      value: action.file,
    };

    return this.fileUploadService.upload('entryGallery', data).pipe(
      tap((response) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);

          return response.error_message;
        } else {
          const currentState = getState();

          let newFile: SectionEntryGalleryFile = {
            '@value': '',
            '@attributes': {
              type: response.type,
              src: response.filename,
            },
          };

          if (response.width) {
            newFile['@attributes'].width = response.width;
          }
          if (response.height) {
            newFile['@attributes'].width = response.height;
          }

          patchState({
            [action.site]: currentState[action.site].map((entry) => {
              if (
                entry.sectionName === action.section &&
                entry.id === action.entryId
              ) {
                const mediaCacheData = {
                  ...entry.mediaCacheData,
                  file: [...entry.mediaCacheData.file, newFile],
                };

                return {
                  ...entry,
                  mediaCacheData: mediaCacheData,
                };
              }

              return entry;
            }),
          });
        }
      })
    );
  }

  @Action(UpdateEntryGalleryFileAction)
  updateEntryGalleryFile(
    { getState, patchState }: StateContext<SectionEntriesStateModel>,
    action: UpdateEntryGalleryFileAction
  ) {
    return this.appStateService
      .sync('sectionEntries', {
        path: action.path,
        value: action.payload,
      })
      .pipe(
        tap((response) => {
          if (response.error_message) {
            console.error(response.error_message);
          } else {
            const currentState = getState();
            const [currentSite, , currentSection, entryId] =
              action.path.split('/');
            const siteName = currentSite === '0' ? '' : currentSite;
            let lastPathPart = action.path.split('/').slice(4).join('/');
            let payload = action.payload;

            patchState({
              [siteName]: currentState[siteName].map((entry) => {
                if (
                  entry.id !== entryId ||
                  entry.sectionName !== currentSection
                ) {
                  return entry;
                }

                return assignByPath(entry, lastPathPart, payload);
              }),
            });
          }
        })
      );
  }

  @Action(UpdateEntryGalleryVideoPosterAction)
  updateEntryGalleryVideoPoster(
    { getState, patchState }: StateContext<SectionEntriesStateModel>,
    action: UpdateEntryGalleryVideoPosterAction
  ) {
    const data = {
      path: `${action.site}/entry/${action.section}/${action.entryId}/${action.fileName}`,
      value: action.payload,
    };

    return this.fileUploadService.upload('entryGallery', data).pipe(
      tap((response) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);

          return response.error_message;
        } else {
          const currentState = getState();

          patchState({
            [action.site]: currentState[action.site].map((entry) => {
              if (
                entry.sectionName === action.section &&
                entry.id === action.entryId
              ) {
                const mediaCacheData = {
                  ...entry.mediaCacheData,
                  file: entry.mediaCacheData.file.map((file) => {
                    if (file['@attributes'].src === action.fileName) {
                      return {
                        ...file,
                        '@attributes': {
                          ...file['@attributes'],
                          poster_frame: response.filename,
                          width: response.width,
                          height: response.height,
                        },
                      };
                    }
                    return file;
                  }),
                };

                return {
                  ...entry,
                  mediaCacheData: mediaCacheData,
                };
              }

              return entry;
            }),
          });
        }
      })
    );
  }

  @Action(UpdateEntryGalleryImageCropAction)
  updateEntryGalleryImageCrop(
    { getState, patchState }: StateContext<SectionEntriesStateModel>,
    action: UpdateEntryGalleryImageCropAction
  ) {
    const data = {
      site: action.site,
      section: action.section,
      entryId: action.entryId,
      imageOrder: action.fileOrder,
      x: action.payload.x,
      y: action.payload.y,
      w: action.payload.width,
      h: action.payload.height,
    };

    return this.appStateService.sync('entryGallery', data).pipe(
      tap((response) => {
        if (response.error_message) {
          // @TODO handle error message
          console.error(response.error_message);
          return response.error_message;
        } else {
          const currentState = getState();
          patchState({
            [action.site]: currentState[action.site].map((entry) => {
              if (
                entry.sectionName === action.section &&
                entry.id === action.entryId
              ) {
                const mediaCacheData = {
                  ...entry.mediaCacheData,
                  file: entry.mediaCacheData.file.map((file, index) => {
                    if (index === parseInt(action.fileOrder)) {
                      return {
                        ...file,
                        '@attributes': {
                          ...file['@attributes'],
                          src: response.update,
                          width: response.params.width,
                          height: response.params.height,
                        },
                      };
                    }
                    return file;
                  }),
                };
                return {
                  ...entry,
                  mediaCacheData: mediaCacheData,
                };
              }
              return entry;
            }),
          });
        }
      })
    );
  }

  @Action(OrderEntryGalleryFilesAction)
  orderEntryGalleryFiles(
    { getState, patchState }: StateContext<SectionEntriesStateModel>,
    action: OrderEntryGalleryFilesAction
  ) {
    return this.appStateService
      .sync(
        'entryGallery',
        {
          site: action.site,
          section: action.section,
          entryId: action.entryId,
          files: action.files,
        },
        'PUT'
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const currentState = getState();

            patchState({
              [action.site]: currentState[action.site].map((entry) => {
                if (
                  entry.sectionName === action.section &&
                  entry.id === action.entryId
                ) {
                  const mediaCacheData = {
                    ...entry.mediaCacheData,
                    file: response.files,
                  };
                  return {
                    ...entry,
                    mediaCacheData: mediaCacheData,
                  };
                }

                return entry;
              }),
            });
          }
        })
      );
  }

  @Action(DeleteEntryGalleryFileAction)
  deleteEntryGalleryFile(
    { getState, patchState }: StateContext<SectionEntriesStateModel>,
    action: DeleteEntryGalleryFileAction
  ) {
    return this.appStateService
      .sync(
        'entryGallery',
        {
          site: action.site,
          section: action.section,
          entryId: action.entryId,
          file: action.file,
        },
        'DELETE'
      )
      .pipe(
        tap((response) => {
          if (response.error_message) {
            // @TODO handle error message
            console.error(response.error_message);
          } else {
            const currentState = getState();

            patchState({
              [action.site]: currentState[action.site].map((entry) => {
                if (
                  entry.sectionName === action.section &&
                  entry.id === action.entryId
                ) {
                  const mediaCacheData = {
                    ...entry.mediaCacheData,
                    file: entry.mediaCacheData.file.filter(
                      (f) => f['@attributes'].src !== response.file
                    ),
                  };
                  return {
                    ...entry,
                    mediaCacheData: mediaCacheData,
                  };
                }

                return entry;
              }),
            });
          }
        })
      );
  }
}
