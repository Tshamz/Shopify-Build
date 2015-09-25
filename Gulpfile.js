var gulp               = require('gulp');
var sass               = require('gulp-sass');
var watch              = require('gulp-watch');
var concat             = require('gulp-concat');
var uglify             = require('gulp-uglify');
var notify             = require('gulp-notify');
var rename             = require('gulp-rename');
var filter             = require('gulp-filter');
var flatten            = require('gulp-flatten');
var changed            = require('gulp-changed');
var plumber            = require('gulp-plumber');
var imagemin           = require('gulp-imagemin');
var cssmin             = require('gulp-minify-css');
var sourcemaps         = require('gulp-sourcemaps');
var autoprefixer       = require('gulp-autoprefixer');
var shopify            = require('gulp-shopify-upload');

var del                = require('del');
var argv               = require('yargs').argv;
var runsequence        = require('run-sequence');
var config             = require('./config.json');

var defaultEnvironment = config.shopify.dev;

var plumberErrorHandler = {
  errorHandler: notify.onError({
    title: 'Gulp',
    message: "Error: <%= error.message %>"
  })
};

gulp.task('styles', function() {
  return gulp.src(['dev/styles/*.scss'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie >= 10', 'Android >= 4.3'] }))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: '.css', extname: '.liquid' }))
    .pipe(gulp.dest('deploy/assets'));
});

gulp.task('scripts', function() {
  return gulp.src(['dev/scripts/*.js'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(rename({ suffix: '.js', extname: '.liquid' }))
    .pipe(gulp.dest('deploy/assets'));
});

gulp.task('vendor', function() {
  var styles = filter(['styles/**/*.scss']);
  var scripts = filter(['scripts/**/*.js']);
  return gulp.src(['dev/vendor/**'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(styles)
    .pipe(sourcemaps.init())
    .pipe(sass({ errLogToConsole: true }))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(styles.restore())
    .pipe(scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(scripts.restore())
    .pipe(flatten())
    .pipe(gulp.dest('deploy/assets'));
});

gulp.task('copy', function() {
  return gulp.src(['dev/liquid/**'], {base: 'dev/liquid'})
    .pipe(plumber(plumberErrorHandler))
    .pipe(changed('deploy/', {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest('deploy/'));
});

gulp.task('imagecopy', function() {
  return gulp.src(['dev/images/*'])
    .pipe(plumber(plumberErrorHandler))
    .pipe(changed('deploy/assets', {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest('deploy/assets'));
});

gulp.task('imagemin', function() {
  return gulp.src(['dev/images/*'])
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dev/images/'));
});

gulp.task('clean', function(cb) {
    del(['deploy/**/*'], cb);
});

gulp.task('build', ['clean'], function(cb) {
  runsequence(['copy', 'imagecopy', 'styles', 'scripts', 'vendor'], cb);
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['dev/styles/**/*.scss'], ['styles']);
  gulp.watch(['dev/scripts/**/*.js'], ['scripts']);
  gulp.watch(['dev/vendor/**/*.{js,scss}'], ['vendor']);
  gulp.watch(['dev/images/*'], ['imagecopy']);
  gulp.watch(['dev/liquid/**'], ['copy']);
});

gulp.task('upload', ['watch'], function() {
  if (!argv.env) {
    return false;
  } else if (argv.env && config.shopify.hasOwnProperty(argv.env)) {
    env = config.shopify[argv.env];
  } else {
    env = defaultEnvironment;
  }
  return watch('deploy/{assets|layout|config|snippets|templates|locales}/**')
    .pipe(shopify(env.apiKey, env.password, env.url, env.themeId, env.options));
});

gulp.task('default', ['clean', 'build', 'watch', 'upload']);
