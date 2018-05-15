(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};
  window.Berta = window.Berta || {};

  Object.assign(window.Actions, {
    getState: function(site) {
      site = site ? site : '0';
      return {
        type: ActionTypes.GET_STATE,
        meta: {
          remote: true,
          url: '/_api/v1/state/' + site,
          dispatch: 'setState'
        }
      };
    },
    setState: function(state) {
      window.Berta['urls'] = state.urls;

      return {
        type: ActionTypes.SET_STATE,
        state: state
      };
    }
  });
})(window, document);
