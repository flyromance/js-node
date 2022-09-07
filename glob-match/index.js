/* mini */
const minimatch = require('minimatch');
console.log(minimatch.match(['a/1.js'], 'a/(1|2).js')); // []

const multimatch = require('multimatch');
console.log(multimatch(['a/1.js'], 'a/(1|2).js')); // []

const glob = require('glob');
console.log(glob.sync('a/(1|2).js')); // []
console.log(glob.sync('a/@(1|2).js')); // ['a/1.js', 'a/2.js']

/* micro */
const micromatch = require('micromatch');
console.log(micromatch(['a/1.js'], ['a/(1|2).js'])); // ['a/1.js']

const fastGlob = require('fast-glob');
console.log(fastGlob.sync('a/(1|2).js')); // ['a/1.js', 'a/2.js']
console.log(fastGlob.sync('a/@(1|2).js')); // ['a/1.js', 'a/2.js']

const escapeStringRegexp = require('escape-string-regexp');
console.log('/');
console.log(escapeStringRegexp('/'));