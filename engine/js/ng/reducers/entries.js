(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    entries: function(state, action) {
      var entries = [];

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log(action);
          return Immutable.fromJS(action.state.entries);

        case ActionTypes.SECTION_CREATED:
          console.log(action);
          entries = state.getIn([action.resp.site]).toJSON();
          entries[action.resp.section.name] = action.resp.entries;
          return state.setIn([action.resp.site], Immutable.fromJS(entries));

        case ActionTypes.SECTION_DELETED:
          console.log(action);
          entries = state.getIn([action.resp.site]).toJSON();
          delete entries[action.resp.name];
          return state.setIn([action.resp.site], Immutable.fromJS(entries));

        default:
          return state;
      }
    }
  });
})(window, document);
