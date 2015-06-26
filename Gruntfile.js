module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: "\n\n"
      },
      dist: {
        src: [
          'src/vendor/zepto.min.js',
          'src/_begin.js',
          // 'src/action.js',
          'src/controller.js',
          'src/dom.js',
          'src/event.js',
          // 'src/heartbeat.js',
          'src/model.js',
          'src/module.js',
          'src/storage.js',
          'src/http.js',
          'src/_end.js'
        ],
        dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    qunit: {
      files: ['test/*.html']
    },

    jshint: {
      files: ['dist/rincojs.js'],
      options: {
        globals: {
          console: true,
          module: true,
          document: true
        },
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      files: ['src/*.js'],
      tasks: ['concat', 'jshint', 'qunit']
    },

   'http-server': {

      'dev': {

          // the server root directory
          root: '.',

          // the server port
          // can also be written as a function, e.g.
          // port: function() { return 8282; }
          port: 7800,


          // the host ip address
          // If specified to, for example, "127.0.0.1" the server will
          // only be available on that ip.
          // Specify "0.0.0.0" to be available everywhere
          host: "0.0.0.0",

          cache: 0,
          showDir : true,
          autoIndex: true,

          // server default file extension
          ext: "html",

          // run in parallel with other tasks
          runInBackground: false,

          // specify a logger function. By default the requests are
          // sent to stdout.
          logFn: function(req, res, error) { }

      }

    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-http-server');
  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('default', ['concat', 'qunit', 'uglify']);
  grunt.registerTask('server', ['http-server', 'watch']);


};
