const { src, dest, watch, series } = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgsprite = require("gulp-svg-sprite");
const del = require("del");
const sync = require("browser-sync").create();

const styles = () => {
  return src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(dest("dist/css"))
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(rename("style.min.css"))
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

exports.html = html;

const scripts = () => {
  return src("source/js/*.js")
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(dest('dist/js'))
    .pipe(sync.stream())
}

exports.scripts = scripts;

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

const createWebp = () => {
  return src("source/img/*.{jpg,png}")
    .pipe(webp({
      quality: 80
    }))
    .pipe(dest("dist/img"))
}

exports.createWebp = createWebp;

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
  watch("source/*.html", series(html, reload));
  watch("source/sass/**/*.scss", series("styles"));
  watch("source/js/*.js", series(scripts));
}

const dist = series(
  clean,
  styles,
  html,
  scripts,
  createWebp,
  logo,
  svgstack,
  copy
);

exports.dist = dist;

exports.default = series(
  clean,
  styles,
  html,
  scripts,
  createWebp,
  logo,
  svgstack,
  copy,
  server,
  watcher
);
