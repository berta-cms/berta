(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    tags: function(state, action) {
      var tag_idx, tags, site_name = [];

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {
        case ActionTypes.SET_STATE:
          console.log('Tags reducer:', action);

          return Immutable.fromJS(action.state.tags);


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


        // case ActionTypes.SECTION_CREATED:
        //   tags = state.getIn([action.resp.site, 'section']).toJSON();

        //   if (action.resp.tags.len > 0) {
        //     console.log('Tags reducer:', action);
        //     tags.push(action.resp.tags);

        //     return state.setIn(
        //       [action.resp.site, 'section'],
        //       Immutable.fromJS(tags)
        //     );
        //   }

        //   return state;

        // case ActionTypes.SECTION_UPDATED:
        //   if (action.resp.old_name) {
        //     tags = state.getIn([action.resp.site, 'section']).toJSON();
        //     tag_idx = tags.findIndex(function (tag, idx) {
        //       return tag['@attributes'].name === action.resp.old_name;
        //     });

        //     if (tag_idx > -1) {
        //       console.log('Tags reducer:', action);
        //       tags[tag_idx]['@attributes'].name = action.resp.section.name;

        //       return state.setIn(
        //         [action.resp.site, 'section'],
        //         Immutable.fromJS(tags)
        //       );
        //     }
        //   }

        //   return state;

        // case ActionTypes.SECTION_DELETED:
        //   tags = state.getIn([action.resp.site, 'section']).toJSON();
        //   tag_idx = tags.findIndex(function (tag, idx) {
        //     return tag['@attributes'].name === action.resp.name;
        //   });

        //   if (tag_idx > -1) {
        //     console.log('Tags reducer:', action);
        //     tags.splice(tag_idx, 1);

        //     return state.setIn(
        //       [action.resp.site, 'section'],
        //       Immutable.fromJS(tags)
        //     );
        //   }

        //   return state;

        default:
          return state;
      }
    }
  });
})(window, document);
