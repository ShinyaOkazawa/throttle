var gulp = require('gulp');
var path = require('path');
var del = require('del');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var sass = require('gulp-sass');
var csscomb = require('gulp-csscomb');
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cached');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var babel = require('gulp-babel');
var server    = require('browser-sync').create();

var paths = {
	srcDir: 'dev/',
	dstDir: 'httpdocs/'
};

// watch
gulp.task('watchTask', ['sass', 'html', 'js',	'inc'], function(){
	var scssGlob = path.join(paths.srcDir, '**/*.scss');
	var imageminGlob = path.join(paths.srcDir, '**/*.png');
	var htmlGlob = path.join(paths.srcDir, '**/*.html');
	var jsGlob = path.join(paths.srcDir, '**/*.js');
	var incGlob = path.join(paths.srcDir, '**/*.inc');
	var watcher = gulp.watch(paths.srcDir + '**/*');

	watcher.on('change', function(e){
		// delete files in dst directory when files in src directory deleted synchronously
		if(e.type === 'deleted'){
			var filePathFromSrc = path.relative(path.resolve(paths.srcDir), e.path);
			var destFilePath = path.resolve(paths.dstDir, filePathFromSrc);
			del(destFilePath);
		}
	});

	gulp.watch([scssGlob], ['sass', 'server-reload']);
	gulp.watch([imageminGlob], ['imagemin', 'server-reload']);
	gulp.watch([htmlGlob], ['html', 'server-reload']);
	gulp.watch([jsGlob], ['js', 'server-reload']);
	gulp.watch([incGlob], ['inc', 'server-reload']);
});


// imagemin
gulp.task('imagemin', function(){

	var srcGlob = path.join( paths.srcDir, '**/*.+(jpg|jpeg|png|gif|svg)' );
	var dstGlob = path.join( paths.dstDir );

	return gulp.src(srcGlob, { base: paths.srcDir })
		.pipe(changed(dstGlob))
		.pipe(imagemin({optimizationLevel: 7}))
		.pipe(gulp.dest(dstGlob));
});

// sass
gulp.task('sass', function(){

	var srcGlob = path.join( paths.srcDir, '**/*.scss' );
	var dstGlob = path.join( paths.dstDir );

	return gulp.src(srcGlob, { base: paths.srcDir })
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(cache('sass'))
		.pipe(sass({
			outputStyle: 'expanded'
		}))
		.pipe(csscomb())
		.pipe(autoprefixer())
		.pipe(gulp.dest(dstGlob));
});

// html
gulp.task('html', function(){
	var srcGlob = path.join(paths.srcDir, '**/*.html');
	var dstGlob = path.join(paths.dstDir);

	return gulp.src( srcGlob ,{ base: paths.srcDir })
		.pipe(gulp.dest( dstGlob ));
});

//js
gulp.task('js', function(){
	var srcGlob = path.join(paths.srcDir, '**/*.js');
	var srcGlob = [paths.srcDir + '**/*.js', '!' + paths.srcDir + 'js/lib/**/*.js'];
	var dstGlob = path.join(paths.dstDir);

	return gulp.src( srcGlob ,{ base: paths.srcDir })
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest( dstGlob ));
});

//inc
gulp.task('inc', function(){
	var srcGlob = path.join(paths.srcDir, '**/*.inc');
	var dstGlob = path.join(paths.dstDir);

	return gulp.src( srcGlob ,{ base: paths.srcDir })
		.pipe(gulp.dest( dstGlob ));
});

//browsersync
gulp.task('server', function(){
	server.init({
		server: {
			baseDir: paths.dstDir
		}
	});
});
//proxy
// gulp.task('server', function(){
// 	server.init({
// 		proxy: 'jill.localhost',
// 		directory: true
// 	});
// });
//browsersync reload
gulp.task('server-reload', function(){
	return server.reload();
});

gulp.task('default', ['server', 'watchTask']);
