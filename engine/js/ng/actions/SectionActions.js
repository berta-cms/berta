(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {
    createSection: function(site, name, title, onComplete) {
      return {
        type: ActionTypes.CREATE_SECTION,
        meta: {
          remote: true,
          url: API_ROOT + 'create-section',
          method: 'POST',
          dispatch: 'sectionCreated',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete,
          data: {
            site: site,
            name: name,
            title: title
          }
        }
      };
    },
    sectionCreated: function(resp) {
      return {
        type: ActionTypes.SECTION_CREATED,
        resp: resp
      };
    },
    deleteSection: function(site, section, onComplete) {
      return {
        type: ActionTypes.DELETE_SECTION,
        meta: {
          remote: true,
          url: API_ROOT + 'delete-section/' + encodeURIComponent(site) + '/' + encodeURIComponent(section),
          method: 'DELETE',
          dispatch: 'sectionDeleted',
          onComplete: onComplete
        },
        section: section
      };
    },
    sectionDeleted: function(resp) {
      return {
        type: ActionTypes.SECTION_DELETED,
        resp: resp
      };
    },
    orderSections: function(site, sections) {
      return {
        type: ActionTypes.ORDER_SECTIONS,
        meta: {
          remote: true,
          method: 'PUT',
          url: API_ROOT + 'order-sections',
          data: {
            site: site,
            sections: sections
          }
        },
        site: site,
        sections: sections
      };
    }
  });

})(window, document);
