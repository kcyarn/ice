module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      src: ['src/**/*.js'],
      options: {
        browser: true,
        indent: 2,
        white: false,
        evil: true,
        regexdash: true,
        wsh: true,
        trailing: true,
        eqnull: true,
        expr: true,
        boss: true,
        node: true,
        strict: false
      }
    },

    qunit: {
      all: {
        options: {
          urls: ['http://localhost:8000/ice/test/test.html']
        }
      }
    },

    connect: {
      server: {
        options: {
          base: '../'
        }
      }
    },

    concat: {
      options: {
        stripBanners: true,
        banner: '//\n' +
          '// <%= pkg.name %> - v<%= pkg.version %>\n' +
          '// The MIT License\n' +
          '// Copyright (c) 2012 The New York Times, CMS Group, Matthew DeLambo <delambo@gmail.com> \n' +
          '//\n'
      },
      dist: {
        src: ['lib/rangy-1.3.0/rangy-core.js', 'src/polyfills.js', 'src/ice.js', 'src/dom.js', 'src/bookmark.js', 'src/selection.js', 'src/icePlugin.js', 'src/icePluginManager.js', 'src/plugins/IceAddTitlePlugin/IceAddTitlePlugin.js', 'src/plugins/IceCopyPastePlugin/IceCopyPastePlugin.js', 'src/plugins/IceSmartQuotesPlugin/IceSmartQuotesPlugin.js', 'src/plugins/IceEmdashPlugin/IceEmdashPlugin.js', 'src/plugins/IceCriticMarkupPlugin/IceCriticMarkupPlugin.js', 'src/plugins/IceCommentsPlugin/IceCommentsPlugin.js'],
        dest: 'dist/ice.js'
      }
    },

    uglify: {
      options: {
        beautify : {
            ascii_only : true
          } ,
        preserveComments: false,
        banner: '//\n' +
          '// <%= pkg.name %> - v<%= pkg.version %>\n' +
          '// The MIT License\n' +
          '// Copyright (c) 2012 The New York Times, CMS Group, Matthew DeLambo <delambo@gmail.com> \n' +
          '//\n'
      },
      ice: {
        files: {
          'dist/ice.min.js': ['dist/ice.js']
        }
      },
      icemaster: {
        options: {
          banner: '//\n' +
            '// <%= pkg.name %> - Master\n' +
            '// The MIT License\n' +
            '// Copyright (c) 2012 The New York Times, CMS Group, Matthew DeLambo <delambo@gmail.com>\n' +
            '//\n'
        },
        files: {
          'ice-master.min.js': ['dist/ice.js']
        }
      },
    },

    compress: {
      gz: {
        options: {
          mode: 'gzip',
          archive: 'ice.min.gz'
        },
        dest: 'dist/',
        src: 'dist/ice.min.js'
      },
      zip: {
        options: {
          archive: 'dist/ice_<%= pkg.version %>.zip'
        },
        files: [
          {src: './**', cwd: 'dist/', expand:true}
        ]
      }
    },

    clean: {
      build: ['dist']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('test', ['connect', 'qunit']);

  grunt.registerTask('build', ['clean:build', 'concat', 'uglify:ice', 'uglify:icemaster', 'compress:gz', 'cp', 'compress:zip']);


};
