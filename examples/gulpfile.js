let gulp = require('gulp');
let browserifyTasks = require('senfino-gulp-tasks').browserify;

gulp.task('default', browserifyTasks.createBuildTask());
gulp.task('serve', browserifyTasks.createBuildAndWatchTask());