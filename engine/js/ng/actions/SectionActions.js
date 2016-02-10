(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {
    createSection: function(section, onComplete) {
      return {
        type: ActionTypes.CREATE_SECTION,
        meta: {
          remote: true,
          url: API_ROOT + 'create-section',
          method: 'POST',
          dispatch: 'sectionCreated',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete,
          data: section
        }
      };
    },
    sectionCreated: function(section) {
      return {
        type: ActionTypes.SECTION_CREATED,
        section: section
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
