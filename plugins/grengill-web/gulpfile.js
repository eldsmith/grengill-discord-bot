/* jshint esversion: 6 */

var gulp = require('gulp'),
  plugins = require('gulp-load-plugins')(),
  browserSync = require('browser-sync').create();

gulp.task('css', ()=>{
  // compile sass
  // output file to a dist/
  return gulp.src(['./src/sass/main.scss'])
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({includePaths: ['./node_modules/bulma']}).on('error', plugins.sass.logError))
    .pipe(plugins.cssmin())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('js', ()=>{
  return gulp.src(['./src/js/main.js'])
    .pipe(plugins.uglify())
    .pipe(gulp.dest('./public/js'));
});

// watch for file changes and run tasks
gulp.task('watch', ()=>{
  gulp.watch(['./src/sass/*.scss'], ['css']);
  gulp.watch(['./src/js/*.js'], ['js']);
});

gulp.task('browser-sync', ()=>{
  browserSync.init({
      proxy: "http://localhost:5000",
      files: ["public/**/*.*"]
  });
});

gulp.task('nodemon', (cb)=>{
  var started = false;

	return plugins.nodemon({
		script: 'main.js',
    ignore: ['gulpfile.js', './src', './public']
	}).on('start', ()=>{
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('default', ['css', 'js', 'watch', 'nodemon', 'browser-sync']);
