"use strict";
var glob = require("glob");
var jsyaml = require("js-yaml");
module.exports = (function (content, attrs, scope) {
    if (attrs.pattern) {
        content = scope.execImport(attrs.pattern);
    }
    if (!content) {
        return content;
    }
    var positives = [];
    var negatives = [];
    String(content).split(/\n/).forEach(function (pattern) {
        pattern = pattern.trim();
        if (pattern) {
            var arr = positives;
            if (/^\![^(]/.test(pattern)) {
                pattern = pattern.slice(1);
                arr = negatives;
            }
            var g = new glob.Glob(pattern, {
                sync: true,
                cwd: scope.getDirname(),
            });
            Array.prototype.push.apply(arr, g.found);
        }
    });
    var exists = {};
    return jsyaml.safeDump(positives.filter(function (item) {
        if (!exists[item] && negatives.indexOf(item) < 0) {
            exists[item] = true;
            return true;
        }
    }).sort());
});
