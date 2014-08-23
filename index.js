/*
 * fis-postpackager-htmlmin
 * http://fis.baidu.com/
 *
 * Copyright (c) 2014 babyzone2004
 * Licensed under the MIT license.
 */

'use strict';
var chalk = require('chalk');
var minify = require('html-minifier').minify;
var mix = function(o, data) {
    for(var key in data) {
        o[key] = data[key];
    }
    return o;
}

var defaultOptions = {
    removeComments: true,
    collapseWhitespace: true,
    minifyJS: true
};

var prettyBytes = function(num) {
    var result = (num / 1024).toFixed(2);
    return  result + "kb";
}

module.exports = function(ret, conf, settings, opt) {
    if (!opt.pack) {
        return;
    }
    var min;
    var option = mix(defaultOptions, settings);

    fis.util.map(ret.src, function(subpath, file) {
    if (file.isHtmlLike && file.noMapJs !== false) {
        var content = file.getContent();
        try {
            min = minify(content, option);
        } catch (err) {
            return console.log(chalk.cyan(err));
        }
        console.log('Minified ' + chalk.cyan(file.basename) 
            + " " + prettyBytes(Buffer.byteLength(content, 'utf8')) 
            + " → " + prettyBytes(Buffer.byteLength(min, 'utf8')));
        file.setContent(min);
    }
    });
};
