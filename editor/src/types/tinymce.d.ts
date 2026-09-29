// TinyMCE's theme/icon/model/plugin/skin bundles are plain side-effect JS
// files with no accompanying .d.ts (only the `tinymce/tinymce` entry point
// ships types) — declared here so TypeScript can resolve the deep imports
// used to self-host TinyMCE without a CDN.
declare module 'tinymce/icons/*';
declare module 'tinymce/themes/*';
declare module 'tinymce/models/*';
declare module 'tinymce/plugins/*';
declare module 'tinymce/skins/*';
