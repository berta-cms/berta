(function(window, Immutable, ActionTypes) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    sectionEntries: function(state, action) {
      var site_name;

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {

        case ActionTypes.SET_STATE:
          return Immutable.fromJS(action.state.sectionEntries);


        case ActionTypes.ADD_SITE_SECTIONS_ENTRIES:
          return state.set(action.data.site_name, action.data.entries);


        case ActionTypes.ADD_SECTION_ENTRIES:
          return state.map(function (site, site_name) {
            if (site_name === action.data.site_name) {
              return site.concat(Immutable.fromJS(action.data.entries));
            }
            return site;
          });


        case ActionTypes.UPDATE_SECTION_ENTRY:
          var path = action.resp.path.split('/');
          var siteName = path[0] === '0' ? '' : path[0];
          var sectionName = path[2];
          var entryId = path[3];

          var index = state.get(siteName).findIndex(function (entry) {
            return entry.get('id') === entryId && entry.get('sectionName') === sectionName;
          });

          if (index < 0) {
            return state;
          }

          return state.setIn(
            [siteName, index],
            state.getIn([siteName, index]).merge(action.resp.entry)
          );


        case ActionTypes.RENAME_SECTION_ENTRIES_SITENAME:
          var site_old_name = action.data.site.get('name');

          return state.mapKeys(function (site_name) {
            if (site_name === site_old_name) {
              return action.data.site_name;
            }
            return site_name;
          });


        case ActionTypes.RENAME_SECTION_ENTRIES:
          site_name = action.data.site_name === '0' ? '' : action.data.site_name;

          return state.map(function (site, k) {
            if (site_name === k) {
              return site.map(function (entry) {
                if (entry.get('sectionName') === action.data.section_old_name) {
                  return entry.set('sectionName', action.data.section_name);
                }
                return entry;
              });
            }
            return site;
          });


        case ActionTypes.ORDER_SECTION_ENTRIES:
          site_name = action.data.site_name === '0' ? '' : action.data.site_name;

          return state.map(function (site, k) {
            if (site_name === k) {
              return site.map(function (entry) {
                if (entry.get('sectionName') === action.data.section_name) {
                  return entry.set('order', action.data.order.indexOf(entry.get('id')));
                }
                return entry;
              });
            }
            return site;
          });


        case ActionTypes.DELETE_SECTION_ENTRY:
          site_name = action.resp.site_name === '0' ? '' : action.resp.site_name;

          return state.map(function (site, k) {
            if (site_name === k) {
              return site.filter(function (entry) {
                return !(entry.get('sectionName') === action.resp.section_name && entry.get('id') === action.resp.entry_id);
              }).map(function (entry) {
                if (entry.get('sectionName') === action.resp.section_name && entry.get('order') > action.resp.entry_order ) {
                  return entry.set('order', entry.get('order') - 1);
                }
                return entry;
              });
            }
            return site;
          });


        case ActionTypes.DELETE_SITE_SECTIONS_ENTRIES:
          return state.filter(function (entries, site_name) {
            return site_name !== action.data.site_name;
          });


        case ActionTypes.DELETE_SECTION_ENTRIES:
          site_name = action.data.site_name === '0' ? '' : action.data.site_name;

          return state.map(function (site, s) {
            if (site_name === s) {
              return site.filter(function (entry) {
                return entry.get('sectionName') !== action.data.section_name;
              });
            }
            return site;
          });


        case ActionTypes.ORDER_SECTION_ENTRY_GALLERY:
          return state.map(function (site, site_name) {
            if (site_name === action.resp.site) {
              return site.map(function (entry) {
                if (entry.get('sectionName') === action.resp.section && entry.get('id') === action.resp.entry_id) {
                  return entry
                    .set('mediafolder', action.resp.mediafolder)
                    .setIn(['mediaCacheData', 'file'], action.resp.files);
                }
                return entry;
              });
            }
            return site;
          });


        default:
          return state;
      }
    }
  });
})(window, window.Immutable, window.ActionTypes);
