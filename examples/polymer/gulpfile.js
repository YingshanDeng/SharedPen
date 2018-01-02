var gulp = require('gulp')
var htmlreplace = require('gulp-html-replace')

gulp.task('html', () => {
  return gulp.src('index.html')
    .pipe(htmlreplace({'sharedpen_script': 'src/lib/sharedpen.min.js'}))
    .pipe(gulp.dest('./'))
})
