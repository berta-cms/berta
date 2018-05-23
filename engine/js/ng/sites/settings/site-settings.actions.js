(function (window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    createSiteSettings: function (site_name, data) {
      return {
        type: ActionTypes.CREATE_SITE_SETTINGS,
        site_name: site_name,
        data: data
      };
    },

    initUpdateSiteSettings: function(path, value, onComplete) {
      return function (dispatch, getStore) {
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

    renameSiteSettingsSitename: function (data) {
      return {
        type: ActionTypes.RENAME_SITE_SETTINGS_SITENAME,
        data: data
      };
    },

    deleteSiteSettings: function (data) {
      return {
        type: ActionTypes.DELETE_SITE_SETTINGS,
        data: data
      };
    },
  });

})(window, document);
