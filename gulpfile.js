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
const sync = require("browser-sync").create();

// Styles

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

// HTML

const html = () => {
  return src("source/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest("dist"));
}

// Images

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

// Logo

const logo = () => {
  return src("source/img/logo/*.svg")
    .pipe(dest("dist/icons"))
}

exports.logo = logo;

// Svg stack

const svgstack = () => {
  return src("source/icons/*.svg")
    .pipe(svgsprite({
      mode: {
        stack: {}
      }
    }))
    .pipe(rename("stack.svg"))
    .pipe(dest("dist/img"));
}

exports.svgstack = svgstack;

// Copy

const copy = (done) => {
  src([
    "source/fonts/*.{woff2,woff}",
    "source/img/*.ico",
    "source/img/**/*.{jpg,png,svg}",
    "source/img/logo/*.svg",
    "source/*.webmanifest",
  ], {
    base: "source"
  })
    .pipe(dest("dist/img"))
  done();
}

exports.copy = copy;

// Server

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

// Reload

const reload = done => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  watch("source/sass/**/*.scss", series("styles"));
  watch("source/*.html").on("change", sync.reload);
  watch("source/icons/*.svg", series(svgstack));
  watch("source/img/logo/*.svg", series(logo));
  watch("source/*.html", series(html, reload));
}

//default

exports.default = series(
  html,
  images,
  styles,
  svgstack,
  logo,
  server,
  watcher,
  copy
);
