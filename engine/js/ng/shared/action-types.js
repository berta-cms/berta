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
    SITES_ORDERED: 'SITES_ORDERED',

    UPDATE_SITE_SETTINGS: 'UPDATE_SITE_SETTINGS',
    SITE_SETTINGS_UPDATED: 'SITE_SETTINGS_UPDATED',
    SITE_SETTINGS_CREATED: 'SITE_SETTINGS_CREATED',
    DELETE_SITE_SETTINGS: 'DELETE_SITE_SETTINGS',
    SITE_SETTINGS_DELETED: 'SITE_SETTINGS_DELETED',
    RENAME_SITE_SETTINGS_SITENAME: 'RENAME_SITE_SETTINGS_SITENAME',

    UPDATE_SITE_TEMPLATE_SETTINGS: 'UPDATE_SITE_TEMPLATE_SETTINGS',
    SITE_TEMPLATE_SETTINGS_UPDATED: 'SITE_TEMPLATE_SETTINGS_UPDATED',
    TEMPLATE_SETTINGS_CREATED: 'TEMPLATE_SETTINGS_CREATED',
    DELETE_SITE_TEMPLATE_SETTINGS: 'DELETE_SITE_TEMPLATE_SETTINGS',
    SITE_TEMPLATE_SETTINGS_DELETED: 'SITE_TEMPLATE_SETTINGS_DELETED',
    RENAME_SITE_TEMPLATE_SETTINGS_SITENAME: 'RENAME_SITE_TEMPLATE_SETTINGS_SITENAME',

    CREATE_SECTION: 'CREATE_SECTION',
    SECTION_CREATED: 'SECTION_CREATED',
    UPDATE_SECTION: 'UPDATE_SECTION',
    RESET_SECTION: 'RESET_SECTION',
    SECTION_UPDATED: 'SECTION_UPDATED',
    DELETE_SECTION: 'DELETE_SECTION',
    DELETE_SITE_SECTIONS: 'DELETE_SITE_SECTIONS',
    SECTION_DELETED: 'SECTION_DELETED',
    ORDER_SECTIONS: 'ORDER_SECTIONS',
    SECTIONS_ORDERED: 'SECTIONS_ORDERED',
    RENAME_SECTIONS_SITENAME: 'RENAME_SECTIONS_SITENAME',

    SECTION_BACKGROUND_DELETE: 'SECTION_BACKGROUND_DELETE',
    SECTION_BACKGROUND_DELETED: 'SECTION_BACKGROUND_DELETED',
    SECTION_BACKGROUND_ORDER: 'SECTION_BACKGROUND_ORDER',
    SECTION_BACKGROUND_ORDERED: 'SECTION_BACKGROUND_ORDERED',

    ADD_SITE_TAGS: 'ADD_SITE_TAGS',
    ADD_SECTION_TAGS: 'ADD_SECTION_TAGS',
    UPDATE_TAGS: 'UPDATE_TAGS',
    RENAME_SECTION_TAGS: 'RENAME_SECTION_TAGS',
    DELETE_SECTION_TAGS: 'DELETE_SECTION_TAGS',
    RENAME_TAGS_SITENAME: 'RENAME_TAGS_SITENAME',
    DELETE_SITE_TAGS: 'DELETE_SITE_TAGS',
    SITE_TAGS_DELETED: 'SITE_TAGS_DELETED'
  };
})(window, document);
