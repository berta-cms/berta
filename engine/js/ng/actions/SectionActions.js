(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {
    createSection: function(site, name, title, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.CREATE_SECTION });
        dispatch({ type: ActionTypes.UPDATE_TAGS });

        sync(API_ROOT + 'create-section', { site: site, name: name, title: title }, 'POST')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.sectionCreated(response.section));

              if (response.tags) {
                dispatch(Actions.addSectionTags({
                  site_name: site,
                  tags: response.tags
                }));
              }
            }
            onComplete(response.section);
          });
      };
    },


    sectionCreated: function(resp) {
      return {
        type: ActionTypes.SECTION_CREATED,
        resp: resp
      };
    },


    renameSection: function (path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.UPDATE_SECTION });
        dispatch({ type: ActionTypes.UPDATE_TAGS });

        sync(API_ROOT + 'update-section', { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.sectionUpdated(response));
              dispatch(Actions.renameSectionTags({
                site_name: response.site,
                section_name: response.section.name,
                section_old_name: response.old_name
              }));
            }
            onComplete(response);
          });
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

    renameSectionsSitename: function (data) {
      return {
        type: ActionTypes.RENAME_SECTIONS_SITENAME,
        data: data
      };
    },

    deleteSiteSections: function (data) {
      return {
        type: ActionTypes.DELETE_SITE_SECTIONS,
        data: data
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
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.DELETE_SECTION });
        dispatch({ type: ActionTypes.UPDATE_TAGS });

        sync(API_ROOT + 'delete-section/' + encodeURIComponent(site) + '/' + encodeURIComponent(section), {}, 'DELETE')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.sectionDeleted(response));

              dispatch(Actions.deleteSectionTags({
                site_name: response.site,
                section_name: response.name
              }));
            }
            onComplete(response);
          });
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
