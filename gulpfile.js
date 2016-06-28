// generated on 2016-03-22 using generator-chrome-extension 0.5.5
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var del = require('del');
var runSequence = require('run-sequence');

const $ = gulpLoadPlugins();
var tsProject = $.typescript.createProject('tsconfig.json');


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

function lint(files, options) {
	return () => {
		return gulp.src(files)
			.pipe($.eslint(options))
			.pipe($.eslint.format());
	};
}

gulp.task('ts-lint', function () {
	return gulp.src('app/scripts/**/*.ts')
		.pipe($.tslint())
		.pipe($.tslint.report('prose'));
});

gulp.task('compile-ts', ['ts-lint'], function () {
	var sourceTsFiles = ['app/scripts/**/*.ts'];

	var tsResult = gulp.src(sourceTsFiles)
		.pipe($.sourcemaps.init())
		.pipe($.typescript(tsProject));

	return tsResult.js
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('app/scripts/'));
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
		.pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
		.pipe($.sourcemaps.init())
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
		.pipe($.sourcemaps.write())
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
		.pipe($.if('*.css', $.cleanCss({compatibility: '*'})))
		.pipe($.if('*.js', $.sourcemaps.init()))
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.js', $.sourcemaps.write('.')))
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('watch', ['compile-ts', 'html'], () => {
	$.livereload.listen();

	gulp.watch([
		'app/*.html',
		'app/scripts/**/*.js',
		'app/scripts/**/*.ts',
		'app/images/**/*',
		'app/styles/**/*',
		'app/_locales/**/*.json'
	]).on('change', $.livereload.reload);

	gulp.watch('app/scripts/**/*.ts', ['compile-ts']);
});

gulp.task('size', () => {
	return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('package', function () {
	var manifest = require('./dist/manifest.json');
	return gulp.src('dist/**')
		.pipe($.zip('extv2-' + manifest.version + '.zip'))
		.pipe(gulp.dest('package'));
});

gulp.task('build', ['clean'], (cb) => {
	runSequence(
		'compile-ts', 'chromeManifest',
		['html', 'images', 'extras'],
		'size', cb);
});

gulp.task('default', cb => {
	runSequence(['watch']);
});
