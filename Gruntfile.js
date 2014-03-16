module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    output: 'build/uQuery.js',
    watch: {
      default: {
        files: '<%= concat.append.src.join(",") %>'.split(","),
        tasks: ['concat:append', 'wrap', 'concat:after']
      }
    },
    concat: {
      options: {
        separator: '\n\n'
      },
      append: {
        src: [
          'src/core/variables.js',
          'src/core/constructor.js',
          'src/core/helpers.js',
          'src/functions/*.js',
          'src/functions/**/*.js'
        ],
        dest: '<%= output %>'
      },
      after: {
        src: [
          '<%= output %>',
          'src/helpers/*.js'
        ],
        dest: '<%= output %>'
      }
    },
    wrap: {
      default: {
        src: ['<%= concat.append.dest %>'],
        dest: '<%= concat.append.dest %>',
        options: {
          wrapper: grunt.file.read("src/template.js").split("/* insert code here */"),
          indent: '\t',
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-wrap');

  grunt.registerTask('default', ['concat:append', 'wrap', 'concat:after', 'watch']);

};
