System.config({
	packages: {
		app: {
			format: 'register',
			defaultExtension: 'js'
		}
	}
});
System.import('scripts/popup')
	.then(null, console.error.bind(console));