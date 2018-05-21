(function (window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    createSiteTemplateSettings: function(site_name, data) {
      return {
        type: ActionTypes.CREATE_SITE_TEMPLATE_SETTINGS,
        site_name: site_name,
        data: data
      };
    },

    initUpdateSiteTemplateSettings: function(path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.INIT_UPDATE_SITE_TEMPLATE_SETTINGS });

        sync(window.Berta.urls.siteTemplateSettings, { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.updateSiteTemplateSettings(response));
            }
            onComplete(response);
          });
      };
    },

    updateSiteTemplateSettings: function (resp) {
      return {
        type: ActionTypes.UPDATE_SITE_TEMPLATE_SETTINGS,
        resp: resp
      };
    },

    renameSiteTemplateSettingsSitename: function (data) {
      return {
        type: ActionTypes.RENAME_SITE_TEMPLATE_SETTINGS_SITENAME,
        data: data
      };
    },

    deleteSiteTemplateSettings: function (data) {
      return {
        type: ActionTypes.DELETE_SITE_TEMPLATE_SETTINGS,
        data: data
      };
    }
  });

})(window, document);
