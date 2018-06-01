(function(window) {
  'use strict';

  window.Actions = window.Actions || {};

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

    renameSectionTags: function (data) {
      return {
        type: ActionTypes.RENAME_SECTION_TAGS,
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

})(window);
