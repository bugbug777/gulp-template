const { src, dest, series, parallel, watch } = require('gulp')
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const babel = require('gulp-babel')
const clean = require('gulp-clean')
const browserSync = require('browser-sync').create()

const html = () => {
  /**
   * 複製 src 目錄下的 .html 檔案到 public 目錄中
   */
  return src('./src/**/*.html')
    .pipe(dest('./public'))
    .pipe(browserSync.stream())
}

const css = () => {
  /**
   * 複製 src/assets/styles 目錄下的 .css 檔案到 public/styles 目錄中
   * 1. 使用 postcss 搭配 autoprefixer 替 CSS 語法加上前綴詞
   * 2. 使用 CSS Framework, TailwindCSS
   * 3. 使用 sourcemaps 定位 CSS source code
   */
  return src('./src/assets/styles/**/*.css')
    .pipe(sourcemaps.init()) // 初始化 sourcemaps
    .pipe(postcss())
    .pipe(sourcemaps.write('./maps')) // 指定 sourcemaps 輸出路徑
    .pipe(dest('./public/styles'))
    .pipe(browserSync.stream())
}

const js = () => {
  /**
   * 複製 src/assets/scripts 目錄下的 .js 檔案到 public/scripts 目錄中
   * 1. 將數個 scripts 整合成一個 scripts 輸出，減少頁面請求次數，提升網頁載入效率
   */
  return src('./src/assets/scripts/**/*.js')
    .pipe(sourcemaps.init()) // 初始化 sourcemaps
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('./maps')) // 指定 sourcemaps 輸出路徑
    .pipe(dest('./public/scripts'))
    .pipe(browserSync.stream())
}

const cleanFiles = () => {
  /**
   * 在開始複製、編譯檔案前，清除 public 目錄，以確保產生乾淨的新檔案
   * 1. read:false 關閉自動讀取以提升效能
   * 2. allowEmpty:true 允許 public 不存在時的例外錯誤
   */
  return src('./public', { read: false, allowEmpty: true }).pipe(clean())
}

const watchFiles = done => {
  /**
   * 自動監測檔案變化，並進行檔案的複製、編譯異動
   * watch syntax: watch('glob string', task func)
   * 1. 移除 globs string {html,css,js} 語法，直接在 ./src 下搜索此語法，可能會浪費效能，應該修改為針對每個目錄進行監測
   */
  browserSync.init({
    server: {
      baseDir: './public' // <= 指向虛擬伺服器需存取的資料夾
    },
    // port: 6600,
    reloadDelay: 1000,
  })

  watch('./src/**/*.html', html)
  watch(
    [
      './src/**/*.html',
      './src/assets/styles/**/*.css',
      './src/assets/scripts/**/*.js'
    ],
    css
  )
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
