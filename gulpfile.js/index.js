const { src, dest, series, parallel, watch } = require('gulp')
const postcss = require('gulp-postcss')
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
   * 1. 使用 postcss 搭配 autoprefixer 替 CSS 語法加上前綴詞
   */
  return src('./src/assets/styles/**/*.css')
    .pipe(postcss())
    .pipe(dest('./public/styles'))
}

const js = () => {
  /**
   * 複製 src/assets/scripts 目錄下的 .js 檔案到 public/scripts 目錄中
   */
  return src('./src/assets/scripts/**/*.js')
    .pipe(dest('./public/scripts'))
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

const watchFiles = (done) => {
  /**
   * 自動監測檔案變化，並進行檔案的複製、編譯異動
   * watch syntax: watch('glob string', task func)
   */
  watch(['./src/**/*.{html,css,js}'], parallel(html, css))
  // watch('./src/assets/styles/**/*.css', css)
  watch('./src/assets/scripts/**/*.js', js)

  done()
}

// 測試指令
exports.html = html
exports.css = css
exports.js = js
exports.clean = cleanFiles
exports.watch = watchFiles

// 預設指令
exports.default = series(cleanFiles, parallel(html, css, js), watchFiles)