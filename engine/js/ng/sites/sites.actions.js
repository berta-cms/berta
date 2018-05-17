(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    createSite: function (site, onComplete) {
      return function (dispatch, getStore) {

        dispatch({ type: ActionTypes.CREATE_SITE });

        sync(window.Berta.urls.sites, {site: site}, 'POST')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {

              // @TODO when created site is a clone we need to clone
              // related sections, entries, tags, settings, template settings

              dispatch(Actions.siteCreated(response.site));
              if (response.settings) {
                dispatch(Actions.siteSettingsCreated(response.site.name, response.settings));
              }
              if (response.sections && response.sections.length) {
                for (var i = 0; i < response.sections.length; i++) {
                  dispatch(Actions.sectionCreated(response.sections[i]));
                }
              }
              /** @todo: handle entries in frontend
              if (response.entries && response.entries.length) {
                for (var i = 0; i < response.entries.length; i++) {
                  dispatch(Actions.sectionCreated(response.entries[i]));
                }
              } */

              if (response.tags && response.tags.section) {
                dispatch(Actions.addSiteTags({
                  site_name: response.site.name,
                  tags: response.tags
                }));
              }

              if (response.siteTemplateSettings) {
                dispatch(Actions.templateSettingsCreated(response.site.name, response.siteTemplateSettings));
              }
            }
            onComplete(response.site);
          });
      };
    },

    siteCreated: function(data) {
      return {
        type: ActionTypes.SITE_CREATED,
        data: data
      };
    },

    renameSite: function (path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.UPDATE_SITE });
        dispatch({ type: ActionTypes.UPDATE_SECTION });
        dispatch({ type: ActionTypes.UPDATE_SITE_SETTINGS });
        dispatch({ type: ActionTypes.UPDATE_SITE_TEMPLATE_SETTINGS });
        dispatch({ type: ActionTypes.UPDATE_TAGS });

        sync(window.Berta.urls.sites, { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              path = path.split('/');
              var order = parseInt(path[1], 10);
              var site = getStore().sites.find(function (site) {
                return site.get('order') === order;
              });

              dispatch(Actions.siteUpdated(response));
              dispatch(Actions.renameSectionsSitename({
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
              dispatch(Actions.renameTagsSitename({
                site: site,
                site_name: response.value
              }));
            }
            onComplete(response);
          });
      };
    },

    updateSite: function(path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.UPDATE_SITE });

        sync(window.Berta.urls.sites, { path: path, value: value })
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteUpdated(response));
            }
            onComplete(response);
          });
      };
    },

    siteUpdated: function(resp) {
      return {
        type: ActionTypes.SITE_UPDATED,
        resp: resp
      };
    },

    deleteSite: function(site, onComplete) {
      return function (dispatch, getStore) {

        // @TODO also delete related: entries

        dispatch({ type: ActionTypes.DELETE_SITE });
        dispatch({ type: ActionTypes.DELETE_SECTION });
        dispatch({ type: ActionTypes.DELETE_SITE_SETTINGS });
        dispatch({ type: ActionTypes.DELETE_SITE_TEMPLATE_SETTINGS });
        dispatch({ type: ActionTypes.DELETE_SITE_TAGS });

        sync(window.Berta.urls.sites, {site: site}, 'DELETE')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.siteDeleted(response));
              dispatch(Actions.deleteSiteSections({
                site_name: response.name
              }));
              dispatch(Actions.deleteSiteSettings({
                site_name: response.name
              }));
              dispatch(Actions.deleteSiteTemplateSettings({
                site_name: response.name
              }));
              dispatch(Actions.deleteSiteTags({
                site_name: response.name
              }));
            }
            onComplete(response);
          });
      };
    },

    siteDeleted: function(resp) {
      return {
        type: ActionTypes.SITE_DELETED,
        resp: resp
      };
    },

    orderSites: function(sites, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.ORDER_SITES });

        sync(window.Berta.urls.sites, sites, 'PUT')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.sitesOrdered(sites));
            }
            onComplete(response);
          });
      };
    },

    sitesOrdered: function(resp) {
      return {
        type: ActionTypes.SITES_ORDERED,
        resp: resp
      };
    }

  });
})(window, document);
