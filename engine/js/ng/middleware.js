(function(window, document) {
  'use strict';

  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }

  // @TODO Remove this middleware, use `window.sync` from `utils.js` instead
  window.redux_middleware = function (store) {
    return function (next) {
      return function (action) {
        if (action && action.meta && action.meta.remote) {
          var method =  action.meta.method ? action.meta.method : 'GET';

          fetch(
            action.meta.url,
            {
              method: method,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: method === 'get' ? undefined : JSON.stringify(action.meta.data)
            }
          )
            .then(checkStatus)
            .then(function(resp) {
              return resp.json();
            })
            .then(function(json) {
              if (action.meta && action.meta.dispatch && !json.error_message) {
                store.dispatch(Actions[action.meta.dispatch](json));
              }

              if (action.meta && action.meta.onComplete) {
                action.meta.onComplete(json);
              }
            })
            .catch(function(error) {
              console.log('Request failed:', error);
            });
        }

        return next(action);
      };
    };
  };
})(window, document);
