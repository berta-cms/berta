(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};
  window.Berta = window.Berta || {};

  Object.assign(window.Actions, {

    getState: function(site) {
      site = site ? site : '0';
      var url = '/_api/v1/state/' + site;

      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.GET_STATE });

        sync(url, {}, 'GET')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.setState(response));
            }
          });
      };
    },


    setState: function(state) {
      window.Berta.urls = state.urls;

      return {
        type: ActionTypes.SET_STATE,
        state: state
      };
    }
  });
})(window, document);
