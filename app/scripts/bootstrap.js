System.config({
	'baseURL': '/scripts/node_modules/',
	'defaultJSExtensions': true,
	packages: {
		app: {
			format: 'register',
			defaultExtension: 'js'
		},
		'rxjs': {defaultExtension: 'js'}
	}
});
System.import('./scripts/popup.js')
	.then(null, console.error.bind(console));