(function(window, document) {
  'use strict';

  window.ActionTypes = {
    GET_STATE: 'GET_STATE',
    SET_STATE: 'SET_STATE',

    CREATE_SITE: 'CREATE_SITE',
    SITE_CREATED: 'SITE_CREATED',
    UPDATE_SITE: 'UPDATE_SITE',
    SITE_UPDATED: 'SITE_UPDATED',
    DELETE_SITE: 'DELETE_SITE',
    SITE_DELETED: 'SITE_DELETED',
    ORDER_SITES: 'ORDER_SITES',

    UPDATE_SETTINGS: 'UPDATE_SETTINGS',
    SETTINGS_UPDATED: 'SETTINGS_UPDATED',
    SETTINGS_CREATED: 'SETTINGS_CREATED',
    DELETE_SITE_SETTINGS: 'DELETE_SITE_SETTINGS',
    SITE_SETTINGS_DELETED: 'SITE_SETTINGS_DELETED',

    UPDATE_SITE_TEMPLATE_SETTINGS: 'UPDATE_SITE_TEMPLATE_SETTINGS',
    SITE_TEMPLATE_SETTINGS_UPDATED: 'SITE_TEMPLATE_SETTINGS_UPDATED',
    TEMPLATE_SETTINGS_CREATED: 'TEMPLATE_SETTINGS_CREATED',
    DELETE_SITE_TEMPLATE_SETTINGS: 'DELETE_SITE_TEMPLATE_SETTINGS',
    SITE_TEMPLATE_SETTINGS_DELETED: 'SITE_TEMPLATE_SETTINGS_DELETED',

    CREATE_SECTION: 'CREATE_SECTION',
    SECTION_CREATED: 'SECTION_CREATED',
    UPDATE_SECTION: 'UPDATE_SECTION',
    RESET_SECTION: 'RESET_SECTION',
    SECTION_UPDATED: 'SECTION_UPDATED',
    DELETE_SECTION: 'DELETE_SECTION',
    DELETE_SITE_SECTIONS: 'DELETE_SITE_SECTIONS',
    SECTION_DELETED: 'SECTION_DELETED',
    ORDER_SECTIONS: 'ORDER_SECTIONS',
    RENAME_SECTIONS_SITENAME: 'RENAME_SECTIONS_SITENAME',

    SECTION_BG_DELETE: 'SECTION_BG_DELETE',
    SECTION_BG_ORDER: 'SECTION_BG_ORDER',
    SECTION_BG_ORDERED: 'SECTION_BG_ORDERED',

    UPDATE_TAGS: 'UPDATE_TAGS',
    RENAME_SECTION_TAGS: 'RENAME_SECTION_TAGS',
    DELETE_SECTION_TAGS: 'DELETE_SECTION_TAGS'
  };
})(window, document);
