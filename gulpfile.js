const gulp = require('gulp'),
browserSync = require('browser-sync').create();

// Styles
const sass = require('gulp-sass'), 
postcss = require('gulp-postcss'), 
autoprefixer = require('autoprefixer');


function styles() {
    return gulp.src('./app/assets/styles/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer]))
        .pipe(browserSync.stream())
        .pipe(gulp.dest('./app/temp/styles'));
}

exports.styles = styles;


function watch() {
    browserSync.init({
        notify: false,
        server: {
            baseDir: 'app'
        }
    });
    console.log('Server started');

    gulp.watch('./app/assets/styles/**/*.scss', styles);
    gulp.watch('./app/*.html').on('change', browserSync.reload);
}

exports.watch = watch;