(function (window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    updateSiteSettings: function(path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.UPDATE_SITE_SETTINGS });

        sync(window.Berta.urls.site_settings, { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteSettingsUpdated(response));
            }
            onComplete(response);
          });
      };
    },

    siteSettingsUpdated: function (resp) {
      return {
        type: ActionTypes.SITE_SETTINGS_UPDATED,
        resp: resp
      };
    },

    siteSettingsCreated: function (site_name, data) {
      return {
        type: ActionTypes.SITE_SETTINGS_CREATED,
        site_name: site_name,
        data: data
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
        type: ActionTypes.SITE_SETTINGS_DELETED,
        data: data
      };
    },
  });

})(window, document);
