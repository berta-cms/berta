(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {
    createSection: function(site, name, title, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.CREATE_SECTION });
        dispatch({ type: ActionTypes.UPDATE_TAGS });

        sync(window.Berta.urls.section, { site: site, name: name, title: title }, 'POST')
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

        sync(window.Berta.urls.section, { path: path, value: value })
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
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.UPDATE_SECTION });

        sync(window.Berta.urls.section, { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.sectionUpdated(response));
            }
            onComplete(response);
          });
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
      return function (dispatch, getStore) {
        dispatch({
          type: ActionTypes.RESET_SECTION,
          path: path
        });

        sync(window.Berta.urls.section_reset, { path: path })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            }
            onComplete(response);
          });
      };
    },


    deleteSection: function(site, section, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.DELETE_SECTION });
        dispatch({ type: ActionTypes.UPDATE_TAGS });

        sync(window.Berta.urls.section, {site: site, section: section}, 'DELETE')
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
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.ORDER_SECTIONS });

        sync(window.Berta.urls.section, {site: site, sections: sections}, 'PUT')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.sectionsOrdered({site: site, sections: sections}));
            }
            onComplete(response);
          });
      };
    },


    sectionsOrdered: function(resp) {
      return {
        type: ActionTypes.SECTIONS_ORDERED,
        resp: resp
      };
    },


    sectionBackgroundDelete: function(site, section, file, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.SECTION_BACKGROUND_DELETE });

        sync(window.Berta.urls.section_background, {site: site, section: section, file: file}, 'DELETE')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.sectionBackgroundDeleted(response));
            }
            onComplete(response);
          });
      };
    },


    sectionBackgroundDeleted: function (resp) {
      return {
        type: ActionTypes.SECTION_BACKGROUND_DELETED,
        resp: resp
      };
    },


    sectionBackgroundOrder: function(site, section, files, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.SECTION_BACKGROUND_ORDER });

        sync(window.Berta.urls.section_background, {site: site, section: section, files: files}, 'PUT')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.sectionBackgroundOrdered(response));
            }
            onComplete(response);
          });
      };
    },


    sectionBackgroundOrdered: function(resp) {
      return {
        type: ActionTypes.SECTION_BACKGROUND_ORDERED,
        resp: resp
      };
    }
  });

})(window, document);
