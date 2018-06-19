(function(window, sync, Actions, ActionTypes) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    initUpdateSectionEntry: function(path, value, onComplete) {
      return function (dispatch) {
        dispatch({ type: ActionTypes.INIT_UPDATE_SECTION_ENTRY });

        sync(window.Berta.urls.sectionEntries, { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.updateSectionEntry(response));
            }
            onComplete(response);
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
    }
  });

})(window, window.sync, window.Actions, window.ActionTypes);
