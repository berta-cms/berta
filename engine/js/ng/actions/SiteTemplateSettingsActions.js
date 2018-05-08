(function (window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    updateSiteTemplateSettings: function(path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.UPDATE_SITE_TEMPLATE_SETTINGS });

        sync(API_ROOT + 'update-site-template-settings', { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteTemplateSettingsUpdated(response));
            }
            onComplete(response);
          });
      };
    },

    siteTemplateSettingsUpdated: function (resp) {
      return {
        type: ActionTypes.SITE_TEMPLATE_SETTINGS_UPDATED,
        resp: resp
      };
    },

    templateSettingsCreated: function(site_name, data) {
      return {
        type: ActionTypes.TEMPLATE_SETTINGS_CREATED,
        site_name: site_name,
        data: data
      };
    },

    deleteSiteTemplateSettings: function (data) {
      return {
        type: ActionTypes.SITE_TEMPLATE_SETTINGS_DELETED,
        data: data
      };
    }
  });

})(window, document);
