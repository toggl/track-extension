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

  grunt.registerTask('manifest', 'Generate manifest file based on parameters.', function() {
    var _ = require('lodash'), parameters = config.parameters, permissions = [];
    var distManifest = grunt.file.readJSON('src/manifest.json.dist');
    var manifest = {
      'version': parameters['version'] || config.package['version'],
      'permissions': [],
      'content_scripts': [
        {
          "matches": [],
          "css": ["styles/style.css"],
          "js": ["scripts/common.js"]
        }
      ]
    }

    if (parameters.hasOwnProperty('update_url')) {
      manifest['update_url'] = parameters['update_url'];
    }

    _.forOwn(parameters.sites, function (matches, site) {
      manifest["content_scripts"].push({
        "js": "scripts/content/" + site + ".js",
        "matches": matches
      });

      _.forIn(matches, function (pattern) {
        manifest['content_scripts'][0]['matches'].push(pattern);
        manifest['permissions'].push(pattern);
      });
    });

    manifest = _.merge(distManifest, manifest, function(a, b) {
      return _.isArray(a) ? a.concat(b) : undefined;
    });

    grunt.file.write('src/manifest.json', JSON.stringify(manifest, null, 2));
  });

  grunt.registerTask('build', ['manifest', 'crx', 'compress']);
  grunt.registerTask('build-crx', ['manifest', 'crx']);
  grunt.registerTask('build-zip', ['manifest', 'crx']);
  grunt.registerTask('default', ['jslint', 'build']);
};
