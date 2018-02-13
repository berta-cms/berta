(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    entries: function(state, action) {
      var entry, entries = [];

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log('Entries reducer:', action);
          return Immutable.fromJS(action.state.entries);

        case ActionTypes.SECTION_CREATED:
          console.log('Entries reducer:', action);
          entries = state.getIn([action.resp.site]).toJSON();
          entries[action.resp.section.name] = action.resp.entries;

          return state.setIn([action.resp.site], Immutable.fromJS(entries));

        case ActionTypes.SECTION_UPDATED:
          if (action.resp.old_name) {
            console.log('Entries reducer:', action);
            entries = state.getIn([action.resp.site]).toJSON();

            if (entries.length) {
              entry = entries[action.resp.old_name];
              entry['@attributes'].section = action.resp.section.name;
              entries[action.resp.section.name] = entry;
              delete entries[action.resp.old_name];
            }

            return state.setIn([action.resp.site], Immutable.fromJS(entries));
          }

          return state;

        case ActionTypes.SECTION_DELETED:
          console.log('Entries reducer:', action);
          entries = state.getIn([action.resp.site]).toJSON();
          delete entries[action.resp.name];

          return state.setIn([action.resp.site], Immutable.fromJS(entries));

        default:
          return state;
      }
    }
  });
})(window, document);
