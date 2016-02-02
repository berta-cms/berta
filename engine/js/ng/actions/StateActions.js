(function(window, document) {
  'use strict';

  window.StateActions = {
    getState: function() {
      console.log('getState');
      return {
        type: ActionTypes.GET_STATE,
        meta: {remote: true},
        url: '/_api/v1/state',
        trigger: 'setState'
      };
    },
    setState: function(data) {
      console.log('setState');
      return {
        type: ActionTypes.SET_STATE,
        data: data
      };
    }
  };
})(window, document);
