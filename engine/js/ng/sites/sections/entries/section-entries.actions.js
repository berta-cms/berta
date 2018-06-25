(function(window, sync, Actions, ActionTypes) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    addSiteSectionsEntries: function (data) {
      return {
        type: ActionTypes.ADD_SITE_SECTIONS_ENTRIES,
        data: data
      };
    },


    addSectionEntries: function (data) {
      return {
        type: ActionTypes.ADD_SECTION_ENTRIES,
        data: data
      };
    },


    initUpdateSectionEntry: function(path, value, onComplete) {
      return function (dispatch) {
        dispatch({ type: ActionTypes.INIT_UPDATE_SECTION_ENTRY });

        sync(window.Berta.urls.sectionEntries, { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.updateSectionEntry(response));

              if (response.section) {
                dispatch({ type: ActionTypes.INIT_UPDATE_SITE_SECTION });

                dispatch(Actions.updateSiteSection({
                  'path': response.site_name + '/section/' + response.section_order + '/@attributes/has_direct_content',
                  'section': response.section,
                  'value': response.has_direct_content
                }));
              }

              if (response.tags) {
                dispatch(Actions.updateSectionTags(response));
              }
            }
            if (onComplete) {
              onComplete(response);
            }
          });
      };
    },


    updateSectionEntry: function(resp) {
      return {
        type: ActionTypes.UPDATE_SECTION_ENTRY,
        resp: resp
      };
    },


    renameSectionEntriesSitename: function (data) {
      return {
        type: ActionTypes.RENAME_SECTION_ENTRIES_SITENAME,
        data: data
      };
    },


    renameSectionEntries: function (data) {
      return {
        type: ActionTypes.RENAME_SECTION_ENTRIES,
        data: data
      };
    },


    initDeleteSectionEntry: function(site, section, entryId, onComplete) {
      return function (dispatch) {
        dispatch({ type: ActionTypes.INIT_DELETE_SECTION_ENTRY });
        dispatch({ type: ActionTypes.INIT_UPDATE_SITE_SECTION });

        sync(window.Berta.urls.sectionEntries, {site: site, section: section, entryId: entryId}, 'DELETE')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.deleteSectionEntry(response));

              dispatch(Actions.updateSiteSection({
                'path': response.site_name + '/section/' + response.section_order + '/@attributes/entry_count',
                'section': response.section,
                'value': response.entry_count
              }));

              dispatch(Actions.updateSiteSection({
                'path': response.site_name + '/section/' + response.section_order + '/@attributes/has_direct_content',
                'section': response.section,
                'value': response.has_direct_content
              }));

              dispatch(Actions.updateSectionTags(response));
            }
            onComplete(response);
          });
      };
    },


    deleteSectionEntry: function(resp) {
      return {
        type: ActionTypes.DELETE_SECTION_ENTRY,
        resp: resp
      };
    },


    deleteSiteSectionsEntries: function (data) {
      return {
        type: ActionTypes.DELETE_SITE_SECTIONS_ENTRIES,
        data: data
      };
    },


    deleteSectionEntries: function (data) {
      return {
        type: ActionTypes.DELETE_SECTION_ENTRIES,
        data: data
      };
    },


    initOrderSectionEntryGallery: function(site, section, entryId, files, onComplete) {
      return function (dispatch) {
        dispatch({ type: ActionTypes.INIT_ORDER_SECTION_ENTRY_GALLERY });

        sync(window.Berta.urls.entryGallery, {site: site, section: section, entryId: entryId, files: files}, 'PUT')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.orderSectionEntryGallery(response));
            }
            onComplete(response);
          });
      };
    },


    orderSectionEntryGallery: function(resp) {
      return {
        type: ActionTypes.ORDER_SECTION_ENTRY_GALLERY,
        resp: resp
      };
    },


    initDeleteEntryGalleryImage: function(site, section, entryId, file, onComplete) {
      return function (dispatch) {
        dispatch({ type: ActionTypes.INIT_DELETE_ENTRY_GALLERY_IMAGE });

        sync(window.Berta.urls.entryGallery, {site: site, section: section, entryId: entryId, file: file}, 'DELETE')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.deleteEntryGalleryImage(response));
            }
            onComplete(response);
          });
      };
    },


    // There is no reducer for this action at the moment
    // `orderSectionEntryGallery` is called after delete which updates state
    deleteEntryGalleryImage: function(resp) {
      return {
        type: ActionTypes.DELETE_ENTRY_GALLERY_IMAGE,
        resp: resp
      };
    }
  });

})(window, window.sync, window.Actions, window.ActionTypes);
