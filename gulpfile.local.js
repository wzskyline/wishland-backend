'use strict'

const argv                         = require('yargs').argv;
const pkg                          = require('./package.json');

const gulp                         = require('gulp');
const data                         = require('gulp-data');
const connect                      = require('gulp-connect');
const rename                       = require('gulp-rename');
const template                     = require('gulp-template');

let config = {
    version: pkg.version,
    build: 'local',
    env: 'dev',
    sass: {
        outputStyle: 'expanded' //  nested, compact, expanded, compressed
    },
    css: {
        compress: false
    },
    js: {
        compress: false
    },
    html: {
        compress: false
    },
    bower: {},
    dest: './dist',
    //  測試
    test: {
        browsers: ['chrome'],
        filter: null,
        dest: "./temp"
    }
}

require('./gulpfile.base.js')(gulp, config);

gulp.task('localhost', ['bower', 'plugins', 'sass', 'js', 'html', 'images', 'resources'], () => {

    gulp.watch('./src/global/*.js', ['js']);

    gulp.watch('./src/scripts/**/*.js', ['js']);

    gulp.watch('./src/utils/*.js', ['js']);

    gulp.watch('./src/layout/*.html', ['html']);

    gulp.watch('./src/page/*.html', ['html']);

    gulp.watch('./src/resources/**/*.html', ['html']);

    gulp.watch('./src/styles/**/*.scss', ['sass']);

    gulp.watch('./src/themes/**/*.scss', ['sass']);

    gulp.watch('./src/images/**/*', ['images']);

    connect.server({
        root: 'dist'
    });
});

gulp.task('default', ['clean'], () => {
    setTimeout(function () {
        gulp.start(['localhost']);
    }, 1000);
});