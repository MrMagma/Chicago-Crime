var gulp = require("gulp");

var sourcemaps = require("gulp-sourcemaps");

var babel = require("gulp-babel");

gulp.task("transpile-scripts", function() {
    return gulp.src("./src/scripts/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("dist/scripts"));
});

var browserify = require("browserify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");

gulp.task("build-scripts", ["transpile-scripts"], function() {
    var b = browserify({
        entries: "./dist/scripts/app.js",
        debug: true
    });
    
    return b.bundle()
        .pipe(source("app.js"))
        .pipe(buffer())
        .pipe(gulp.dest("./dist/browser"));
});

var stylus = require("gulp-stylus");
var postcss = require("gulp-postcss");
var short = require("postcss-short");
var autoprefixer = require("autoprefixer");
var gpConcat = require("gulp-concat");

gulp.task("build-styles", function() {
    return gulp.src("./src/stylus/**/*.styl")
        .pipe(sourcemaps.init())
        .pipe(stylus({
            
        }))
        .pipe(postcss([
            short,
            autoprefixer            
        ]))
        .pipe(gpConcat("index.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/browser"));
});

gulp.task("build", ["build-scripts", "build-styles"]);

gulp.task("default", ["build"]);
