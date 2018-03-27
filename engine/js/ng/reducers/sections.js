(function(window, document) {
  'use strict';

  window.reducers = window.reducers || {};

  Object.assign(window.reducers, {
    sections: function(state, action) {
      var path,
          site_name,
          order,
          prop,
          value,
          section,
          section_idx,
          sections = [],
          files = [],
          new_files = [];

      if (state === undefined) {
        state = Immutable.Map();
      }

      switch (action.type) {

        case ActionTypes.SET_STATE:
          console.log('Sections reducer:', action);
          return Immutable.fromJS(action.state.sections);


        case ActionTypes.SECTION_CREATED:
          return state.set(state.size, Immutable.fromJS(action.resp));


        case ActionTypes.RENAME_SECTIONS_SITENAME:
          var old_name = action.data.site.get('name');
          value = action.data.site_name;

          return state.map(function (section) {
            if (section.get('site_name') === old_name) {
              return section.set('site_name', value);
            }
            return section;
          });


        case ActionTypes.SECTION_UPDATED:
          console.log('Sections reducer:', action);
          path = action.resp.path.split('/');
          site_name = path[0] === '0' ? '' : path[0];
          order = parseInt(path[2], 10);
          value = action.resp.value;
          prop = path.slice(3);  // "title" or "@attributes/published"

          // @TODO also update section relations if name changed

          return state.map(function (section) {
            if (section.get('site_name') === site_name && section.get('order') === order && section.getIn(prop) !== value) {
              return section.merge(action.resp.section);
            }
            return section;
          });


        case ActionTypes.RESET_SECTION:
          console.log('Sections reducer:', action);
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


        case ActionTypes.SECTION_DELETED:
          console.log('Sections reducer:', action, state);

          // @TODO delete related data from state

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


        case ActionTypes.ORDER_SECTIONS:
          console.log('Sections reducer:', action);

          return state.map(function (section) {
            if (section.get('site_name') === action.site) {
              var order = action.sections.indexOf(section.get('name'));

              if (section.get('order') !== order) {
                return section.set('order', order);
              }
            }
            return section;
          });


        case ActionTypes.SECTION_BG_ORDERED:
          console.log('Sections reducer:', action);

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
})(window, document);
