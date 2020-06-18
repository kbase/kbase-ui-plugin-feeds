/*eslint-env node*/
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            dagre: {
                expand: true,
                flatten: true,
                src: 'node_modules/dagre/dist/dagre.js',
                dest: '../src/plugin/iframe_root/modules/vendor/dagre'
            },
            // 'dagre-d3': {
            //     expand: true,
            //     flatten: true,
            //     src: 'node_modules/dagre-d3/dist/dagre-d3.js',
            //     dest: '../src/plugin/iframe_root/js/vendor/dagre-d3'
            // },
            // 'pure-uuid': {
            //     expand: true,
            //     flatten: true,
            //     src: 'node_modules/pure-uuid/uuid.js',
            //     dest: '../src/plugin/iframe_root/modules/vendor/pure-uuid'
            // },
            preact: {
                expand: true,
                flatten: true,
                src: 'node_modules/preact/dist/preact.umd.js',
                dest: '../src/plugin/iframe_root/modules/vendor/preact'
            }
        },
        clean: {
            options: {
                force: true
            },
            vendor: '../src/plugin/iframe_root/modules/vendor/*',
            bower: './bower_components/',
            npm: './node_modules/'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
};
