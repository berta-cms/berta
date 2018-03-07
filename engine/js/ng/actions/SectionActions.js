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
    updateSection: function(path, value, onComplete) {
      return {
        type: ActionTypes.UPDATE_SECTION,
        meta: {
          remote: true,
          url: API_ROOT + 'update-section',
          method: 'PATCH',
          data: {path: path, value: value},
          dispatch: 'sectionUpdated',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete
        },
        path: path,
        value: value
      };
    },
    sectionUpdated: function(resp) {
      return {
        type: ActionTypes.SECTION_UPDATED,
        resp: resp
      };
    },
    resetSection: function(path, onComplete) {
      return {
        type: ActionTypes.RESET_SECTION,
        meta: {
          remote: true,
          url: API_ROOT + 'reset-section',
          method: 'PATCH',
          data: {path: path},
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete
        },
        path: path
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
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
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
    orderSections: function(site, sections, onComplete) {
      return {
        type: ActionTypes.ORDER_SECTIONS,
        meta: {
          remote: true,
          method: 'PUT',
          url: API_ROOT + 'order-sections',
          data: {
            site: site,
            sections: sections
          },
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete
        },
        site: site,
        sections: sections
      };
    },
    sectionBgDelete: function(site, section, file, onComplete) {
      var url = encodeURIComponent(site) +
            '/' + encodeURIComponent(section) +
            '/' + encodeURIComponent(file);

      console.log(url, site, section, file);

      return {
        type: ActionTypes.SECTION_BG_DELETE,
        meta: {
          remote: true,
          url: API_ROOT + 'section-bg-delete/' + url,
          method: 'DELETE',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete
        }
      };
    },
    sectionBgOrder: function(site, section, files, onComplete) {
      return {
        type: ActionTypes.SECTION_BG_ORDER,
        meta: {
          remote: true,
          method: 'PUT',
          url: API_ROOT + 'section-bg-order',
          data: {
            site: site,
            section: section,
            files: files
          },
          dispatch: 'sectionBgOrdered',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete
        },
        site: site,
        section: section,
        files: files
      };
    },
    sectionBgOrdered: function(resp) {
      return {
        type: ActionTypes.SECTION_BG_ORDERED,
        resp: resp
      };
    }
  });

})(window, document);
