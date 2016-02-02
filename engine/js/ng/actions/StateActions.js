(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {
    getState: function() {
      return {
        type: ActionTypes.GET_STATE,
        meta: {
          remote: true,
          url: '/_api/v1/state',
          dispatch: 'setState'
        }
      };
    },
    setState: function(state) {
      return {
        type: ActionTypes.SET_STATE,
        state: state
      };
    }
  });
})(window, document);
