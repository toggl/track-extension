module.exports = function( grunt ) {
  'use strict';

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-crx');
  grunt.loadNpmTasks('grunt-contrib-compress');

  var loadParameters = function () {
    if (grunt.file.exists('parameters.json')) {
      return grunt.file.readJSON('parameters.json');
    }

    if (grunt.file.exists('parameters.json.dist')) {
      return grunt.file.readJSON('parameters.json.dist');
    }
  }

  var config = {
    app: 'src',
    dist: 'dist',
    package: grunt.file.readJSON('package.json'),
    parameters: loadParameters()
  };

  grunt.initConfig({
    config: config,
    jslint: {
      app: {
        src: [
          '<%= config.app %>/scripts/**/*.js'
        ]
      }
    },
    crx: {
      toggl: {
        "src": "<%= config.app %>",
        "dest": "<%= config.dist %>",
        "privateKey": "toggl-button.pem"
      }
    },
    compress: {
      dist: {
        options: {
          archive: '<%= config.dist %>/<%= config.package.name %>-<%= config.package.version %>.zip'
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/',
          src: ['**'],
          dest: ''
        }]
      }
    }
  });

  grunt.registerTask('default', ['jslint', 'crx', 'compress']);
};
