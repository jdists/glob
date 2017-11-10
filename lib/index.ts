import * as glob from 'glob'
import * as jdistsUtil from 'jdists-util'
import * as jsyaml from 'js-yaml'
interface IGlobAttrs extends jdistsUtil.IAttrs {
  /**
   * 匹配表达式
   */
  pattern?: string
}
/**
 * glob 遍历目录文件
 *
 * @param content 文本内容
 * @param attrs 属性
 * @param attrs.pattern 匹配表达式
 * @param scope 作用域
 * @param scope.execImport 导入数据
 * @param scope.getDirname 获取当前目录
 * @return 返回渲染后的结果
 * @example processor():attrs.pattern
  ```js
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
  console.log(JSON.stringify(processor(null, attrs, scope)))
  // > "- gulpfile.js\n- package.json\n- version.js\n"
  console.log(JSON.stringify(processor(null, {}, scope)))
  // > null
  ```
 * @example processor():content
  ```js
  let attrs = {
  }
  let scope = {
    getDirname: function () {
      return ``
    },
  }
  console.log(JSON.stringify(processor(`
    *.js
    version.js
    *.json
  `, attrs, scope)))
  // > "- gulpfile.js\n- package.json\n- version.js\n"
  console.log(JSON.stringify(processor(`
    *.{js,json}
    !package*
  `, attrs, scope)))
  // > "- gulpfile.js\n- version.js\n"
  ```
 */
export = (function (content: string, attrs: IGlobAttrs, scope: jdistsUtil.IScope): string {
  if (attrs.pattern) {
    content = scope.execImport(attrs.pattern)
  }
  if (!content) {
    return content
  }
  let positives = []
  let negatives = []
  String(content).split(/\n/).forEach((pattern) => {
    pattern = pattern.trim()
    if (pattern) {
      let arr = positives
      if (/^\![^(]/.test(pattern)) {
        pattern = pattern.slice(1)
        arr = negatives
      }
      let g = new glob.Glob(pattern, {
        sync: true,
        cwd: scope.getDirname(),
      })
      Array.prototype.push.apply(arr, g.found)
    }
  })
  let exists = {}
  return jsyaml.safeDump(positives.filter((item) => {
    if (!exists[item] && negatives.indexOf(item) < 0) {
      exists[item] = true
      return true
    }
  }).sort())
}) as jdistsUtil.IProcessor