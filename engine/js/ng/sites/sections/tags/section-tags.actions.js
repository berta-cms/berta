(function (window, ActionTypes, sync) {
  'use strict';

  var Actions = window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    addSiteSectionsTags: function (data) {
      return {
        type: ActionTypes.ADD_SITE_SECTIONS_TAGS,
        data: data
      };
    },

    addSectionTags: function (data) {
      return {
        type: ActionTypes.ADD_SECTION_TAGS,
        data: data
      };
    },

    initOrderSectionTags: function (site, section, tag, value, onComplete) {
      return function (dispatch) {
        dispatch({
          type: ActionTypes.INIT_ORDER_SECTION_TAGS
        });

        sync(window.Berta.urls.sectionTags, {
          site: site,
          section: section,
          tag: tag,
          value: value
        }, 'PUT')
          .then(function (response) {
            if (response.error_message) {
              // @TODO dispatch error message
            } else {
              dispatch(Actions.orderSectionTags(response));
            }
            onComplete();
          });
      };
    },

    orderSectionTags: function (data) {
      return {
        type: ActionTypes.ORDER_SECTION_TAGS,
        data: data
      };
    },

    renameSectionTags: function (data) {
      return {
        type: ActionTypes.RENAME_SECTION_TAGS,
        data: data
      };
    },

    updateSectionTags: function (data) {
      return {
        type: ActionTypes.UPDATE_SECTION_TAGS,
        data: data
      };
    },

    renameSectionTagsSitename: function (data) {
      return {
        type: ActionTypes.RENAME_SECTION_TAGS_SITENAME,
        data: data
      };
    },

    deleteSectionTags: function (data) {
      return {
        type: ActionTypes.DELETE_SECTION_TAGS,
        data: data
      };
    },

    deleteSiteSectionsTags: function (data) {
      return {
        type: ActionTypes.DELETE_SITE_SECTIONS_TAGS,
        data: data
      };
    }

  });

})(window, window.ActionTypes, window.sync);
