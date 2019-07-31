const gulp = require('gulp'),
browserSync = require('browser-sync').create();

// Styles
const sass = require('gulp-sass'), 
postcss = require('gulp-postcss'), 
autoprefixer = require('autoprefixer');

// For deploy
const imagemin = require('gulp-imagemin'), // optimize images
imageminPngquant = require('imagemin-pngquant'),
imageminJpegRecompress = require('imagemin-jpeg-recompress'),
del = require('del'), // delete
usemin = require('gulp-usemin'), 
rev = require('gulp-rev'), // rev our files
cssnano = require('gulp-cssnano'); // compress CSS


function previewDist() {
    browserSync.init({
        notify: false,
        server: {
            baseDir: 'docs'
        }
    });
}

exports.previewDist = previewDist;



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


function images() {
    return gulp.src('./app/assets/images/**/*.{png,jpeg,jpg,svg,gif}')
        .pipe(imagemin([
            imagemin.gifsicle(),
            imagemin.jpegtran(),
            imagemin.optipng(),
            imagemin.svgo(),
            imageminPngquant(),
            imageminJpegRecompress()
        ]))
        .pipe(gulp.dest('./docs/assets/images'));
}

exports.images = images;

function clean() {
    return del(['./docs']);
}

function useminTask() {
    return gulp.src('./app/index.html')
        .pipe(usemin({
            css: [function() {return rev()}, function() {return cssnano()}]
        }))
        .pipe(gulp.dest('./docs'));
}

exports.build = gulp.series(clean, images, styles, useminTask);
