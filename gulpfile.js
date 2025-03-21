const { src, dest, watch, series, parallel } = require("gulp");
const clean = require("gulp-clean");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require("gulp-if");
const rebaseCssUrls = require("gulp-rebase-css-urls");
const concat = require("gulp-concat");
const minifyCss = require("gulp-clean-css");
const minifyJs = require("gulp-uglify");
const replace = require("gulp-replace");
const jshint = require("gulp-jshint");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");

let production = false;

const templates = [
  {
    dest: "_templates/messy-0.4.2",
    files: ["_templates/messy-0.4.2/scss/**/*.scss"],
  },
  {
    dest: "_templates/white-0.3.5",
    files: ["_templates/white-0.3.5/scss/**/*.scss"],
  },
  {
    dest: "_templates/default",
    files: ["_templates/default/scss/**/*.scss"],
  },
  {
    dest: "_templates/mashup-0.3.5",
    files: ["_templates/mashup-0.3.5/scss/**/*.scss"],
  },
];

const vendorAssets = [
  "node_modules/photoswipe/dist/default-skin/*.{png,gif,svg}",
];

const tinymceSkinFiles = [
  "node_modules/tinymce/skins/ui/oxide/skin.min.css",
  "node_modules/tinymce/skins/ui/oxide/content.min.css",
  "node_modules/tinymce/skins/content/default/content.min.css",
];

const backendCssFiles = [
  "node_modules/swiper/dist/css/swiper.min.css",
  "engine/_lib/berta/default.css",
  "engine/_lib/berta/swiper.css",
];

const frontendCssFiles = [
  "node_modules/swiper/dist/css/swiper.min.css",
  "node_modules/photoswipe/dist/photoswipe.css",
  "node_modules/photoswipe/dist/default-skin/default-skin.css",
  "engine/_lib/berta/default.css",
  "engine/_lib/berta/swiper.css",
  "engine/_lib/berta/photoswipe.css",
  "engine/_lib/milkbox/css/milkbox/milkbox.css",
];

const backendJsFiles = [
  "engine/_lib/mootools/mootools-core-1.4.5-full-compat-yc.js",
  "engine/_lib/mootools/mootools-1.2.5.1-more.js",
  "engine/_lib/mootools/mootools-1.2.5.1-more-delegation.js",
  "engine/_lib/mootools/Element.Data.js",
  "engine/_lib/picturefill/picturefill.min.js",
  "engine/_lib/milkbox/js/milkbox.js",
  "engine/js/berta.helpers.js",
  "engine/js/BertaBackToTop.js",
  "engine/js/BertaGallerySlideshow.js",
  "engine/js/BertaGalleryRow.js",
  "engine/js/BertaGalleryColumn.js",
  "engine/js/BertaGalleryPile.js",
  "engine/js/BertaGalleryLink.js",
  "engine/js/BertaPortfolio.js",
  "engine/js/Assets.js",
  "engine/js/BertaEditorBase.js",
  "engine/js/inline_edit.js",
  "engine/js/BertaEditor.js",
  "node_modules/tinymce/tinymce.min.js",
  "node_modules/tinymce/themes/silver/theme.min.js",
  "node_modules/tinymce/icons/default/icons.min.js",
  "node_modules/tinymce/models/dom/model.min.js",
  "node_modules/tinymce/plugins/save/plugin.min.js",
  "node_modules/tinymce/plugins/code/plugin.min.js",
  "node_modules/tinymce/plugins/table/plugin.min.js",
  "node_modules/tinymce/plugins/lists/plugin.min.js",
  "node_modules/tinymce/plugins/link/plugin.min.js",
  "node_modules/promise-polyfill/dist/polyfill.min.js",
  "node_modules/whatwg-fetch/fetch.js",
  "node_modules/immutable/dist/immutable.min.js",
  "node_modules/redux/dist/redux.min.js",
  "node_modules/redux-thunk/dist/redux-thunk.min.js",
  "node_modules/swiper/dist/js/swiper.min.js",
];

var backendNgJsFiles = [
  "engine/js/ng/shared/namespace.js",
  "engine/js/ng/shared/utils.js",
  "engine/js/ng/shared/constants.js",
  "engine/js/ng/shared/action-types.js",
  "engine/js/ng/state.actions.js",
  "engine/js/ng/sites/sites.actions.js",
  "engine/js/ng/sites/sites.reducer.js",
  "engine/js/ng/sites/settings/site-settings.actions.js",
  "engine/js/ng/sites/settings/site-settings.reducer.js",
  "engine/js/ng/sites/template-settings/site-template-settings.actions.js",
  "engine/js/ng/sites/template-settings/site-template-settings.reducer.js",
  "engine/js/ng/sites/sections/site-sections.actions.js",
  "engine/js/ng/sites/sections/site-sections.reducer.js",
  "engine/js/ng/sites/sections/tags/section-tags.actions.js",
  "engine/js/ng/sites/sections/tags/section-tags.reducer.js",
  "engine/js/ng/sites/sections/entries/section-entries.actions.js",
  "engine/js/ng/sites/sections/entries/section-entries.reducer.js",
  "engine/js/ng/site-templates/site-templates.reducer.js",
  "engine/js/ng/reducers.js",
  "engine/js/ng/index.js",
];

const frontendJsFiles = [
  "engine/_lib/mootools/mootools-core-1.4.5-full-compat-yc.js",
  "engine/_lib/mootools/mootools-1.2.5.1-more.js",
  "engine/_lib/mootools/mootools-1.2.5.1-more-delegation.js",
  "engine/_lib/mootools/Element.Data.js",
  "engine/_lib/picturefill/picturefill.min.js",
  "engine/js/berta.helpers.js",
  "engine/js/BertaBackToTop.js",
  "engine/js/BertaGallerySlideshow.js",
  "engine/js/BertaGalleryRow.js",
  "engine/js/BertaGalleryColumn.js",
  "engine/js/BertaGalleryPile.js",
  "engine/js/BertaGalleryLink.js",
  "engine/js/BertaGalleryFullscreen.js",
  "engine/js/BertaPortfolio.js",
  "engine/js/Berta.js",
  "engine/_lib/milkbox/js/milkbox.js",
  "node_modules/swiper/dist/js/swiper.min.js",
  "node_modules/photoswipe/dist/photoswipe.min.js",
  "node_modules/photoswipe/dist/photoswipe-ui-default.min.js",
];

const cleanupVendorAssets = () => {
  return src("engine/css/vendor", { read: false }).pipe(clean({ force: true }));
};

const copyVendorAssets = () => {
  return src(vendorAssets, { base: "./node_modules/" }).pipe(
    dest("engine/css/vendor")
  );
};

const cleanupTinymceSkinFiles = () => {
  return src("engine/js/skins", { read: false }).pipe(clean({ force: true }));
};
const copyTinymceSkinFiles = () => {
  return src(tinymceSkinFiles, { base: "./node_modules/tinymce/" }).pipe(
    dest("engine/js")
  );
};

const backendCss = () => {
  return src(backendCssFiles)
    .pipe(gulpif(production, sourcemaps.init()))
    .pipe(rebaseCssUrls("engine/css"))
    .pipe(concat("backend.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulpif(production, minifyCss()))
    .pipe(gulpif(production, sourcemaps.write("/maps")))
    .pipe(dest("engine/css"));
};

const frontendCss = () => {
  return src(frontendCssFiles)
    .pipe(gulpif(production, sourcemaps.init()))
    .pipe(rebaseCssUrls("engine/css"))
    .pipe(replace("../../node_modules", "./vendor"))
    .pipe(concat("frontend.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulpif(production, minifyCss()))
    .pipe(gulpif(production, sourcemaps.write("/maps")))
    .pipe(dest("engine/css"));
};

const templateCss = (scssFiles, outputDestination) => {
  return src(scssFiles)
    .pipe(gulpif(production, sourcemaps.init()))
    .pipe(
      sass({
        outputStyle: production ? "compressed" : "nested",
      }).on("error", sass.logError)
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulpif(production, sourcemaps.write("/maps")))
    .pipe(dest(outputDestination));
};

const templatesCss = (cb) => {
  templates.map((template) => {
    templateCss(template.files, template.dest);

    if (!production) {
      watch(template.files, async () => {
        await templateCss(template.files, template.dest);
      });
    }
  });

  cb();
};

const backendJs = () => {
  return src(backendJsFiles)
    .pipe(gulpif(production, sourcemaps.init()))
    .pipe(
      gulpif(
        "!**/*.min.js" && production,
        minifyJs().on("error", function (e) {
          console.log(e);
        })
      )
    )
    .pipe(concat("backend.min.js"))
    .pipe(gulpif(production, sourcemaps.write("/maps")))
    .pipe(dest("engine/js"));
};

const frontendJs = () => {
  return src(frontendJsFiles)
    .pipe(gulpif(production, sourcemaps.init()))
    .pipe(
      gulpif(
        "!**/*.min.js" && production,
        minifyJs().on("error", function (e) {
          console.log(e);
        })
      )
    )
    .pipe(concat("frontend.min.js"))
    .pipe(gulpif(production, sourcemaps.write("/maps")))
    .pipe(dest("engine/js"));
};

const backendNgJsLint = () => {
  return src(backendNgJsFiles).pipe(jshint()).pipe(jshint.reporter("default"));
};

const backendNgJs = () => {
  return src(backendNgJsFiles)
    .pipe(gulpif(production, sourcemaps.init()))
    .pipe(concat("ng-backend.min.js"))
    .pipe(
      gulpif(
        production,
        minifyJs().on("error", function (e) {
          console.log(e);
        })
      )
    )
    .pipe(gulpif(production, sourcemaps.write("/maps")))
    .pipe(dest("engine/js"));
};

const tasks = series(
  cleanupVendorAssets,
  copyVendorAssets,
  cleanupTinymceSkinFiles,
  copyTinymceSkinFiles,
  parallel(
    templatesCss,
    backendCss,
    frontendCss,
    backendJs,
    frontendJs,
    backendNgJsLint,
    backendNgJs
  )
);

const build = (cb) => {
  production = true;
  tasks();
  cb();
};

const dev = (cb) => {
  tasks();
  watch(backendCssFiles, backendCss);
  watch(frontendCssFiles, frontendCss);
  watch(backendJsFiles, backendJs);
  watch(frontendJsFiles, frontendJs);
  watch(backendNgJsFiles, parallel(backendNgJsLint, backendNgJs));
  cb();
};

exports.build = build;
exports.default = dev;
