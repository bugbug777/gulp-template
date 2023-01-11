const { src, dest, series, parallel, watch } = require('gulp')
const $ = require('gulp-load-plugins')()
const browserSync = require('browser-sync').create()

// 開發狀態
let status = 'development'

const html = () => {
  /**
   * 複製 src 目錄下的 .html 檔案到 public 目錄中
   * 1. 透過 frontMatter 汲取文檔的 YAML front-matter header，並將其移除
   * 2. 將 frontMatter 汲取的設定，轉換成物件並令其為新屬性 frontMatter 爾後將其加入到 file 物件中
   * 3. 將取得的 frontMatter 作為 options 傳遞給 layout 進行使用。透過 callback func 的方式取得 file 物件，並將其 file.frontMatter 回傳給 layout
   */
  return src('./src/**/*.html')
    .pipe($.frontMatter())
    .pipe(
      $.layout(function (file) {
        return file.frontMatter
      })
    )
    .pipe(
      $.if(
        status != 'development',
        $.htmlmin({ collapseWhitespace: true, removeComments: true }) // compress with htmlmin, and remove comments in production
      )
    )
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
    .pipe($.sourcemaps.init()) // 初始化 sourcemaps
    .pipe($.postcss())
    .pipe($.if(status != 'development', $.cleanCss())) // compress with clean-css
    .pipe($.sourcemaps.write('./maps')) // 指定 sourcemaps 輸出路徑
    .pipe(dest('./public/styles'))
    .pipe(browserSync.stream())
}

const js = () => {
  /**
   * 複製 src/assets/scripts 目錄下的 .js 檔案到 public/scripts 目錄中
   * 1. 將數個 scripts 整合成一個 scripts 輸出，減少頁面請求次數，提升網頁載入效率
   */
  return src('./src/assets/scripts/**/*.js')
    .pipe($.sourcemaps.init()) // 初始化 sourcemaps
    .pipe(
      $.babel({
        presets: ['@babel/env']
      })
    )
    .pipe($.concat('all.js'))
    .pipe($.if(status != 'development', $.uglify())) // compress with uglify()
    .pipe($.sourcemaps.write('./maps')) // 指定 sourcemaps 輸出路徑
    .pipe(dest('./public/scripts'))
    .pipe(browserSync.stream())
}

const img = () => {
  /**
   * 複製 src/assets/images 下的所有圖檔到 public/images
   * 1. imagemin v8.0.0 會有 ESM import 錯誤的問題，要使用 v7.1.0
   * refs: https://www.npmjs.com/package/gulp-imagemin
   */
  return src('./src/assets/images/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe($.if(status != 'development', $.imagemin()))
    .pipe(dest('./public/images'))
}

const cleanFiles = () => {
  /**
   * 在開始複製、編譯檔案前，清除 public 目錄，以確保產生乾淨的新檔案
   * 1. read:false 關閉自動讀取以提升效能
   * 2. allowEmpty:true 允許 public 不存在時的例外錯誤
   */
  return src('./public', { read: false, allowEmpty: true }).pipe($.clean())
}

const watchFiles = done => {
  /**
   * 自動監測檔案變化，並進行檔案的複製、編譯異動
   * watch syntax: watch('glob string', task func)
   * 1. 使用 TailwindCSS 主要透過 postcss 處理，因此不需要使用額外的 .css 檔案處理
   * 2. TailwindCSS 會透過 tailwind.config.js 中的 content 擷取要製造 CSS 的檔案，因此不需要透過 watch 處理
   * 3. watch 主要處理檔案的異動，例如：新增檔案要進行複製，且重新執行任務，因此只要確保 HTML, EJS, CSS 異動時有重新執行任務即可
   */
  browserSync.init({
    server: {
      baseDir: './public' // <= 指向虛擬伺服器需存取的資料夾
    },
    // port: 6600,
    reloadDelay: 1000
  })

  watch('./src/**/*.{html,ejs,css}', parallel(html, css))
  watch('./src/assets/scripts/**/*.js', js)
  watch('./src/assets/images/**/*.{png,jpg,jpeg,gif,svg}', img)

  done()
}

// 測試指令
exports.html = html
exports.css = css
exports.js = js
exports.img = img
exports.clean = cleanFiles
exports.watch = watchFiles

// 本地開發
exports.default = series(cleanFiles, parallel(html, css, js, img), watchFiles)

// 線上部署
exports.build = series(
  cleanFiles,
  done => {
    status = 'production'
    done()
  },
  parallel(html, css, js, img)
)
