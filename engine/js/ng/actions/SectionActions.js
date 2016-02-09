(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {
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
