(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    sections: function(state, action) {
      var section, sections = [];

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log(action);
          return Immutable.fromJS(action.state.sections);

        case ActionTypes.ORDER_SECTIONS:
          console.log(action);
          action.sections.forEach(function(section_name, new_idx) {
            section = state.getIn([action.site, 'section']).toJSON()
              .find(function(section, old_idx) {
                return section.name === section_name;
              });

            if (section) {
              sections.push(section);
            }
          });

          if (sections.length > 0) {
            return state.setIn([action.site, 'section'], Immutable.fromJS(sections));
          }

          return state;

        default:
          return state;
      }
    }
  });
})(window, document);
