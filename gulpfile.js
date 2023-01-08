var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cssNano = require('gulp-cssnano'),
    csscomb = require('gulp-csscomb'),
    rename = require('gulp-rename'),
    del = require('del'),
    imageMin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    cache = require('gulp-cache'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    browserSync = require('browser-sync'),
    scss = require('gulp-sass'),
    autoPrefixer = require('gulp-autoprefixer');

gulp.task('scss', function(){
    return  gulp.src('src/css/*.scss')   /*   ['folder/!**!/!*.scss' 'folder/!**!/!*.+(scss|sass)' ]   */
        .pipe(scss())
        .pipe(autoPrefixer(['last 5 versions', '> 1%', 'ie 9'], {cascade:true}))
        .pipe(gulp.dest('src/css/'))
        .pipe(browserSync.reload({stream: true}))
});



gulp.task('clear', function(){    /* clear cache */
  return cache.clearAll()
});

gulp.task('img', function () {                /* img optimize */
    return gulp.src('src/img/**/*')
        .pipe(cache(imageMin([
            imageMin.gifsicle({interlaced: true}),
            imageminJpegRecompress({
                loops: 4,
                min: 75,
                max: 95,
                quality: 'high'
            }),
            imageMin.optipng({optimizationLevel: 5}),
            imageMin.svgo({plugins: [{removeViewBox: false}]})
        ], { verbose: true })))
        .pipe(gulp.dest('production/img'));
});

gulp.task('del', function () {    /* delete production folder before build */
    return del.sync(['production']);
});

gulp.task('browser-sync', function(){                 /* gulp watch */
    browserSync({
        server: {
            baseDir:'src'
        },
        tunnel: 'chatbot',
        notify: false
    })
});

gulp.task('watch', ['browser-sync'], function(){
    gulp.watch('src/css/**/*.scss', ['scss']);
    gulp.watch('src/js/**/*.js');
    gulp.watch('src/**/*.html', browserSync.reload);

});

gulp.task('html', function(){    /* production build add scripts */
    gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssNano()))
        .pipe(gulp.dest('production/'))
});

gulp.task('build', ['del', 'html', 'img' ], function () {    /* BUILD task */
    gulp.src('src/fonts/**/*').pipe(gulp.dest('production/fonts'));
    gulp.src('src/video/**/*').pipe(gulp.dest('production/video'));
    gulp.src('src/*.pdf').pipe(gulp.dest('production'));
});



