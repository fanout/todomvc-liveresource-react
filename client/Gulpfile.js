var gulp = require("gulp");
var gulpif = require("gulp-if");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task("default", function () {
    return gulp.src("js/src/*.+(js|jsx)")
        //.pipe(sourcemaps.init())
        .pipe(gulpif(/\.(jsx|es6)/, babel({
            compact: false,
            presets: [
                "react",
                "es2015"
            ]
        })))
        .pipe(concat("bundle.js"))
        //.pipe(sourcemaps.write("."))
        .pipe(gulp.dest("js/build"));
});
