(function (window, ActionTypes, sync) {
  'use strict';

  var Actions = window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    initCreateSite: function (site, onComplete) {
      return function (dispatch) {

        dispatch({
          type: ActionTypes.INIT_CREATE_SITE
        });

        sync(window.Berta.urls.sites, {
          site: site
        }, 'POST')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.createSite(response.site));

              if (response.settings) {
                dispatch(Actions.createSiteSettings(response.site.name, response.settings));
              }

              if (response.sections && response.sections.length) {
                for (var i = 0; i < response.sections.length; i++) {
                  dispatch(Actions.createSiteSection(response.sections[i]));
                }
              }

              if (response.entries && response.entries.length) {
                dispatch(Actions.addSiteSectionsEntries({
                  site_name: response.site.name,
                  entries: response.entries
                }));
              }

              if (response.tags && response.tags.section) {
                dispatch(Actions.addSiteSectionsTags({
                  site_name: response.site.name,
                  tags: response.tags
                }));
              }

              if (response.siteTemplateSettings) {
                dispatch(Actions.createSiteTemplateSettings(response.site.name, response.siteTemplateSettings));
              }
            }
            onComplete(response.site);
          });
      };
    },

    createSite: function (data) {
      return {
        type: ActionTypes.CREATE_SITE,
        data: data
      };
    },

    initUpdateSite: function (path, value, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.INIT_UPDATE_SITE
        });

        sync(window.Berta.urls.sites, {
          path: path,
          value: value
        })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.updateSite(response));
            }
            onComplete(response);
          });
      };
    },

    updateSite: function (resp) {
      return {
        type: ActionTypes.UPDATE_SITE,
        resp: resp
      };
    },

    renameSite: function (path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({
          type: ActionTypes.INIT_UPDATE_SITE
        });
        dispatch({
          type: ActionTypes.INIT_UPDATE_SITE_SECTION
        });
        dispatch({
          type: ActionTypes.INIT_UPDATE_SITE_SETTINGS
        });
        dispatch({
          type: ActionTypes.INIT_UPDATE_SITE_TEMPLATE_SETTINGS
        });
        dispatch({
          type: ActionTypes.INIT_UPDATE_SECTION_TAGS
        });
        dispatch({
          type: ActionTypes.INIT_UPDATE_SECTION_ENTRIES
        });

        sync(window.Berta.urls.sites, {
          path: path,
          value: value
        })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              path = path.split('/');
              var order = parseInt(path[1], 10);
              var site = getStore().sites.find(function (site) {
                return site.get('order') === order;
              });

              dispatch(Actions.updateSite(response));
              dispatch(Actions.renameSiteSectionsSitename({
                site: site,
                site_name: response.value
              }));
              dispatch(Actions.renameSiteSettingsSitename({
                site: site,
                site_name: response.value
              }));
              dispatch(Actions.renameSiteTemplateSettingsSitename({
                site: site,
                site_name: response.value
              }));
              dispatch(Actions.renameSectionTagsSitename({
                site: site,
                site_name: response.value
              }));
              dispatch(Actions.renameSectionEntriesSitename({
                site: site,
                site_name: response.value
              }));
            }
            onComplete(response);
          });
      };
    },

    initOrderSites: function (sites, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.INIT_ORDER_SITES
        });

        sync(window.Berta.urls.sites, sites, 'PUT')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.orderSites(sites));
            }
            onComplete(response);
          });
      };
    },

    orderSites: function (resp) {
      return {
        type: ActionTypes.ORDER_SITES,
        resp: resp
      };
    },

    initdeleteSite: function (site, onComplete) {
      return function (dispatch) {

        // @TODO also delete related: entries

        dispatch({
          type: ActionTypes.INIT_DELETE_SITE
        });
        dispatch({
          type: ActionTypes.INIT_DELETE_SITE_SECTIONS
        });
        dispatch({
          type: ActionTypes.INIT_DELETE_SITE_SETTINGS
        });
        dispatch({
          type: ActionTypes.INIT_DELETE_SITE_TEMPLATE_SETTINGS
        });
        dispatch({
          type: ActionTypes.INIT_DELETE_SITE_SECTIONS_TAGS
        });
        dispatch({
          type: ActionTypes.INIT_DELETE_SITE_SECTIONS_ENTRIES
        });

        sync(window.Berta.urls.sites, {
          site: site
        }, 'DELETE')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.deleteSite(response));
              dispatch(Actions.deleteSiteSections({
                site_name: response.name
              }));
              dispatch(Actions.deleteSiteSettings({
                site_name: response.name
              }));
              dispatch(Actions.deleteSiteTemplateSettings({
                site_name: response.name
              }));
              dispatch(Actions.deleteSiteSectionsTags({
                site_name: response.name
              }));
              dispatch(Actions.deleteSiteSectionsEntries({
                site_name: response.name
              }));
            }
            onComplete(response);
          });
      };
    },

    deleteSite: function (resp) {
      return {
        type: ActionTypes.DELETE_SITE,
        resp: resp
      };
    }
  });
})(window, window.ActionTypes, window.sync);
