(function(window, Immutable, ActionTypes) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    sectionTags: function(state, action) {
      var site_name = [];

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          return Immutable.fromJS(action.state.section_tags);


        case ActionTypes.ADD_SITE_SECTIONS_TAGS:
          return state.set(action.data.site_name, action.data.tags);


        case ActionTypes.ADD_SECTION_TAGS:
          return state.map(function (site, site_name) {
            if (action.data.site_name === site_name) {
              return site.map(function (sections) {
                return sections.set(sections.size, Immutable.fromJS(action.data.tags));
              });
            }
            return site;
          });


        case ActionTypes.UPDATE_SECTION_TAGS:
          site_name = action.data.site_name === '0' ? '' : action.data.site_name;

          return state.map(function (site, k) {
            if (site_name === k) {
              return site.map(function (sections) {
                return sections.map(function (section) {

                  if (section.getIn(['@attributes', 'name']) === action.data.section_name) {
                    return section.merge(action.data.tags.tags);
                  }
                  return section;
                });
              });
            }
            return site;
          });


        case ActionTypes.RENAME_SECTION_TAGS:
          site_name = action.data.site_name === '0' ? '' : action.data.site_name;

          return state.map(function (site, k) {
            if (site_name === k) {
              return site.map(function (sections) {
                return sections.map(function (section) {

                  if (section.getIn(['@attributes', 'name']) === action.data.section_old_name) {

                    return section.setIn(
                      ['@attributes', 'name'],
                      action.data.section_name
                    );
                  }
                  return section;
                });
              });
            }
            return site;
          });


        case ActionTypes.RENAME_SECTION_TAGS_SITENAME:
          var site_old_name = action.data.site.get('name');

          return state.mapKeys(function (site_name) {
            if (site_name === site_old_name) {
              return action.data.site_name;
            }
            return site_name;
          });


        case ActionTypes.DELETE_SECTION_TAGS:
          site_name = action.data.site_name === '0' ? '' : action.data.site_name;

          return state.map(function (site, k) {
            if (site_name === k) {
              return site.map(function (sections) {
                return sections.filter(function (section) {
                  return section.getIn(['@attributes', 'name']) !== action.data.section_name;
                });
              });
            }
            return site;
          });


        case ActionTypes.DELETE_SITE_SECTIONS_TAGS:
          return state.filter(function (tags, site_name) {
            return site_name !== action.data.site_name;
          });


        default:
          return state;
      }
    }
  });
})(window, window.Immutable, window.ActionTypes);
