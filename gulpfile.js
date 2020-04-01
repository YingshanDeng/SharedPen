var gulp = require('gulp')
var babelify = require('babelify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var es = require('event-stream')
var cleanCSS = require('gulp-clean-css')
var cached = require('gulp-cached')
var babel = require('gulp-babel')
var del = require('del')
var browserSync = require('browser-sync')
var gzip = require('gulp-gzip')

// compile js/css
gulp.task('build:scripts', () => {
  return gulp.src('lib/*.js')
    .pipe(cached('jsing'))
    .pipe(babel({
      presets: ['es2015'],
      plugins: ['transform-es2015-modules-umd']
    }))
    .pipe(gulp.dest('build'))
})
gulp.task('build:css', () => {
  return gulp.src('lib/*.css')
    .pipe(gulp.dest('build/'))
})
// clean build dir
gulp.task('clean:build', (cb) => {
  del.sync('build')
  cb()
})

/** ******************* serve task *********************/
// serve sharedpen source files and compile them
gulp.task('watch', () => {
  browserSync({
    port: 5000,
    logPrefix: 'SharedPen',
    server: {
      baseDir: './build'
    },
    notify: false,
    open: false
  })
  gulp.watch('lib/*.js', gulp.task('build:scripts'))
  gulp.watch('lib/*.css', gulp.task('build:css'))
})

gulp.task('serve',
   gulp.series(
    'clean:build',
    gulp.parallel('build:scripts', 'build:css'),
    'watch'
  )
)

/** ******************* build task *********************/
gulp.task('build', gulp.series('clean:build', gulp.parallel('build:scripts', 'build:css')))

// bundle js/css
gulp.task('bundle:scripts', (cb) => {
  var bundles = [
    { standalone: 'SharedPen', entry: 'lib/SharedPen.js' },
    { standalone: 'SharedPenServer', entry: 'lib/SharedPenServer.js' }
  ]
  var tasks = bundles.map((bundle) => {
    return browserify(bundle.entry, { standalone: bundle.standalone })
      .transform(babelify, {
        presets: ['es2015']
      })
      .bundle()
      .pipe(source(bundle.entry.slice(bundle.entry.indexOf('/') + 1).toLowerCase()))
      .pipe(gulp.dest('dist/'))
      // You need this if you want to continue using the stream with other plugins
      .pipe(buffer())
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(gulp.dest('dist/'))
  })
  es.merge.apply(null, tasks)
  cb()
})

gulp.task('bundle:css', () => {
  return gulp.src('lib/SharedPen.css')
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'sharedpen'
    }))
    .pipe(gulp.dest('dist/'))
})

// clean dist dir
gulp.task('clean:dist', (cb) => {
  del.sync('dist')
  cb();
})

gulp.task('gzip', () => {
  return gulp.src('dist/**/*.min.js')
    .pipe(gzip({append: true}))
    .pipe(gulp.dest('dist/'))
})

/** ******************* bundle task *********************/
gulp.task('bundle',
  gulp.series(
    'clean:dist',
    gulp.parallel('bundle:scripts', 'bundle:css'),
    'gzip',
));

gulp.task('default', gulp.task('bundle'));
