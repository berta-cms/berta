(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    createSiteSection: function(site, name, title, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.CREATE_SITE_SECTION });
        dispatch({ type: ActionTypes.UPDATE_SECTION_TAGS });

        sync(window.Berta.urls.site_sections, { site: site, name: name, title: title }, 'POST')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteSectionCreated(response.section));

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


    siteSectionCreated: function(resp) {
      return {
        type: ActionTypes.SITE_SECTION_CREATED,
        resp: resp
      };
    },


    renameSiteSection: function (path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.UPDATE_SITE_SECTION });
        dispatch({ type: ActionTypes.UPDATE_SECTION_TAGS });

        sync(window.Berta.urls.site_sections, { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteSectionUpdated(response));
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


    updateSiteSection: function(path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.UPDATE_SITE_SECTION });

        sync(window.Berta.urls.site_sections, { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteSectionUpdated(response));
            }
            onComplete(response);
          });
      };
    },


    siteSectionUpdated: function(resp) {
      return {
        type: ActionTypes.SITE_SECTION_UPDATED,
        resp: resp
      };
    },


    renameSiteSectionsSitename: function (data) {
      return {
        type: ActionTypes.RENAME_SITE_SECTIONS_SITENAME,
        data: data
      };
    },


    resetSiteSection: function(path, onComplete) {
      return function (dispatch, getStore) {
        dispatch({
          type: ActionTypes.RESET_SITE_SECTION,
          path: path
        });

        sync(window.Berta.urls.site_sections_reset, { path: path })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            }
            onComplete(response);
          });
      };
    },


    deleteSiteSections: function (data) {
      return {
        type: ActionTypes.SITE_SECTIONS_DELETED,
        data: data
      };
    },


    deleteSiteSection: function(site, section, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.DELETE_SITE_SECTION });
        dispatch({ type: ActionTypes.UPDATE_SECTION_TAGS });

        sync(window.Berta.urls.site_sections, {site: site, section: section}, 'DELETE')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteSectionDeleted(response));

              dispatch(Actions.deleteSectionTags({
                site_name: response.site,
                section_name: response.name
              }));
            }
            onComplete(response);
          });
      };
    },


    siteSectionDeleted: function(resp) {
      return {
        type: ActionTypes.SITE_SECTION_DELETED,
        resp: resp
      };
    },


    orderSiteSections: function(site, sections, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.ORDER_SITE_SECTIONS });

        sync(window.Berta.urls.site_sections, {site: site, sections: sections}, 'PUT')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteSectionsOrdered({site: site, sections: sections}));
            }
            onComplete(response);
          });
      };
    },


    siteSectionsOrdered: function(resp) {
      return {
        type: ActionTypes.SITE_SECTIONS_ORDERED,
        resp: resp
      };
    },


    siteSectionBackgroundDelete: function(site, section, file, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.SITE_SECTION_BACKGROUND_DELETE });

        sync(window.Berta.urls.site_section_backgrounds, {site: site, section: section, file: file}, 'DELETE')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteSectionBackgroundDeleted(response));
            }
            onComplete(response);
          });
      };
    },


    siteSectionBackgroundDeleted: function (resp) {
      return {
        type: ActionTypes.SITE_SECTION_BACKGROUND_DELETED,
        resp: resp
      };
    },


    siteSectionBackgroundOrder: function(site, section, files, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.SITE_SECTION_BACKGROUND_ORDER });

        sync(window.Berta.urls.site_section_backgrounds, {site: site, section: section, files: files}, 'PUT')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteSectionBackgroundOrdered(response));
            }
            onComplete(response);
          });
      };
    },


    siteSectionBackgroundOrdered: function(resp) {
      return {
        type: ActionTypes.SITE_SECTION_BACKGROUND_ORDERED,
        resp: resp
      };
    }
  });

})(window, document);
