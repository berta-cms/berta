var gulp = require('gulp'),
    gulp_sourcemaps = require('gulp-sourcemaps'),
    gulp_concat = require('gulp-concat'),
    gulp_rebase_css_urls = require('gulp-rebase-css-urls'),
    gulp_minify_css = require('gulp-minify-css'),
    gulp_uglify_js = require('gulp-uglify'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint');

var css_backend_files = [
    'engine/_lib/video-js/video-js.min.css',
    'engine/_lib/berta/default.css',
    'engine/_lib/moorainbow/mooRainbow.css',
    'engine/_lib/introjs/introjs.min.css'
    ];

var css_frontend_files = [
    'engine/_lib/video-js/video-js.min.css',
    'engine/_lib/berta/default.css',
    'engine/_lib/milkbox/css/milkbox/milkbox.css'
    ];

var js_backend_files = [
    'engine/_lib/mootools/mootools-core-1.4.5-full-compat-yc.js',
    'engine/_lib/mootools/mootools-1.2.5.1-more.js',
    'engine/_lib/mootools/mootools-1.2.5.1-more-delegation.js',
    'engine/_lib/mootools/Element.Data.js',
    'engine/_lib/mgfx/rotater.js',
    'engine/_lib/mgfx/tabs.js',
    'engine/_lib/picturefill/picturefill.min.js',
    'engine/_lib/video-js/video.min.js',
    'engine/js/BertaGallery.js',
    'engine/_lib/introjs/intro.min.js',
    'engine/js/Assets.js',
    'engine/js/BertaEditorBase.js',
    'engine/js/inline_edit.js',
    'engine/js/BertaGalleryEditorAssets.js',
    'engine/js/BertaGalleryEditor.js',
    'engine/js/BertaBgEditor.js',
    'engine/js/BertaEditor.js',
    'engine/_lib/tiny_mce/tiny_mce_gzip.js',
    'engine/_lib/moorainbow/mooRainbow.1.2b2.js',
    'engine/_lib/lassocrop/lassocrop.js',
    'engine/js/BertaEditor_Sections.js',
    'engine/js/BertaEditor_Seo.js',
    'engine/js/BertaEditor_ChangePassword.js',
    'engine/js/BertaEditor_Multisite.js',
    'node_modules/promise-polyfill/dist/polyfill.min.js',
    'node_modules/whatwg-fetch/fetch.js',
    'node_modules/immutable/dist/immutable.min.js',
    'node_modules/redux/dist/redux.min.js',
    'node_modules/redux-thunk/dist/redux-thunk.min.js'
];

var js_ng_backend_files = [
  'engine/js/ng/utils.js',
  'engine/js/ng/constants/constants.js',
  'engine/js/ng/constants/ActionTypes.js',
  'engine/js/ng/actions/StateActions.js',
  'engine/js/ng/actions/SiteActions.js',
  'engine/js/ng/actions/SettingsActions.js',
  'engine/js/ng/actions/SiteTemplateSettingsActions.js',
  'engine/js/ng/actions/SectionActions.js',
  'engine/js/ng/actions/EntryActions.js',
  'engine/js/ng/actions/TagActions.js',
  'engine/js/ng/reducers/sites.js',
  'engine/js/ng/reducers/site_settings.js',
  'engine/js/ng/reducers/site_template_settings.js',
  'engine/js/ng/reducers/template_settings.js',
  'engine/js/ng/reducers/sections.js',
  'engine/js/ng/reducers/entries.js',
  'engine/js/ng/reducers/tags.js',
  'engine/js/ng/reducers/index.js',
  'engine/js/ng/index.js'
];

var js_frontend_files = [
    'engine/_lib/mootools/mootools-core-1.4.5-full-compat-yc.js',
    'engine/_lib/mootools/mootools-1.2.5.1-more.js',
    'engine/_lib/mootools/mootools-1.2.5.1-more-delegation.js',
    'engine/_lib/picturefill/picturefill.min.js',
    'engine/_lib/video-js/video.min.js',
    'engine/js/BertaGallery.js',
    'engine/js/Berta.js',
    'engine/_lib/milkbox/js/milkbox.js'
];

gulp.task('css_backend', function() {
    return gulp.src(css_backend_files)
        .pipe(gulp_rebase_css_urls('engine/css'))
        .pipe(gulp_concat('backend.min.css'))
        .pipe(gulp_minify_css())
        .pipe(gulp.dest('engine/css'))
        .pipe(livereload())
        .pipe(notify('CSS: backend compiled!'));
});

gulp.task('css_frontend', function() {
    return gulp.src(css_frontend_files)
        .pipe(gulp_rebase_css_urls('engine/css'))
        .pipe(gulp_concat('frontend.min.css'))
        .pipe(gulp_minify_css())
        .pipe(gulp.dest('engine/css'))
        .pipe(livereload())
        .pipe(notify('CSS: frontend compiled!'));
});

gulp.task('js_backend', function() {
    return gulp.src(js_backend_files)
        .pipe(gulp_sourcemaps.init())
        .pipe(gulp_concat('backend.min.js'))
        .pipe(gulp_uglify_js())
        .pipe(gulp_sourcemaps.write('/maps'))
        .pipe(gulp.dest('engine/js'))
        .pipe(livereload())
        .pipe(notify('JS: backend compiled!'));
});

gulp.task('js_ng_backend', function() {
    return gulp.src(js_ng_backend_files)
        .pipe(gulp_sourcemaps.init())
        .pipe(gulp_concat('ng-backend.min.js'))
        .pipe(gulp_uglify_js())
        .pipe(gulp_sourcemaps.write('/maps'))
        .pipe(gulp.dest('engine/js'))
        .pipe(livereload())
        .pipe(notify('JS: NG backend compiled!'));
});

gulp.task('js_frontend', function() {
    return gulp.src(js_frontend_files)
        .pipe(gulp_sourcemaps.init())
        .pipe(gulp_concat('frontend.min.js'))
        .pipe(gulp_uglify_js())
        .pipe(gulp_sourcemaps.write('/maps'))
        .pipe(gulp.dest('engine/js'))
        .pipe(livereload())
        .pipe(notify('JS: frontend compiled!'));
});

gulp.task('ng_lint', function() {
  return gulp.src(js_ng_backend_files)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default', ['css_backend', 'css_frontend', 'js_backend', 'ng_lint', 'js_ng_backend', 'js_frontend'], function() {

    livereload.listen();

    gulp.watch(css_backend_files, function(event) {
        gulp.start('css_backend');
    });

    gulp.watch(css_frontend_files, function(event) {
        gulp.start('css_frontend');
    });

    gulp.watch(js_backend_files, function(event) {
        gulp.start('js_backend');
    });

    gulp.watch(js_ng_backend_files, function(event) {
        gulp.start('js_ng_backend');
    });

    gulp.watch(js_frontend_files, function(event) {
        gulp.start('js_frontend');
    });
});
