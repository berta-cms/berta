(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    tags: function(state, action) {
      var tags = [];

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log(action);
          return Immutable.fromJS(action.state.tags);

        case ActionTypes.SECTION_CREATED:
          console.log(action);
          tags = state.getIn([action.resp.site, 'section']).toJSON();
          tags.push(action.resp.tags);
          return state.setIn(
            [action.resp.site, 'section'],
            Immutable.fromJS(tags)
          );

        default:
          return state;
      }
    }
  });
})(window, document);
