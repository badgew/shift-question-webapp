module.exports = function(grunt) {


  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    variables: {
        theme: 'winchester_1.1',
        masterCSS: 'style.sass',
        masterJS: 'application.js',
        assets: {
          // paths in dev
          dev: {
            css: "css",
            js: "js",
            img: "img",
            fonts: "fonts",
            html: {
              layouts: 'layouts',
              partials: 'partials',
              templates: 'templates'
            }
          },

          // paths from dev to theme
          theme: {
            css: "../_themes/<%= variables.theme %>/css",
            js: "../_themes/<%= variables.theme %>/js",
            img: "../_themes/<%= variables.theme %>/img",
            fonts: "../_themes/<%= variables.theme %>/fonts",
            html: {
              layouts: '../_themes/<%= variables.theme %>/layouts',
              partials: '../_themes/<%= variables.theme %>/partials',
              templates: '../_themes/<%= variables.theme %>/templates'
            }
          }
        },
        jsLibs: {
          jq: 'bower_components/jquery/dist/jquery.min.js',
          whatInput: 'bower_components/what-input/what-input.min.js',
          slick: 'bower_components/slick-carousel/slick/slick.min.js',
          instafeed: 'bower_components/instafeed.js/instafeed.min.js'
        }
    },

    serve: {
      options: {
        port: 9000
      }
    },

    watch: {
      options: {
        livereload: true
      }
    }
  });

  // Loading
  grunt.loadNpmTasks('grunt-serve');

  // Tasks
  grunt.registerTask('default', ['serve']);
};
