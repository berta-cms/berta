(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    addSectionTags: function (data) {
      return {
        type: ActionTypes.ADD_SECTION_TAGS,
        data: data
      };
    },

    renameSectionTags: function (data) {
      return {
        type: ActionTypes.RENAME_SECTION_TAGS,
        data: data
      };
    },

    renameTagsSitename: function (data) {
      return {
        type: ActionTypes.RENAME_TAGS_SITENAME,
        data: data
      };
    },

    deleteSectionTags: function (data) {
      return {
        type: ActionTypes.DELETE_SECTION_TAGS,
        data: data
      };
    },

    deleteSiteTags: function (data) {
      return {
        type: ActionTypes.SITE_TAGS_DELETED,
        data: data
      };
    }

  });

})(window, document);
