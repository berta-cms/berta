(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    sections: function(state, action) {
      var path, value, section, section_idx, sections = [];

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log('Sections reducer:', action);
          return Immutable.fromJS(action.state.sections);

        case ActionTypes.SECTION_CREATED:
          console.log('Sections reducer:', action);
          sections = state.getIn([action.resp.site, 'section']).toJSON();
          sections.push(action.resp.section);
          return state.setIn(
            [action.resp.site, 'section'],
            Immutable.fromJS(sections)
          );

        case ActionTypes.SECTION_UPDATED:
          console.log('Sections reducer:', action);
          return state.setIn(
            [action.resp.site, 'section', action.resp.section_idx],
            action.resp.section
          );

        case ActionTypes.SECTION_DELETED:
          sections = state.getIn([action.resp.site, 'section']).toJSON();
          section_idx = sections.findIndex(function (section, idx) {
            return section.name === action.resp.name;
          });

          if (section_idx > -1) {
            console.log('Sections reducer:', action);
            sections.splice(section_idx, 1);
            return state.setIn(
              [action.resp.site, 'section'],
              Immutable.fromJS(sections)
            );
          }

          return state;

        case ActionTypes.ORDER_SECTIONS:
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
            console.log('Sections reducer:', action);
            return state.setIn(
              [action.site, 'section'],
              Immutable.fromJS(sections)
            );
          }

          return state;

        default:
          return state;
      }
    }
  });
})(window, document);
