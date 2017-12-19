var gulp = require('gulp')
var babelify = require('babelify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var uglify = require('gulp-uglify')

var cached = require('gulp-cached')
var babel = require('gulp-babel')
var browserSync = require('browser-sync')
var del = require('del')

gulp.task('serve', ['clean:build', 'js'], () => {
  browserSync({
    port: 9999,
    logPrefix: 'SharedPen',
    server: {
      baseDir: "./"
    },
    notify: false
  })
  gulp.watch(['lib/*.js'], ['js'])
})

// compile js
gulp.task('js', () => {
  return gulp.src([
      'lib/*.js'
    ])
    .pipe(cached('jsing'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('build'))
})
// clean build dir
gulp.task('clean:build', () => {
  del.sync('build')
})

// gulp.task('scripts', () => {
//   return browserify(['lib/SharedPen.js'], {standalone: 'SharedPen'})
//     .transform(babelify, {
//       presets: ['es2015'],
//       plugins: ['add-module-exports']
//     })
//     .bundle()
//     .pipe(source('sharedpen.min.js'))
//     // You need this if you want to continue using the stream with other plugins
//     .pipe(buffer())
//     .pipe(uglify())
//     .pipe(gulp.dest('dist/'))
// })
