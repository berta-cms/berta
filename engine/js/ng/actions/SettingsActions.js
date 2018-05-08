(function (window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    updateSettings: function(path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.UPDATE_SETTINGS });

        sync(API_ROOT + 'update-settings', { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.settingsUpdated(response));
            }
            onComplete(response);
          });
      };
    },

    settingsUpdated: function (resp) {
      return {
        type: ActionTypes.SETTINGS_UPDATED,
        resp: resp
      };
    },

    settingsCreated: function (site_name, data) {
      return {
        type: ActionTypes.SETTINGS_CREATED,
        site_name: site_name,
        data: data
      };
    },

    deleteSiteSettings: function (data) {
      return {
        type: ActionTypes.SITE_SETTINGS_DELETED,
        data: data
      };
    },
  });

})(window, document);
