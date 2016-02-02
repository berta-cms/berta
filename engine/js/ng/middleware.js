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

  window.redux_middleware = function (store) {
    return function (next) {
      return function (action) {
        if (action.meta && action.meta.remote) {
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
              if (action.meta.dispatch) {
                store.dispatch(Actions[action.meta.dispatch](json));
                if (action.meta.onComplete) {
                  action.meta.onComplete(json);
                }
              }
            })
            .catch(function(error) {
              console.log('request failed', error);
            });
        }

        return next(action);
      };
    };
  };
})(window, document);
