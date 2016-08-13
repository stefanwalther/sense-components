// Karma configuration
// Generated on Tue Aug 02 2016 10:17:10 GMT+0200 (W. Europe Summer Time)

module.exports = function ( config ) {

	var configuration = {

		basePath: '../',
		plugins: [
			"karma-requirejs",
			"karma-mocha",
			"karma-chrome-launcher",
			"karma-phantomjs2-launcher",
			"karma-coverage",
			"karma-mocha-reporter",
			"karma-chai"
		],

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'requirejs', 'chai'],

		// list of files / patterns to load in the browser
		files: [
			"test/requirejs-config.js",
			{pattern: 'src/**/*.js', included: false},
			{pattern: 'node_modules/angular/*.js', included: false},
			{pattern: 'node_modules/angular-mocks/*.js', included: false},
			{pattern: 'node_modules/jquery/dist/*.js', included: false},
			{pattern: 'node_modules/require-css/*.js', included: false},
			{pattern: 'node_modules/text/*.js', included: false},
			{pattern: 'node_modules/underscore/*.js', included: false},
			{pattern: 'src/**/*.css', included: false},
			{pattern: 'src/**/*.html', included: false},
			{pattern: 'external/**/*.js', included: false},
			{pattern: 'test/**/*.js', included: false}
		],

		// list of files to exclude
		exclude: [],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['mocha'],
		mochaReporter: {
			output: "minimal"
		},
		logLevel: "INFO",

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS2'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		// Lanuchers for travis
		customLaunchers: {
			Chrome_travis_ci: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		}
	};

	if (process.env.TRAVIS) {
		configuration.browsers = ['Chrome_travis_ci'];
	}

	config.set( configuration )
};
