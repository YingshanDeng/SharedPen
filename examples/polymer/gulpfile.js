var gulp = require('gulp')
var replace = require('gulp-replace')
var htmlreplace = require('gulp-html-replace')
var gzip = require('gulp-gzip')

gulp.task('html:prepare', () => {
  return gulp.src('index.html')
    .pipe(htmlreplace({'sharedpen_script': 'src/lib/sharedpen.min.js'}))
    .pipe(gulp.dest('./'))
})

gulp.task('html:windUp', () => {
  return gulp.src('./index.html')
    .pipe(replace(`<script src="src/lib/sharedpen.min.js"></script>`, `<!-- build:sharedpen_script -->
    <script src="http://localhost:3000/Utils.js"></script>
    <script src="http://localhost:3000/Constants.js"></script>
    <script src="http://localhost:3000/TextAction.js"></script>
    <script src="http://localhost:3000/TextOperation.js"></script>
    <script src="http://localhost:3000/Selection.js"></script>
    <script src="http://localhost:3000/WrappedOperation.js"></script>
    <script src="http://localhost:3000/UndoManager.js"></script>
    <script src="http://localhost:3000/EntityManager.js"></script>
    <script src="http://localhost:3000/AnnotationList.js"></script>
    <script src="http://localhost:3000/RichTextCodeMirror.js"></script>
    <script src="http://localhost:3000/RichTextCodeMirrorAdapter.js"></script>
    <script src="http://localhost:3000/ClientSocketIOAdapter.js"></script>
    <script src="http://localhost:3000/Client.js"></script>
    <script src="http://localhost:3000/EditorClient.js"></script>
    <script src="http://localhost:3000/SharedPen.js"></script>
    <!-- endbuild -->`))
    .pipe(gulp.dest('./'))
})

gulp.task('gzip', () => {
  return gulp.src('build/**/*.{css,html,js,svg,png,jpg,jpeg}')
    .pipe(gzip({append: true}))
    .pipe(gulp.dest('build/'))
})
