
global.processor = require('../')
      

describe("src/index.ts", function () {
  var assert = require('should');
  var util = require('util');
  var examplejs_printLines;
  function examplejs_print() {
    examplejs_printLines.push(util.format.apply(util, arguments));
  }
  
  

  it("processor():attrs.pattern", function () {
    examplejs_printLines = [];
  let attrs = {
    pattern: '*.{js,json}'
  }
  let scope = {
    getDirname: function () {
      return ``
    },
    execImport: function (importion) {
      return importion
    },
  }
  examplejs_print(JSON.stringify(processor(null, attrs, scope)))
  assert.equal(examplejs_printLines.join("\n"), "\"- gulpfile.js\\n- package.json\\n- version.js\\n\""); examplejs_printLines = [];

  examplejs_print(JSON.stringify(processor(null, {}, scope)))
  assert.equal(examplejs_printLines.join("\n"), "null"); examplejs_printLines = [];
  });
          
  it("processor():content", function () {
    examplejs_printLines = [];
  let attrs = {
  }
  let scope = {
    getDirname: function () {
      return ``
    },
  }
  examplejs_print(JSON.stringify(processor(`
    *.js
    version.js
    *.json
  `, attrs, scope)))
  assert.equal(examplejs_printLines.join("\n"), "\"- gulpfile.js\\n- package.json\\n- version.js\\n\""); examplejs_printLines = [];
  examplejs_print(JSON.stringify(processor(`
    *.{js,json}
    !package*
  `, attrs, scope)))
  assert.equal(examplejs_printLines.join("\n"), "\"- gulpfile.js\\n- version.js\\n\""); examplejs_printLines = [];
  });
          
});
         