(function (window, ActionTypes, sync) {
  'use strict';

  var Actions = window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    initUpdateSiteSettings: function(path, value, onComplete) {
      return function (dispatch) {
        dispatch({ type: ActionTypes.INIT_UPDATE_SITE_SETTINGS });

        sync(window.Berta.urls.siteSettings, { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.updateSiteSettings(response));
            }
            onComplete(response);
          });
      };
    },

    updateSiteSettings: function (resp) {
      return {
        type: ActionTypes.UPDATE_SITE_SETTINGS,
        resp: resp
      };
    },

  });

})(window, window.ActionTypes, window.sync);
