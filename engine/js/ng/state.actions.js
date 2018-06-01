(function(window, Berta, ActionTypes, sync) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    getState: function(site) {
      site = site ? site : '0';
      var url = '/_api/v1/state/' + site;

      return function (dispatch) {
        dispatch({ type: ActionTypes.GET_STATE });

        sync(url, {}, 'GET')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(window.Actions.setState(response));
            }
          });
      };
    },


    setState: function(state) {
      Berta.urls = state.urls;

      return {
        type: ActionTypes.SET_STATE,
        state: state
      };
    }
  });
})(window, window.Berta, window.ActionTypes, window.sync);
