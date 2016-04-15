module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      target: {
        options: {
          compress: true,
          paths: ["assets/css"]
        },
        files: [{
            expand: true,
            cwd: "assets/css/",
            src: "*.less",
            dest: "assets/css/",
            ext: ".min.css"
        }]
      }
    },
    jshint: {
      target: {
        options: {
          globals: {
            jQuery: true
          }
        },
        files: {
            src: ["Gruntfile.js", "modules/*-min.js"]
        }
      }
    },
    uglify: {
      target: {
        options: {
          banner: "/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today('mm-dd-yyyy') %> */"
        },
        files: [{
            expand: true,
            cwd: "modules",
            src: "*.js",
            dest: "modules",
            ext: ".min.js"
        }]
      }
    },
    express: {
      target: {
        options: {
          script: "app.js"
        }
      }
    },
    watch: {
      css: {
        files: ["assets/css/*.less"],
        tasks: ["less:target"]
      },
      js: {
        files: ["Gruntfile.js", "modules/*.js"],
        tasks: ["uglify:target", "jshint:target"]
      },
      server: {
        files: ["app.js"],
        tasks: ["express:target"],
        options: {
          atBegin: true,
          spawn: false
        }
      }
    }
  });
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks("grunt-express-server");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["less", "jshint", "uglify", "express"]);
};
