// generated on 2016-03-22 using generator-chrome-extension 0.5.5
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');
var runSequence = require('run-sequence');

const $ = gulpLoadPlugins();

gulp.task('extras', () => {
	return gulp.src([
		'app/*.*',
		'app/_locales/**',
		'!app/*.json',
		'!app/*.html'
	], {
		base: 'app',
		dot: true
	}).pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
	return gulp.src('app/images/**/*')
		.pipe($.if($.if.isFile, $.cache($.imagemin({
				progressive: true,
				interlaced: true,
				// don't remove IDs from SVGs, they are often used
				// as hooks for embedding and styling
				svgoPlugins: [{cleanupIDs: false}]
			}))
			.on('error', function (err) {
				console.log(err);
				this.end();
			})))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('html', () => {
	return gulp.src('app/*.html')
		.pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
		.pipe(gulp.dest('dist'));
});

gulp.task('chromeManifest', () => {
	return gulp.src('app/manifest.json')
		.pipe($.chromeManifest({
			buildnumber: true,
			background: {
				target: 'scripts/background.js',
				exclude: [
					'scripts/chromereload.js'
				]
			}
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['dist']));

gulp.task('size', () => {
	return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('cleanLocalhost', function(){
	gulp.src(['dist/*.html', 'dist/manifest.json'])
		.pipe($.replace(' http://localhost:8080', ''))
		.pipe($.replace('http://localhost:8080/', ''))
		.pipe(gulp.dest('dist/'));
});

gulp.task('package', function () {
	var manifest = require('./dist/manifest.json');
	return gulp.src('dist/**')
		.pipe($.zip('tenbis-' + manifest.version + '.zip'))
		.pipe(gulp.dest('package'));
});

gulp.task('build', ['clean'], (cb) => {
	runSequence(
		'chromeManifest',
		['html', 'images', 'extras'],
		'cleanLocalhost',
		'size', cb);
});

gulp.task('default', cb => {
	runSequence(['watch']);
});
