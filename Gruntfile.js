module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    gitadd: {
      task: {
        options: {
          force: true,
          all: true,
          // cwd: '/'
        }
      }
    },

    // git commit -m "Repository updated on <current date time>"
    gitcommit: {
      task: {
        options: {
          message: 'Repository updated on ' + grunt.template.today(),
          allowEmpty: true,
          // cwd: '/'
        }
      }
    },

   // git push origin master
    gitpush: {
      task: {
        options: {
          remote: 'live',
          branch: 'master',
          // cwd: '/'
        }
      }
    },


    concat: {
      options: {
        // define a string to put between each file in the concatenated output
        separator: ';'
      },
      dist: {
        // the files to concatenate
        src: ['public/client/*.js'],
        // the location of the resulting JS file
        dest: 'public/dist/shortly-deploy.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'public/dist/shortly-deploy.min.js': ['public/dist/shortly-deploy.js'],
          'public/dist/backbone.min.js': ['public/lib/backbone.js'],
          'public/dist/handlebars.min.js': ['public/lib/handlebars.js'],
          'public/dist/jquery.min.js': ['public/lib/jquery.js'],
          'public/dist/underscore.min.js': ['public/lib/underscore.js']

        }
      }
    },

    eslint: {
      target: [
        'public/**/*.js'
      ]
    },

    cssmin: {
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
          'public/style.css'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'test',
    'eslint',
    'concat',
    'uglify'
  ]);


    // Create task
  grunt.registerTask('git', [
    'gitadd',
    'gitcommit',
    'gitpush'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['git'])
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'build',
    'upload'
  ]);


};
