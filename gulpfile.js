const { src, dest, watch, series } = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const svgsprite = require("gulp-svg-sprite");
const del = require("del");
const sync = require("browser-sync").create();

const styles = () => {
  return src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(dest("dist/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

const html = () => {
  return src("source/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest("dist"));
}

const images = () => {
  return src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({
        progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.svgo()
    ]))
    .pipe(dest("source/img"))
}

exports.images = images;

const logo = () => {
  return src("source/logo/*.svg")
    .pipe(dest("dist/img/logo"))
}

exports.logo = logo;

const svgstack = () => {
  return src("source/icons/**/*.svg")
    .pipe(svgsprite({
      mode: {
        stack: {}
      }
    }))
    .pipe(rename("stack.svg"))
    .pipe(dest("dist/img"));
}

exports.svgstack = svgstack;

const copy = (done) => {
  src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.{jpg,png,svg}",
    "source/img/logo/*.svg",
    "source/*.webmanifest",
  ], {
    base: "source"
  })
    .pipe(dest("dist"))
  done();
}

exports.copy = copy;

const clean = () => {
  return del("dist");
};

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'dist'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

const reload = done => {
  sync.reload();
  done();
}

const watcher = () => {
  watch("source/sass/**/*.scss", series("styles"));
  watch("source/*.html").on("change", reload);
}

const dist = series(
  clean,
    styles,
    html,
    copy,
    logo,
    images,
    svgstack
);

exports.dist = dist;

exports.default = series(
  clean,
    html,
    images,
    styles,
    svgstack,
    logo,
    copy,
    server,
    watcher

);
