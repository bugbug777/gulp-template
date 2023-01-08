const { src, dest, series, parallel } = require('gulp')

const html = () => {
  /**
   * 複製 src 目錄下的 .html 檔案到 public 目錄中
   */
  return src('./src/**/*.html')
    .pipe(dest('./public'))
}

// 測試指令
exports.html = html

// 預設指令
exports.default = series(parallel(html))