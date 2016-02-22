(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    tags: function(state, action) {
      var tag_idx, tags = [];

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

          if (action.resp.tags.len > 0) {
            tags.push(action.resp.tags);

            return state.setIn(
              [action.resp.site, 'section'],
              Immutable.fromJS(tags)
            );
          }

          return state;

        case ActionTypes.SECTION_DELETED:
          console.log(action);
          tags = state.getIn([action.resp.site, 'section']).toJSON();
          tag_idx = tags.findIndex(function (tag, idx) {
            return tag['@attributes'].name === action.resp.name;
          });

          if (tag_idx > -1) {
            tags.splice(tag_idx, 1);
            return state.setIn(
              [action.resp.site, 'section'],
              Immutable.fromJS(tags)
            );
          }

          return state;

        default:
          return state;
      }
    }
  });
})(window, document);
