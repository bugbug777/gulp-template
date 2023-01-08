const { src, dest, series, parallel } = require('gulp')

const html = () => {
  /**
   * 複製 src 目錄下的 .html 檔案到 public 目錄中
   */
  return src('./src/**/*.html')
    .pipe(dest('./public'))
}

const css = () => {
  /**
   * 複製 src/assets/styles 目錄下的 .css 檔案到 public/styles 目錄中
   */
  return src('./src/assets/styles/**/*.css')
    .pipe(dest('./public/styles'))
}

// 測試指令
exports.html = html
exports.css = css

// 預設指令
exports.default = series(parallel(html, css))