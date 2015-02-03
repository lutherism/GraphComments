var gulp = require('gulp'),
  gulpReact = require('gulp-react'),
  path = require('path'),
  watch = require('gulp-watch');
gulp.task('watchJSX', function () {
    var reactEngine = gulpReact();
    reactEngine.on('error', function(err) {
      console.log(err.message);
      console.log(err.fileName);
      reactEngine = gulpReact();
    });
    gulp.src('./src/jsx/*.jsx')
        .pipe(watch('./src/jsx/*.jsx'))
        .pipe(reactEngine)
        .pipe(gulp.dest('./src/js/views/'));
});
