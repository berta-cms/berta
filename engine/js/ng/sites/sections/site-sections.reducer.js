(function (window, Immutable, ActionTypes) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    siteSections: function (state, action) {
      var path,
          site_name,
          order,
          prop,
          value;

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {

        case ActionTypes.SET_STATE:
          return Immutable.fromJS(action.state.site_sections);


        case ActionTypes.CREATE_SITE_SECTION:
          return state.set(state.size, Immutable.fromJS(action.resp));


        case ActionTypes.UPDATE_SITE_SECTION:
          path = action.resp.path.split('/');
          site_name = path[0] === '0' ? '' : path[0];
          order = parseInt(path[2], 10);
          value = action.resp.value;
          prop = path.slice(3); // "title" or "@attributes/published"

          return state.map(function (section) {
            if (section.get('site_name') === site_name && section.get('order') === order && section.getIn(prop) !== value) {
              return section.merge(action.resp.section);
            }
            return section;
          });


        case ActionTypes.RENAME_SITE_SECTIONS_SITENAME:
          var old_name = action.data.site.get('name');
          value = action.data.site_name;

          return state.map(function (section) {
            if (section.get('site_name') === old_name) {
              return section.set('site_name', value);
            }
            return section;
          });


        case ActionTypes.RESET_SITE_SECTION:
          path = action.path.split('/');
          site_name = path[0] === '0' ? '' : path[0];
          order = parseInt(path[2], 10);
          prop = path.slice(3);

          return state.map(function (section) {
            if (section.get('site_name') === site_name && section.get('order') === order) {
              return section.deleteIn(prop);
            }
            return section;
          });


        case ActionTypes.ORDER_SITE_SECTIONS:
          return state.map(function (section) {
            if (section.get('site_name') === action.resp.site) {
              var order = action.resp.sections.indexOf(section.get('name'));

              if (section.get('order') !== order) {
                return section.set('order', order);
              }
            }
            return section;
          });


        case ActionTypes.DELETE_SITE_SECTION:
          site_name = action.resp.site === '0' ? '' : action.resp.site;
          order = -1;

          return state.filter(function (section) {
            return !(section.get('name') === action.resp.name && section.get('site_name') === site_name);

            // Update order
          }).map(function (section) {
            if (section.get('site_name') === site_name) {
              order++;

              if (section.get('order') !== order) {
                return section.set('order', order);
              }
            }
            return section;
          });


        case ActionTypes.DELETE_SITE_SECTIONS:
          return state.filter(function (section) {
            return section.get('site_name') !== action.data.site_name;
          });


        case ActionTypes.ORDER_SITE_SECTION_BACKGROUNDS:
          return state.map(function (section) {
            if (section.get('site_name') === action.resp.site && section.get('name') === action.resp.section) {
              return section
                .set('mediafolder', action.resp.mediafolder)
                .setIn(['mediaCacheData', 'file'], action.resp.files);
            }
            return section;
          });


        default:
          return state;
      }
    }
  });
})(window, window.Immutable, window.ActionTypes);
