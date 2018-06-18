(function(window) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    initUpdateSectionEntry: function(path, value, onComplete) {
      return function (dispatch, getStore) {
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
  });

})(window);
