// Define Dependencies
const { parallel, series } = require('gulp')
const clean = require('../../utilities/clean')
const copyCname = require('./copy-cname')
const downloads = require('../development/downloads')
const favicons = require('../development/favicons')
const fonts = require('../development/fonts')
const gzip = require('./gzip')
const icons = require('../development/icons')
const images = require('../development/images')
const jekyll = require('./jekyll')
const optimizeDownloads = require('./optimize-downloads')
const optimizeFavicons = require('./optimize-favicons')
const optimizeFonts = require('./optimize-fonts')
const optimizeHtml = require('./optimize-html')
const optimizeIcons = require('./optimize-icons')
const optimizeImages = require('./optimize-images')
const optimizeScripts = require('./optimize-scripts')
const optimizeStyles = require('./optimize-styles')
const revision = require('./revision')
const revisionCollect = require('./revision-collect')
const scripts = require('../development/scripts')
const styles = require('../development/styles')

// Task
function buildProduction (done) {
  return series(
    clean,
    parallel(
      styles,
      scripts,
      images,
      icons,
      favicons,
      fonts,
      downloads
    ),
    jekyll,
    parallel(
      optimizeStyles,
      optimizeScripts,
      optimizeImages,
      optimizeIcons,
      optimizeFavicons,
      optimizeFonts,
      optimizeDownloads,
      optimizeHtml
    ),
    copyCname,
    revision,
    revisionCollect,
    gzip
  )(done)
}

module.exports = buildProduction
