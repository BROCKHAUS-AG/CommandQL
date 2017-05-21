var gulp = require("gulp");

var merge = require("merge2");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");
var minify = require("gulp-minify");
var watch = require("gulp-watch");
var tslint = require("gulp-tslint");

var jasmine = require("gulp-jasmine");

var typescript = require("gulp-typescript");
var devTS = typescript.createProject("tsconfig.json");
var testTS = typescript.createProject("test/tsconfig.json");

/*JS*/
gulp.task("typescript", ["tslint"], function () {
    return devTS.src()
        .pipe(sourcemaps.init())
        .pipe(devTS())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dist"));
});

gulp.task("minifyJS", ["typescript"], function () {
    return gulp.src(["dist/**/*.js", "!dist/**/*.min.js"])
        .pipe(minify({
            ext: {
                src: ".js",
                min: ".min.js"
            },
            noSource: true,
            mangle: false
        }))
        .pipe(gulp.dest("dist"));
});

/*Test*/
gulp.task("testts", function(){
    return testTS.src()
        .pipe(testTS())
        .pipe(gulp.dest("test"));
});

var testFiles = [
    "dist/commandql.js", 
    "test/test.js"
];

gulp.task("unittests", ["testts"], function(){
    return gulp.src(testFiles)
        .pipe(concat("all.js"))
        .pipe(gulp.dest("test"))
        .pipe(jasmine({
            verbose: true
        }));
});

gulp.task("tslint", function(){
    return devTS.src()
        .pipe(tslint({
            formatter: "stylish"
        }))
        .pipe(tslint.report({
            emitError: false,
            summarizeFailureOutput: true
        }));
});

gulp.task("test", ["tslint", "unittests"], function(){

});

gulp.task("edit", function(){
    gulp.watch("test/**/*.ts", ["test"]);
    gulp.watch("dev/**/*.ts", ["typescript"]);
    gulp.watch("tslint.json", ["tslint"]);
});