(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

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
    siteCreated: function(site) {
      return {
        type: ActionTypes.SITE_CREATED,
        site: site
      };
    },

    renameSite: function (path, value, onComplete) {
      return function (dispatch, getStore) {
        dispatch({ type: ActionTypes.UPDATE_SITE });
        dispatch({ type: ActionTypes.UPDATE_SECTION });

        sync(API_ROOT + 'update-site', { path: path, value: value })
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
            }
            onComplete(response);
          });
      }
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
        }
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
          // @@@:TODO: Remove this callback when migration to ReactJS is completed
          onComplete: onComplete
        },
        sites: sites
      };
    }
  });
})(window, document);
