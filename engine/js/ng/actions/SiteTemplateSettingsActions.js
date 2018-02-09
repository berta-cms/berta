(function (window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {
    updateSiteTemplateSettings: function (path, value, onComplete) {
      return {
        type: ActionTypes.UPDATE_SITE_TEMPLATE_SETTINGS,
        meta: {
          remote: true,
          url: API_ROOT + 'update-site-template-settings',
          method: 'PATCH',
          data: { path: path, value: value },
          dispatch: 'siteTemplateSettingsUpdated',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete
        },
        path: path,
        value: value
      };
    },
    siteTemplateSettingsUpdated: function (resp) {
      return {
        type: ActionTypes.SITE_TEMPLATE_SETTINGS_UPDATED,
        resp: resp
      };
    },
  });

})(window, document);
