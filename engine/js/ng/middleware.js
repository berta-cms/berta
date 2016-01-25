(function(window, document) {
  'use strict';

  window.redux_middleware = function (store) {
    return function (next) {
      return function (action) {
        if (action.meta && action.meta.remote) {
          // @@@:TODO: Remove dependency on mootools later
          new Request.JSON({
            url: action.url,
            onComplete: function(resp, respRaw) {
              // @@@:TODO: Trigger an action
              if (action.trigger) {
                store.dispatch(StateActions[action.trigger](resp));
              }
            }
          }).get();
        }

        return next(action);
      };
    };
  };
})(window, document);