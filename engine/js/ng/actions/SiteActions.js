(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  var API_ROOT = '/_api/v1/';

  Object.assign(window.Actions, {
    createSite: function(site, onComplete) {
      return {
        type: ActionTypes.CREATE_SITE,
        meta: {
          remote: true,
          url: API_ROOT + 'create-site',
          method: 'POST',
          dispatch: 'siteCreated',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete,
          data: {site: site}
        }
      };
    },
    siteCreated: function(site, callback) {
      return {
        type: ActionTypes.SITE_CREATED,
        site: site
      };
    },
    updateSite: function(path, value, onComplete) {
      return {
        type: ActionTypes.UPDATE_SITE,
        meta: {
          remote: true,
          url: API_ROOT + 'update-site',
          method: 'PATCH',
          data: {path: path, value: value},
          dispatch: 'siteUpdated',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete
        },
        path: path,
        value: value
      };
    },
    siteUpdated: function(resp) {
      return {
        type: ActionTypes.SITE_UPDATED,
        resp: resp
      };
    },
    deleteSite: function(site, onComplete) {
      return {
        type: ActionTypes.DELETE_SITE,
        meta: {
          remote: true,
          url: API_ROOT + 'delete-site/' + encodeURIComponent(site),
          method: 'DELETE',
          dispatch: 'siteDeleted',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete
        },
        site: site
      };
    },
    siteDeleted: function(resp) {
      return {
        type: ActionTypes.SITE_DELETED,
        resp: resp
      };
    },
    orderSites: function(sites, onComplete) {
      return {
        type: ActionTypes.ORDER_SITES,
        meta: {
          remote: true,
          method: 'PUT',
          url: API_ROOT + 'order-sites',
          data: sites,
          onComplete: onComplete
        },
        sites: sites
      };
    }
  });
})(window, document);
