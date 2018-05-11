(function(window, document) {
  'use strict';

  window.Actions = window.Actions || {};

  Object.assign(window.Actions, {

    renameSectionTags: function (data) {
      return {
        type: ActionTypes.RENAME_SECTION_TAGS,
        data: data
      };
    },

  });

})(window, document);
