(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  var API_ROOT = '/_api/v1/';

  Object.assign(window.Actions, {
    createSite: function(data, onComplete) {
      return {
        type: ActionTypes.CREATE_SITE,
        meta: {
          remote: true,
          url: API_ROOT + 'create-site',
          method: 'POST',
          dispatch: 'siteCreated',
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete,
          data: data
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
    siteUpdated: function(resp, callback) {
      return {
        type: ActionTypes.SITE_UPDATED,
        resp: resp
      };
    },
    deleteSite: function() {
      return {
        type: ActionTypes.DELETE_SITE,
        meta: {
          remote: true
          // url: '',
          // dispatch: ''
        }
      };
    },
    orderSites: function(sites) {
      return {
        type: ActionTypes.ORDER_SITES,
        meta: {
          remote: true,
          method: 'PUT',
          url: API_ROOT + 'order-sites',
          data: sites
        },
        sites: sites
      };
    }
  });
})(window, document);
