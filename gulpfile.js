const {src, dest, watch, series} = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
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
    .pipe(dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Logo

const logo = () => {
  return src("source/logo/*.svg")
    .pipe(imagemin([
      imagemin.svgo()
    ]))
    .pipe(dest("source/icons"))
}

exports.logo = logo;

// Svg stack

const svgstack = () => {
  return src("source/img/**/*.svg")
    .pipe(svgsprite({
      mode: {
        stack: {}
      }
    }))
    .pipe(rename("stack.svg"))
    .pipe(dest("source/icons"));
}

exports.svgstack = svgstack;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Watcher

const watcher = () => {
  watch("source/sass/**/*.scss", series("styles"));
  watch("source/*.html").on("change", sync.reload);
  watch("source/img/**/*.svg", series(svgstack));
  watch("source/logo/*.svg", series(logo));
}

exports.default = series(
  styles,
  server,
  watcher,
  svgstack,
  logo
);
