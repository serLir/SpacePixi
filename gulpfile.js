"use strict";

const gulp = require('gulp');
const gulpsync = require('gulp-sync')(gulp);
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const gulpIf = require('gulp-if');
const del = require('del');
const webpack = require('webpack');
const path = require('path');
const cssmin = require('gulp-cssmin');

const notifier = require('node-notifier');
const gulplog = require('gulplog');
const debug = require('gulp-debug');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';



/********************* clean ************************/
gulp.task('clean', function() {
	return true;// del('public');
});



/********************* styles ************************/
const compileStyles = function() {
    console.log('compile css');
    return gulp.src('app/styles/**/*.scss')
        //.pipe(console.log('css start'))
        .pipe(gulpIf(isDevelopment, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpIf(isDevelopment, sourcemaps.write()))
        .pipe(concat('main.css'))
        .pipe(gulpIf(!isDevelopment, cssmin()))
        .pipe(gulp.dest('public/css'));
};
gulp.task('styles', ['clean'], function() {
    return compileStyles();
});



/********************* assest ************************/
gulp.task('assets', ['clean'], function() {
    console.log('copy assets');
	return gulp.src('app/images/**/*.*')
		.pipe(gulp.dest('public/images'));
});



/********************* webpack ************************/
gulp.task('webpack', ['clean'], function(callback) {
    let options = {
        context: path.resolve(__dirname, 'app'),

        entry: {
            main: './js/main'
        },

        output: {
            path: path.resolve(__dirname, 'public/js'),
            filename: '[name].js',
            library: '[name]'
        },

        watch: isDevelopment,

        watchOptions: {
            aggregateTimeout: 100
        },

        devtool: isDevelopment ? 'source-map' : null,

        plugins: [
            new webpack.NoEmitOnErrorsPlugin()
        ],

        module: {
            loaders: [{
                test: /\.js$/,
                include: path.resolve(__dirname, 'app'),
                loader: 'babel-loader'
            }, {
                test: /\.(png|jpg|svg|)$/,
                loader: 'file?name=[path][name].[ext]'
            }, {
                test: /\.scss$/,
                //include: path.resolve(__dirname, 'app'),
                loader: 'style-loader!css-loader!sass-loader'
            }, {
                test: /\.html$/,
                loader: "underscore-template-loader"
            }]
        }

    };

    if (!isDevelopment) {
        options.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        );
    }

    const compiler = webpack(options);
    const webpackStat = function(err, stats) {
        console.log('webpack');
        if (!err) {
            err = stats.toJson().errors[0];
        }

        if (err) {
            notifier.notify({
                title: 'Webpack',
                message: err
            });
            //console.log(err);
            gulplog.error(err);
        } else {
            console.log(stats.toString({
                colors: true
            }));
            gulplog.info(stats.toString({
                colors: true
            }));
        }

        if (!options.watch && err) {
            callback(err);
        } else {
            callback();
        }
    };

    if (isDevelopment) {
        console.log('webpack');
        compiler.watch({
            aggregateTimeout: 300 // wait so long for more changes
            // poll: 1000 // use polling instead of native watchers
        }, webpackStat);
    } else {
        console.log('run webpack');
        compiler.run(webpackStat);
    }

});

gulp.watch('app/styles/**/*.scss', compileStyles);

/********************* default ************************/
gulp.task('default', ['styles', 'assets', 'webpack']);