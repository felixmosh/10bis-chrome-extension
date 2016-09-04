/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
	// map tells the System loader where to look for things
	var map = {
		'app': '', // 'dist',
		'@angular': 'node_modules/@angular',
		'rxjs': 'node_modules/rxjs',
		'angular2-highcharts': 'node_modules/angular2-highcharts',
		'highcharts': 'node_modules/highcharts'
	};
	// packages tells the System loader how to load when no filename and/or no extension
	var packages = {
		'app': {main: 'popup.js', defaultExtension: 'js'},
		'rxjs': {defaultExtension: 'js'},
		'angular2-highcharts': {main: 'index.js', defaultExtension: 'js'},
		'highcharts': {defaultExtension: 'js'}
	};
	var ngPackageNames = [
		'common',
		'compiler',
		'core',
		'forms',
		'http',
		'platform-browser',
		'platform-browser-dynamic',
		'router',
		'router-deprecated',
		'upgrade'
	];
	// Individual files (~300 requests):
	function packIndex(pkgName) {
		packages['@angular/' + pkgName] = {main: 'index.js', defaultExtension: 'js'};
	}

	// Bundled (~40 requests):
	function packUmd(pkgName) {
		packages['@angular/' + pkgName] = {main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js'};
	}

	// Most environments should use UMD; some (Karma) need the individual index files
	var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
	// Add package entries for angular packages
	ngPackageNames.forEach(setPackageConfig);
	var config = {
		map: map,
		packages: packages
	};
	System.config(config);
})(this);

System.import('./scripts/popup.js')
	.then(null, console.error.bind(console));