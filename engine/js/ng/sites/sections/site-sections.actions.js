(function (window, ActionTypes, sync) {
  'use strict';

  var Actions = window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    initCreateSiteSection: function (site, name, title, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.INIT_CREATE_SITE_SECTION
        });
        dispatch({
          type: ActionTypes.INIT_UPDATE_SECTION_TAGS
        });

        sync(window.Berta.urls.siteSections, {
          site: site,
          name: name,
          title: title
        }, 'POST')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.createSiteSection(response.section));

              if (response.tags) {
                dispatch(Actions.addSectionTags({
                  site_name: site,
                  tags: response.tags
                }));
              }

              if (response.entries) {
                dispatch(Actions.addSectionEntries({
                  site_name: site,
                  entries: response.entries
                }));
              }
            }
            onComplete(response.section);
          });
      };
    },


    createSiteSection: function (resp) {
      return {
        type: ActionTypes.CREATE_SITE_SECTION,
        resp: resp
      };
    },


    initUpdateSiteSection: function (path, value, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.INIT_UPDATE_SITE_SECTION
        });

        sync(window.Berta.urls.siteSections, {
          path: path,
          value: value
        })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.updateSiteSection(response));
            }
            onComplete(response);
          });
      };
    },


    updateSiteSection: function (resp) {
      return {
        type: ActionTypes.UPDATE_SITE_SECTION,
        resp: resp
      };
    },


    initRenameSiteSection: function (path, value, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.INIT_UPDATE_SITE_SECTION
        });
        dispatch({
          type: ActionTypes.INIT_UPDATE_SECTION_TAGS
        });
        dispatch({
          type: ActionTypes.INIT_UPDATE_SECTION_ENTRIES
        });

        sync(window.Berta.urls.siteSections, {
          path: path,
          value: value
        })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.updateSiteSection(response));
              dispatch(Actions.renameSectionTags({
                site_name: response.site,
                section_name: response.section.name,
                section_old_name: response.old_name
              }));
              dispatch(Actions.renameSectionEntries({
                site_name: response.site,
                section_name: response.section.name,
                section_old_name: response.old_name
              }));
            }
            onComplete(response);
          });
      };
    },


    renameSiteSectionsSitename: function (data) {
      return {
        type: ActionTypes.RENAME_SITE_SECTIONS_SITENAME,
        data: data
      };
    },


    resetSiteSection: function (path, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.RESET_SITE_SECTION,
          path: path
        });

        sync(window.Berta.urls.siteSectionsReset, {
          path: path
        })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            }
            onComplete(response);
          });
      };
    },


    initOrderSiteSections: function (site, sections, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.INIT_ORDER_SITE_SECTIONS
        });

        sync(window.Berta.urls.siteSections, {
          site: site,
          sections: sections
        }, 'PUT')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.orderSiteSections({
                site: site,
                sections: sections
              }));
            }
            onComplete(response);
          });
      };
    },


    orderSiteSections: function (resp) {
      return {
        type: ActionTypes.ORDER_SITE_SECTIONS,
        resp: resp
      };
    },


    initDeleteSiteSection: function (site, section, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.INIT_DELETE_SITE_SECTION
        });
        dispatch({
          type: ActionTypes.INIT_UPDATE_SECTION_TAGS
        });
        dispatch({
          type: ActionTypes.INIT_DELETE_SECTION_ENTRIES
        });

        sync(window.Berta.urls.siteSections, {
          site: site,
          section: section
        }, 'DELETE')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.deleteSiteSection(response));

              dispatch(Actions.deleteSectionTags({
                site_name: response.site,
                section_name: response.name
              }));

              dispatch(Actions.deleteSectionEntries({
                site_name: response.site,
                section_name: response.name
              }));
            }
            onComplete(response);
          });
      };
    },


    deleteSiteSection: function (resp) {
      return {
        type: ActionTypes.DELETE_SITE_SECTION,
        resp: resp
      };
    },


    deleteSiteSections: function (data) {
      return {
        type: ActionTypes.DELETE_SITE_SECTIONS,
        data: data
      };
    },


    initOrderSiteSectionBackgrounds: function (site, section, files, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.INIT_ORDER_SITE_SECTION_BACKGROUNDS
        });

        sync(window.Berta.urls.siteSectionBackgrounds, {
          site: site,
          section: section,
          files: files
        }, 'PUT')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.orderSiteSectionBackgrounds(response));
            }
            onComplete(response);
          });
      };
    },


    orderSiteSectionBackgrounds: function (resp) {
      return {
        type: ActionTypes.ORDER_SITE_SECTION_BACKGROUNDS,
        resp: resp
      };
    },


    initDeleteSiteSectionBackground: function (site, section, file, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.INIT_DELETE_SITE_SECTION_BACKGROUND
        });

        sync(window.Berta.urls.siteSectionBackgrounds, {
          site: site,
          section: section,
          file: file
        }, 'DELETE')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.deleteSiteSectionBackground(response));
            }
            onComplete(response);
          });
      };
    },


    // There is no reducer for this action at the moment
    // `orderSiteSectionBackgrounds` is called after delete which updates state
    deleteSiteSectionBackground: function (resp) {
      return {
        type: ActionTypes.DELETE_SITE_SECTION_BACKGROUND,
        resp: resp
      };
    }
  });

})(window, window.ActionTypes, window.sync);
