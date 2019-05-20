'use strict'
var argv = require('yargs').argv;
var path = require('path');
var gulp = require('gulp');
var clean = require('gulp-clean');
var config = {
    merchant: "sgl818",
    version: argv.version,
    build: argv.build,
    env: 'sit',
    cdn: ['https://www.xgllvip1.com', 'https://www.xgllvip2.com', 'https://www.xgllvip3.com', 'https://www.xgllvip4.com', 'https://www.xgllvip5.com'],
    sass: {
        outputStyle: 'expanded' //  nested, compact, expanded, compressed
    },
    css: {
        compress: true
    },
    js: {
        compress: true
    },
    html: {
        compress: true
    },
    bower: {},
    dest: './wishland-backend',
    //  測試
    test: {
        browsers: ['chrome'],
        filter: null,
        dest: "./temp"
    }
};
require('./gulpfile.base.js')(gulp, config);
gulp.task('dist', ['bower', 'plugins', 'sass', 'js', 'html', 'images', 'resources']);
gulp.task('clean', function(){
    return gulp.src([config.dest, './*.log'])
        .pipe(clean({force: true}));
});
gulp.task('default', ['clean'], function(){
    gulp.start(['dist']);
});