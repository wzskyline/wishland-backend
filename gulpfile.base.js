'use strict';

const fs                           = require("fs");
const path                         = require('path');
const bower                        = require('gulp-bower');
const clean                        = require('gulp-clean');
const concat                       = require('gulp-concat');
const cleanCss                     = require('gulp-clean-css');
const ejs                          = require('gulp-ejs');
const htmlExtender                 = require('gulp-html-extend');
const htmlMinifier                 = require('gulp-html-minifier');
const gulpif                       = require('gulp-if');
const jsdoc                        = require("gulp-jsdoc3");
const rename                       = require("gulp-rename");
const sass                         = require('gulp-sass');
const replace                      = require('gulp-string-replace');
const testcafe                     = require('gulp-testcafe');
const uglify                       = require('gulp-uglify');

const URL_REGEX = /asset:\/\/[a-zA-Z0-9@:%._\-\+\/~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/g;

module.exports = function(gulp, config){

    var hashMapping = {}, index = 0;
    function domainHash(replacement){
        if(hashMapping[replacement] != undefined){
            return hashMapping[replacement];
        }else{
            index = index + 1 < config.cdn.length ? index + 1 : 0;
            hashMapping[replacement] = replacement.replace("asset://", config.cdn[index] + "/");
            return hashMapping[replacement];
        }
    }

    gulp.task('html', ['html:index', 'html:login']);

    gulp.task('html:index', () => {
        var templateDir = './src/resources/';
        var javascript = config.dest + '/js/index.js';

        gulp.src('./src/page/index.html')
            .pipe(htmlExtender({annotations:false, verbose:true}))
            .pipe(replace("{VERSION}", config.version))
            .pipe(replace("<!--template-->", function (match, p1, offset, string) {
                var files = fs.readdirSync(templateDir);
                var template = '';

                files.forEach(filename => {
                    var fullname = path.join(templateDir, filename);
                    var stat = fs.statSync(fullname);

                    if(stat.isDirectory()){
                        var subFiles = fs.readdirSync(fullname);

                        subFiles.forEach( subFilename => {
                            var subFullname = path.join(fullname, subFilename);

                            if(subFilename.endsWith(".html")){
								template += fs.readFileSync(subFullname);
                            }
                        });
                    }else if(fullname.endsWith(".html")){
                        template += fs.readFileSync(fullname);
                    }
                });
                return template;
            }))
            .pipe(replace(URL_REGEX, domainHash))
            .pipe(gulpif(config.html.compress, htmlMinifier({collapseWhitespace: true})))
            .pipe(gulp.dest(config.dest));
    });

    gulp.task('html:login', () => {
        gulp.src('./src/page/login.html')
            .pipe(htmlExtender({annotations:false, verbose:true}))
            .pipe(replace("{VERSION}", config.version))
            .pipe(gulpif(config.html.compress, htmlMinifier({collapseWhitespace: true})))
            .pipe(gulp.dest(config.dest));
    });

    gulp.task('js', ['js:global'], function () {
        gulp.src(['./src/scripts/**/*.js'])
            .pipe(replace("{VERSION}", config.version))
            .pipe(replace("{BUILD}", config.build))
            .pipe(replace("{MERCHANT}", config.merchant))
            .pipe(replace("{ENV}", config.env))
            .pipe(rename(function (path) {
                if(path.dirname != "."){
					path.basename = "_" + path.dirname + path.basename;
					path.dirname = ".";
                }
			}))
            .pipe(gulpif(config.js.compress, uglify(config.js.uglify)))
            .pipe(gulp.dest(config.dest + '/js'));
    });

    gulp.task('js:global', () => {
        gulp.src([
            './src/global/*.js',
            './src/utils/*.js'])
            .pipe(concat("global.js"))
            .pipe(replace("{VERSION}", config.version))
            .pipe(replace("{BUILD}", config.build))
            .pipe(replace("{MERCHANT}", config.merchant))
            .pipe(replace("{ENV}", config.env))
            .pipe(gulpif(config.js.compress, uglify(config.js.uglify)))
            .pipe(gulp.dest(config.dest + '/js'));
    });

    gulp.task('sass', () => {
        gulp.src('./src/styles/page/*.scss')
            .pipe(sass(Object.assign({
                includePaths: ['./node_modules/compass-mixins/lib']
            }, config.sass)))
            .pipe(replace(URL_REGEX, domainHash))
            .pipe(replace("{VERSION}", config.version))
            .pipe(gulpif(config.css.compress, cleanCss()))
            .pipe(rename({extname:'.css'}))
            .pipe(gulp.dest(config.dest + '/css'));
    });

    gulp.task('resources', () => {
        gulp.src('./src/resources/*.properties')
            .pipe(rename({extname:'.txt'}))
            .pipe(gulp.dest(config.dest + '/resources'));
        return gulp.src('./src/resources/**/*')
            .pipe(gulp.dest(config.dest + '/resources'));
    });

    gulp.task('images', () => {
        gulp.src('./src/images/**/*')
            .pipe(gulp.dest(config.dest + '/images'));
    });

    gulp.task('plugins', ['plugins:datepicker', 'plugins:Guriddo_jqgrid', 'plugins:jquery.multiselect2side', 'plugins:widget',  'plugins:socket','plugins:video.js', 'plugins:videojs-swf']);

    gulp.task('plugins:datepicker', () => {
		gulp.src('./src/plugins/datepicker/*.js')
			.pipe(gulp.dest(config.dest + '/plugins/datepicker'));
    });

	gulp.task('plugins:Guriddo_jqgrid', () => {
		gulp.src('./src/plugins/Guriddo_jqgrid/**/*')
			.pipe(gulp.dest(config.dest + '/plugins/Guriddo_jqgrid'));
    });

    gulp.task('plugins:jquery.multiselect2side', () => {
        gulp.src('./src/plugins/jquery.multiselect2side/**/*')
        .pipe(gulp.dest(config.dest + '/plugins/jquery.multiselect2side'));
    });

    gulp.task('plugins:socket', () => {
        gulp.src('./src/plugins/socket/**/*')
        .pipe(gulp.dest(config.dest + '/plugins/socket'));
    });


    gulp.task('plugins:widget', () => {
        gulp.src('./src/plugins/widget/**/*')
        .pipe(gulp.dest(config.dest + '/plugins/widget'));
    });

    gulp.task('plugins:video.js', () => {
        gulp.src('./src/plugins/video.js/dists/*.css')
        .pipe(gulp.dest(config.dest + '/plugins/videojs/dists'));

        gulp.src('./src/plugins/videojs-errors/dists/*.css')
        .pipe(gulp.dest(config.dest + '/plugins/videojs-errors/dists'));

        gulp.src('./src/plugins/videojs-ie8/dists/*')
            .pipe(gulp.dest(config.dest + '/plugins/videojs-ie8/dists'));

        gulp.src('./src/plugins/videojs-errors/dists/*.js')
            .pipe(gulp.dest(config.dest + '/plugins/videojs-errors/dists'));

        gulp.src([
            './src/plugins/video.js/dists/video.min.js',
            './src/plugins/videojs-ie8/dists/videojs-ie8.min.js',
            './src/plugins/videojs-errors/dists/videojs-errors.min.js',
            './src/plugins/videojs-errors/dists/lang/zh-CN.js',
            './src/plugins/videojs-flash/dists/videojs-flash.min.js'])
        .pipe(concat("video-ie8.min.js"))
        .pipe(gulp.dest(config.dest + '/plugins/videojs/dists'));

        return gulp.src([
            './src/plugins/video.js/dists/video.min.js',
            './src/plugins/videojs-errors/dists/videojs-errors.min.js',
            './src/plugins/videojs-errors/dists/lang/zh-CN.js',
            './src/plugins/videojs-flash/dists/videojs-flash.min.js'])
        .pipe(concat("video.min.js"))
        .pipe(gulp.dest(config.dest + '/plugins/videojs/dists'));
    });
    
    gulp.task('plugins:videojs-swf', () => {
        return gulp.src('./src/plugins/videojs-swf/**/*')
            .pipe(gulp.dest(config.dest + '/plugins/videojs-swf'));
    });

    gulp.task('bower', () => {
        return gulp.src('./bower_components/**/*')
            .pipe(gulp.dest(config.dest + '/bower_components'));
    });

    gulp.task('docs', (cb) => {
        var jsdocConfig = require('./jsdoc-config.json');

        setTimeout(function(){
            gulp.src([config.dest + '/js/*.js', './example/*.html'])
                .pipe(jsdoc(jsdocConfig, cb));
        }, 2000);
    });

    gulp.task('test', function () {
        return gulp.src('./test/**/*.js')
            .pipe(testcafe({
                browsers: config.test.browsers,
                reporter: {
                    name: "phil",
                    outStream: fs.createWriteStream(config.test.dest + "/report.html")
                },
                filter: config.test.filter,
                screenshotsPath: config.test.dest,
                takeScreenshotsOnFail: true
            }));
    });

	gulp.task('template', () => {
        var param = require('./template/example1.json');
        console.log(param);

		gulp.src('./template/' + param.template + '.html.ejs')
            .pipe(ejs(param))
			.pipe(rename(param.name + ".html"))
			.pipe(gulp.dest('./src/resources/' + param.module));

		gulp.src('./template/' + param.template + '.js.ejs')
			.pipe(ejs(param))
			.pipe(rename('_' + param.name + ".js"))
			.pipe(gulp.dest('./src/scripts/' + param.module));

		gulp.src('./template/' + param.template + '.scss.ejs')
			.pipe(ejs(param))
			.pipe(rename(param.name + ".scss"))
			.pipe(gulp.dest('./src/styles/resources/' + param.module));
	});

    gulp.task('clean', () => {
        gulp.src([config.dest, './*.log'])
            .pipe(clean({force: true}));
    });
}