var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");

gulp.task("default", function () {
    return gulp.src("js/src/*.+(js|jsx)")
        .pipe(babel({
            compact: false,
            presets: [
                "react",
                "es2015"
            ]
        }))
        .pipe(concat("bundle.js"))
        .pipe(gulp.dest("js/build"));
});
