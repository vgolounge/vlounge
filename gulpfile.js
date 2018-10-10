const gulp = require('gulp');
const $    = require('gulp-load-plugins')();
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('default', ['sass', 'js'], function() {
    gulp.watch(['./resources/assets/sass/**/*.scss', './resources/assets/sass/**/*.sass'], ['sass']);
    gulp.watch(['./resources/assets/js/**/*.js'], ['js']);
});

gulp.task('sass', function() {
    return gulp.src('./resources/assets/sass/style.scss')
        .pipe(
            $.sass({
                includePaths: './node_modules/',
                // outputStyle: 'compressed'
            })
            .on('error', $.sass.logError)
        )
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie >= 10']
        }))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('js', function() {

    return  browserify('resources/assets/js/App.js', {
        debug: true // write own sourcemas
    }).transform('babelify', { presets: ["@babel/preset-env", "@babel/preset-react"] })
        .bundle()
        .pipe(source('App.js'))
        .pipe(buffer())
        // .pipe($.sourcemaps.init({ loadMaps: true })) // load browserify's sourcemaps
        // .pipe($.uglify())
        // .pipe($.sourcemaps.write('.')) // write .map files near scripts
        .pipe($.concat('app.min.js'))
        .pipe(gulp.dest('./public/js/'));
    //
    // gulp.src([
    //         './resources/assets/js/extra/*.js',
    //         './resources/assets/js/pages/**/*.js',
    //         './resources/assets/js/App.js',
    //     ])
    //     .pipe($.babel({
    //         presets: ['@babel/env', 'react']
    //     }))
    //     .pipe($.concat('app.min.js'))
    //     // .pipe($.uglify())
    //     .pipe(gulp.dest('./public/js/'))
});