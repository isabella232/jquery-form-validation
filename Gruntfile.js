module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: [
          {
            expand: true,
            cwd: 'sass/',
            src: ['**/*.scss'],
            dest: 'css/',
            ext: '.css',
          },
        ],
      }
    },
    jshint: {
      all: ['js/**/*.js'],
      options: {
        reporter: require('jshint-stylish'),
        curly: true,
        eqeqeq: true,
        eqnull: false,
        browser: true,
        indent: 2,
        quotmark: 'single',
        unused: false,
        ignores: ['node_modules/', 'js/validate.min.js'],
        globals: {
          jQuery: true
        },
      },
    },
    uglify: {
      dist: {
        files:{
          'js/validate.min.js': ['js/validate.js']
        },
      }
    },
    watch: {
      css: {
        files: 'sass/**/*.scss',
        tasks: ['sass'],
        options: {
          spawn: false,
          livereload: true
        },
      },
      scripts: {
        files: 'js/**/*.js',
        tasks: ['newer:browserify', 'uglify'],
        options: {
          spawn: false,
          livereload: true
        },
      }
    }
  });
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-newer');
  grunt.registerTask('default',['watch']);
};