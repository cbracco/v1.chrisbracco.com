// Define Paths
const src = './source/'
const srcAssets = './source/_assets/'
const build = './build/'
const development = './build/development/'
const developmentAssets = './build/assets/'
const production = './build/production'
const productionAssets = './build/production/assets'

// Require rsyncCredentials only if the file exists to avoid build
// failure on travis-ci
const fs = require('fs')
let rsyncCredentials

if (fs.existsSync('../../rsync-credentials.json')) {
  rsyncCredentials = require('../../rsync-credentials.json')
} else {
  rsyncCredentials = {
    destination: '/path/to/website',
    hostname: 'example.com',
    username: 'user',
    port: 666
  }
}

module.exports = {
  watch: {
    jekyll: [
      '_config.yml',
      '_config.production.yml',
      src + '_data/**/*',
      src + '_includes/**/*',
      src + '_layouts/**/*',
      src + '_plugins/**/*',
      src + '_posts/**/*',
      src + '**/*.{html,markdown,md,yml,json,txt,xml}',
      src + '*'
    ],
    styles: srcAssets + 'styles/**/*',
    scripts: srcAssets + 'scripts/**/*',
    images: srcAssets + 'images/**/*',
    icons: srcAssets + 'icons/**/*',
    favicons: srcAssets + 'favicons/**/*',
    fonts: srcAssets + 'fonts/**/*',
    downloads: srcAssets + 'downloads/**/*'
  },
  serve: {
    development: {
      server: {
        baseDir: [development, build, src]
      },
      files: [
        developmentAssets + '/styles/*.css',
        developmentAssets + '/scripts/*.js',
        developmentAssets + '/images/**',
        developmentAssets + '/icons/*',
        developmentAssets + '/favicons/*',
        developmentAssets + '/fonts/*',
        developmentAssets + '/downloads/*'
      ],
      port: 9999,
      xip: false,
      notify: {
        styles: ['display: hidden; padding: 12px; font-family: sans-serif; position: fixed; font-size: 14px; z-index: 10000; left: 0; bottom: 0; width: 200px; margin: 0; border-top-left-radius: 0; border-top-right-radius: 3px; color: #fff; text-align: center; background-color: rgba(0, 0, 0, 0.75);']
      }
    },
    production: {
      server: {
        baseDir: [production]
      },
      port: 9998,
      xip: true
    }
  },
  build: {},
  clean: {
    src: developmentAssets
  },
  jekyll: {
    development: {
      src: src,
      dest: development,
      config: '_config.yml'
    },
    production: {
      src: src,
      dest: production,
      config: '_config.yml,_config.production.yml'
    }
  },
  styles: {
    src: srcAssets + 'styles/styles.css',
    path: srcAssets + 'styles/',
    dest: developmentAssets + 'styles/',
    processors: {
      cssnext: {
        browsers: 'last 2 versions'
      },
      mqpacker: {
        sort: true
      }
    }
  },
  scripts: {
    debug: true,
    extensions: ['.coffee', '.hbs'],
    bundleConfigs: [
      {
        entries: srcAssets + 'scripts/scripts.js',
        dest: developmentAssets + 'scripts/',
        outputName: 'scripts.js'
      },
      {
        entries: srcAssets + 'scripts/head.js',
        dest: developmentAssets + 'scripts/',
        outputName: 'head.js'
      }
    ]
  },
  images: {
    src: srcAssets + 'images/**/*',
    dest: developmentAssets + 'images/'
  },
  icons: {
    src: srcAssets + 'icons/**/*.svg',
    dest: developmentAssets + 'icons',
    processors: {
      sprite: {
        mode: {
          symbol: {
            dest: './',
            sprite: 'sprite.svg'
          }
        }
      }
    }
  },
  favicons: {
    src: srcAssets + 'favicons/**/*',
    dest: developmentAssets + 'favicons/'
  },
  fonts: {
    src: srcAssets + 'fonts/**/*',
    dest: developmentAssets + 'fonts/'
  },
  downloads: {
    src: srcAssets + 'downloads/**/*',
    dest: developmentAssets + 'downloads/'
  },
  optimize: {
    styles: {
      src: developmentAssets + '/styles/*.css',
      dest: productionAssets + '/styles/',
      processors: {
        rename: {
          suffix: '.min'
        }
      }
    },
    scripts: {
      src: developmentAssets + '/scripts/*.js',
      dest: productionAssets + '/scripts/',
      processors: {
        rename: {
          suffix: '.min'
        },
        uglify: {}
      }
    },
    images: {
      src: developmentAssets + '/images/**/*.{jpg,jpeg,png,gif}',
      dest: productionAssets + '/images/',
      processors: {
        imagemin: {
          optimizationLevel: 3,
          progessive: true,
          interlaced: true,
          svgoPlugins: [{
            removeViewBox: false
          }]
        }
      }
    },
    icons: {
      src: developmentAssets + '/icons/**/*',
      dest: productionAssets + '/icons/'
    },
    favicons: {
      src: developmentAssets + '/favicons/**/*',
      dest: productionAssets + '/favicons/'
    },
    fonts: {
      src: developmentAssets + '/fonts/**/*',
      dest: productionAssets + '/fonts/'
    },
    downloads: {
      src: developmentAssets + '/downloads/**/*',
      dest: productionAssets + '/downloads/'
    },
    html: {
      src: production + '/**/*.html',
      dest: production,
      processors: {
        htmlmin: {
          collapseWhitespace: true
        },
        htmlreplace: {
          styles: {
            src: '/assets/styles/',
            tpl: '<link rel="stylesheet" href="%sstyles.min.css">'
          },
          head: {
            src: '/assets/scripts/',
            tpl: '<script src="%shead.min.js"></script>'
          },
          scripts: {
            src: '/assets/scripts/',
            tpl: '<script src="%sscripts.min.js"></script>'
          }
        }
      }
    }
  },
  copy: {
    cname: {
      src: 'CNAME',
      dest: production
    }
  },
  revision: {
    src: {
      assets: [
        productionAssets + '/styles/*.css',
        productionAssets + '/scripts/*.js',
        productionAssets + '/images/**/*'
      ],
      base: production
    },
    dest: {
      assets: production,
      manifest: {
        name: 'manifest.json',
        path: productionAssets
      }
    },
    collect: {
      src: [
        productionAssets + '/manifest.json',
        production + '/**/*.{html,xml,txt,json,css,js}',
        '!' + production + '/feed.xml'
      ],
      dest: production
    }
  },
  gzip: {
    src: production + '/**/*.{html,xml,json,css,js}',
    dest: production,
    options: {}
  },
  rsync: {
    src: production + '/**',
    options: {
      destination: rsyncCredentials.destination,
      root: production,
      hostname: rsyncCredentials.hostname,
      username: rsyncCredentials.username,
      port: rsyncCredentials.port,
      incremental: true,
      progress: true,
      relative: true,
      emptyDirectories: true,
      recursive: true,
      clean: true,
      exclude: ['.DS_Store'],
      include: []
    }
  },
  ghPages: {
    dir: production,
    options: {
      message: 'Update ' + new Date().toISOString()
    }
  }
}
