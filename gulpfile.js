var watch_scss_path = 'mazorca-gulp-test',
    main_scss_path = watch_scss_path + '/theme/',
    main_js_path = './js-gulp-test/',
    dist_js_path = 'dist',
    bs_path = '/Pruebas/Gulpfile/First/'
/**
 * Required modules
 * @type {[]}
 */
var gulp = require('gulp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();
var gutil = require("gulp-util");
var rename = require("gulp-rename");

//Sass
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sassdoc = require('sassdoc');

//JS
var babel = require("gulp-babel");
var webpack = require("webpack");
var webpackConfig = require('./webpack.config')(main_js_path, dist_js_path);
var concat = require('gulp-concat');

//sass and js sourcemaps
var sourcemaps = require('gulp-sourcemaps'); 

/**
 * Config options
 * @type {}
 */
var sassdocOptions = {
  dest: './docs/sassdoc',
  package: {
    title: 'Mazorca',
    name: 'Mazorca',
    version: '0.0.3',
    license: 'GNU',
    homepage: 'github.com/el-cultivo/mazoroca',
    description: 'Scss Framework'
  }
};

gulp.task('sass', function(){
  return gulp.src(main_scss_path + 'mazorca.scss')
    .pipe(sourcemaps.init())
    .pipe(sass()) // Using gulp-sass
    .pipe(rename("style.css"))
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
});

gulp.task('sassdoc', function () {
  return gulp
    .src(main_scss_path + 'mazorca.scss')
    .pipe(sassdoc(sassdocOptions))
    .resume();
});

gulp.task('webpack', function(callback) {
  var myConfig = Object.create(webpackConfig);
  myConfig.plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: {
                warnings: false
            }
          })
  ];

  // run webpack
  webpack(myConfig, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true,
      progress: true
    }));
    callback();
  });
});

gulp.task('browser-sync', function() {
  browserSync.init(['./style.css'],{ //files to inject
     proxy: "localhost:8888" + bs_path
  });
});


gulp.task('watch', ['browser-sync', 'sass', 'webpack'], function() {
  gulp.watch(watch_scss_path + '/**/*.scss', ['sass']); 
  gulp.watch('js-gulp-test/**/*.js', ['webpack']); 
  gulp.watch(dist_js_path + '/*.js', browserSync.reload); 
});







