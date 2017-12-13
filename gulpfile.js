var gulp = require('gulp')
var babelify = require('babelify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var uglify = require('gulp-uglify')

gulp.task('scripts', () => {
  return browserify(['lib/TextOperation.js'], {standalone: 'ot.TextOperation'})
  .transform(babelify, {
    presets: ['es2015'],
    plugins: ['add-module-exports']
  })
  .bundle()
  .pipe(source('bundle.js'))
  // You need this if you want to continue using the stream with other plugins
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('dist/'))
})
