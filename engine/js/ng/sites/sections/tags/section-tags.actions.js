(function (window, ActionTypes) {
  'use strict';

  var Actions = window.Actions = window.Actions || {};

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

    updateSectionTags: function (data) {
      return {
        type: ActionTypes.UPDATE_SECTION_TAGS,
        data: data
      };
    },

    deleteSectionTags: function (data) {
      return {
        type: ActionTypes.DELETE_SECTION_TAGS,
        data: data
      };
    },

  });

})(window, window.ActionTypes);
