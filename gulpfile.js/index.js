const { src, dest, series, parallel } = require('gulp')
const clean = require('gulp-clean')

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

const cleanFiles = () => {
  /**
   * 在開始複製、編譯檔案前，清除 public 目錄，以確保產生乾淨的新檔案
   * 1. read:false 關閉自動讀取以提升效能
   * 2. allowEmpty:true 允許 public 不存在時的例外錯誤
   */
  return src('./public', {read: false, allowEmpty: true})
    .pipe(clean())
}

// 測試指令
exports.html = html
exports.css = css
exports.clean = cleanFiles

// 預設指令
exports.default = series(cleanFiles, parallel(html, css))