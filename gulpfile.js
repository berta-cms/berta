var gulp = require('gulp'),
    gulp_concat = require('gulp-concat'),
    gulp_rebase_css_urls = require('gulp-rebase-css-urls'),
    gulp_minify_css = require('gulp-minify-css'),
    watch = require('gulp-watch'),
    livereload = require('gulp-livereload'),
    notify = require('gulp-notify');

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

gulp.task('default', ['css_backend', 'css_frontend'], function() {

    livereload.listen();

    gulp.watch(css_backend_files, function(event) {
        gulp.start('css_backend');
    });
    gulp.watch(css_frontend_files, function(event) {
        gulp.start('css_frontend');
    });
});