module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    output: 'build/uQuery.js',
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
    },
    
    watch: {
      default: {
        files: ['src/**/*.js', 'src/*.js'],
        tasks: ['concat:append', 'wrap', 'concat:after']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-wrap');

  grunt.registerTask('default', ['concat:append', 'wrap', 'concat:after', 'watch']);

};
