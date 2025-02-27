var gulp = require('gulp'),
    gulp_sourcemaps = require('gulp-sourcemaps'),
    gulp_concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    gulp_rebase_css_urls = require('gulp-rebase-css-urls'),
    gulp_minify_css = require('gulp-minify-css'),
    gulp_uglify_js = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace');

sass.compiler = require('node-sass');

var template = {
  messy: {
    dest: '_templates/messy-0.4.2',
    files: [
      '_templates/messy-0.4.2/scss/**/*.scss'
    ]
  },
  white: {
    dest: '_templates/white-0.3.5',
    files: [
      '_templates/white-0.3.5/scss/**/*.scss'
    ]
  },
  default: {
    dest: '_templates/default',
    files: [
      '_templates/default/scss/**/*.scss'
    ]
  },
  mashup: {
    dest: '_templates/mashup-0.3.5',
    files: [
      '_templates/mashup-0.3.5/scss/**/*.scss'
    ]
  }
};

var vendor_assets = [
  'node_modules/photoswipe/dist/default-skin/*.{png,gif,svg}',
];

var css_backend_files = [
  'node_modules/swiper/dist/css/swiper.min.css',
  'engine/_lib/berta/default.css',
  'engine/_lib/berta/swiper.css',
  'engine/_lib/moorainbow/mooRainbow.css',
  'node_modules/tinymce/skins/ui/oxide/skin.min.css',
];

var css_frontend_files = [
  'node_modules/swiper/dist/css/swiper.min.css',
  'node_modules/photoswipe/dist/photoswipe.css',
  'node_modules/photoswipe/dist/default-skin/default-skin.css',
  'engine/_lib/berta/default.css',
  'engine/_lib/berta/swiper.css',
  'engine/_lib/berta/photoswipe.css',
  'engine/_lib/milkbox/css/milkbox/milkbox.css'
];

var js_backend_files = [
  'engine/_lib/mootools/mootools-core-1.4.5-full-compat-yc.js',
  'engine/_lib/mootools/mootools-1.2.5.1-more.js',
  'engine/_lib/mootools/mootools-1.2.5.1-more-delegation.js',
  'engine/_lib/mootools/Element.Data.js',
  'engine/_lib/picturefill/picturefill.min.js',
  'engine/_lib/milkbox/js/milkbox.js',
  'engine/js/berta.helpers.js',
  'engine/js/BertaBackToTop.js',
  'engine/js/BertaGallerySlideshow.js',
  'engine/js/BertaGalleryRow.js',
  'engine/js/BertaGalleryColumn.js',
  'engine/js/BertaGalleryPile.js',
  'engine/js/BertaGalleryLink.js',
  'engine/js/BertaPortfolio.js',
  'engine/js/Assets.js',
  'engine/js/BertaEditorBase.js',
  'engine/js/inline_edit.js',
  'engine/js/BertaGalleryEditorAssets.js',
  'engine/js/BertaGalleryEditor.js',
  'engine/js/BertaEditor.js',
  'node_modules/tinymce/tinymce.min.js',
  'node_modules/tinymce/themes/silver/theme.min.js',
  'node_modules/tinymce/icons/default/icons.min.js',
  'node_modules/tinymce/models/dom/model.min.js',
  'node_modules/tinymce/plugins/save/plugin.min.js',
  'node_modules/tinymce/plugins/code/plugin.min.js',
  'node_modules/tinymce/plugins/table/plugin.min.js',
  'node_modules/tinymce/plugins/lists/plugin.min.js',
  'node_modules/tinymce/plugins/link/plugin.min.js',
  'engine/_lib/moorainbow/mooRainbow.1.2b2.js',
  'engine/_lib/lassocrop/lassocrop.js',
  'node_modules/promise-polyfill/dist/polyfill.min.js',
  'node_modules/whatwg-fetch/fetch.js',
  'node_modules/immutable/dist/immutable.min.js',
  'node_modules/redux/dist/redux.min.js',
  'node_modules/redux-thunk/dist/redux-thunk.min.js',
  'node_modules/swiper/dist/js/swiper.min.js'
];

var js_ng_backend_files = [
  'engine/js/ng/shared/namespace.js',
  'engine/js/ng/shared/utils.js',
  'engine/js/ng/shared/constants.js',
  'engine/js/ng/shared/action-types.js',

  'engine/js/ng/state.actions.js',

  'engine/js/ng/sites/sites.actions.js',
  'engine/js/ng/sites/sites.reducer.js',

  'engine/js/ng/sites/settings/site-settings.actions.js',
  'engine/js/ng/sites/settings/site-settings.reducer.js',

  'engine/js/ng/sites/template-settings/site-template-settings.actions.js',
  'engine/js/ng/sites/template-settings/site-template-settings.reducer.js',

  'engine/js/ng/sites/sections/site-sections.actions.js',
  'engine/js/ng/sites/sections/site-sections.reducer.js',
  'engine/js/ng/sites/sections/tags/section-tags.actions.js',
  'engine/js/ng/sites/sections/tags/section-tags.reducer.js',
  'engine/js/ng/sites/sections/entries/section-entries.actions.js',
  'engine/js/ng/sites/sections/entries/section-entries.reducer.js',

  'engine/js/ng/site-templates/site-templates.reducer.js',

  'engine/js/ng/reducers.js',
  'engine/js/ng/index.js'
];

var js_frontend_files = [
  'engine/_lib/mootools/mootools-core-1.4.5-full-compat-yc.js',
  'engine/_lib/mootools/mootools-1.2.5.1-more.js',
  'engine/_lib/mootools/mootools-1.2.5.1-more-delegation.js',
  'engine/_lib/mootools/Element.Data.js',
  'engine/_lib/picturefill/picturefill.min.js',
  'engine/js/berta.helpers.js',
  'engine/js/BertaBackToTop.js',
  'engine/js/BertaGallerySlideshow.js',
  'engine/js/BertaGalleryRow.js',
  'engine/js/BertaGalleryColumn.js',
  'engine/js/BertaGalleryPile.js',
  'engine/js/BertaGalleryLink.js',
  'engine/js/BertaGalleryFullscreen.js',
  'engine/js/BertaPortfolio.js',
  'engine/js/Berta.js',
  'engine/_lib/milkbox/js/milkbox.js',
  'node_modules/swiper/dist/js/swiper.min.js',
  'node_modules/photoswipe/dist/photoswipe.min.js',
  'node_modules/photoswipe/dist/photoswipe-ui-default.min.js'
];


function scssTemplates (scssFiles, outputDestination) {
  return function () {
    return gulp.src(scssFiles)
      .pipe(gulp_sourcemaps.init())
      .pipe(sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
      .pipe(gulp_sourcemaps.write('/maps'))
      .pipe(gulp.dest(outputDestination))
      .pipe(livereload())
      .pipe(notify('SCSS: compiled!'));
  };
}

gulp.task('scss_messy', scssTemplates(template.messy.files, template.messy.dest));
gulp.task('scss_white', scssTemplates(template.white.files, template.white.dest));
gulp.task('scss_default', scssTemplates(template.default.files, template.default.dest));
gulp.task('scss_mashup', scssTemplates(template.mashup.files, template.mashup.dest));

gulp.task('cleanup', function () {
  return gulp.src('engine/css/vendor', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('copy_vendor_assets', ['cleanup'], function () {
  return gulp.src(vendor_assets, {base: './node_modules/'})
    .pipe(gulp.dest('engine/css/vendor'));
});

gulp.task('css_backend', function () {
  return gulp.src(css_backend_files)
    .pipe(gulp_sourcemaps.init())
    .pipe(gulp_rebase_css_urls('engine/css'))
    .pipe(gulp_concat('backend.min.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp_minify_css())
    .pipe(gulp_sourcemaps.write('/maps'))
    .pipe(gulp.dest('engine/css'))
    .pipe(livereload())
    .pipe(notify('CSS: backend compiled!'));
});

gulp.task('css_frontend', function () {
  return gulp.src(css_frontend_files)
    .pipe(gulp_sourcemaps.init())
    .pipe(gulp_rebase_css_urls('engine/css'))
    .pipe(replace('../../node_modules', './vendor'))
    .pipe(gulp_concat('frontend.min.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp_minify_css())
    .pipe(gulp_sourcemaps.write('/maps'))
    .pipe(gulp.dest('engine/css'))
    .pipe(livereload())
    .pipe(notify('CSS: frontend compiled!'));
});

gulp.task('js_backend', function () {
  return gulp.src(js_backend_files)
    .pipe(gulp_sourcemaps.init())
    .pipe(gulpif('!**/*.min.js',gulp_uglify_js().on('error', function(e){
      console.log(e);
    })))
    .pipe(gulp_concat('backend.min.js'))
    .pipe(gulp_sourcemaps.write('/maps'))
    .pipe(gulp.dest('engine/js'))
    .pipe(livereload())
    .pipe(notify('JS: backend compiled!'));
});

gulp.task('js_ng_backend', function () {
  return gulp.src(js_ng_backend_files)
    .pipe(gulp_sourcemaps.init())
    .pipe(gulp_concat('ng-backend.min.js'))
    .pipe(gulp_uglify_js())
    .pipe(gulp_sourcemaps.write('/maps'))
    .pipe(gulp.dest('engine/js'))
    .pipe(livereload())
    .pipe(notify('JS: NG backend compiled!'));
});

gulp.task('js_frontend', function () {
  return gulp.src(js_frontend_files)
    .pipe(gulp_sourcemaps.init())
    .pipe(gulpif('!**/*.min.js',gulp_uglify_js().on('error', function(e){
      console.log(e);
    })))
    .pipe(gulp_concat('frontend.min.js'))
    .pipe(gulp.dest('engine/js'))
    .pipe(gulp_sourcemaps.write('/maps'))
    .pipe(livereload())
    .pipe(notify('JS: frontend compiled!'));
});

gulp.task('ng_lint', function () {
  return gulp.src(js_ng_backend_files)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('default', ['copy_vendor_assets', 'scss_messy', 'scss_white', 'scss_default', 'scss_mashup', 'css_backend', 'css_frontend', 'js_backend', 'ng_lint', 'js_ng_backend', 'js_frontend'], function () {

  livereload.listen();

  gulp.watch(template.messy.files, function () {
    gulp.start('scss_messy');
  });

  gulp.watch(template.white.files, function () {
    gulp.start('scss_white');
  });

  gulp.watch(template.default.files, function () {
    gulp.start('scss_default');
  });

  gulp.watch(template.mashup.files, function () {
    gulp.start('scss_mashup');
  });

  gulp.watch(css_backend_files, function () {
    gulp.start('css_backend');
  });

  gulp.watch(css_frontend_files, function () {
    gulp.start('css_frontend');
  });

  gulp.watch(js_backend_files, function () {
    gulp.start('js_backend');
  });

  gulp.watch(js_ng_backend_files, function () {
    gulp.start('js_ng_backend');
  });

  gulp.watch(js_frontend_files, function () {
    gulp.start('js_frontend');
  });
});
