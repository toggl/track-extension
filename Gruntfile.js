module.exports = function( grunt ) {
  'use strict';

  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-crx');

  grunt.initConfig({
    jslint: {
      app: {
        src: [
          'src/scripts/**/*.js'
        ]
      }
    },
    crx: {
      toggl: {
        "src": "src/",
        "dest": "dist/",
        "privateKey": "toggl-button.pem"
      }
    }
  });

  grunt.registerTask('default', ['jslint', 'crx']);
};
