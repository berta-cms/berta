(function (window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {
    updateSettings: function (path, value, onComplete) {
      return {
        type: ActionTypes.UPDATE_SETTINGS,
        meta: {
          remote: true,
          url: API_ROOT + 'update-settings',
          method: 'PATCH',
          data: { path: path, value: value },
          dispatch: 'settingsUpdated',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete
        },
        path: path,
        value: value
      };
    },
    settingsUpdated: function (resp) {
      return {
        type: ActionTypes.SETTINGS_UPDATED,
        resp: resp
      };
    },
  });

})(window, document);
