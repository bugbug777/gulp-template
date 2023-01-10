# gulp-template

## Table of Contents

- [gulp-template](#gulp-template)
  - [Table of Contents](#table-of-contents)
  - [關於 ](#關於-)
  - [測試環境 ](#測試環境-)
  - [快速開始 ](#快速開始-)
  - [相關命令 ](#相關命令-)
  - [關於 gulp-template 目錄結構](#關於-gulp-template-目錄結構)
  - [關於 `gulp watch`](#關於-gulp-watch)
  - [關於 sourcemaps](#關於-sourcemaps)

## 關於 <a name = "about"></a>

透過 gulp 將前端任務工作進行自動化處理，進而提升開發的效率，透過 gulp 進行自動化處理的工作，包含但不限於檔案複製、編譯、壓縮優化等等...

此外，雖然 gulp 作為私人開發用途依然相當方便，但已逐漸脫離主流，因前端的需求日益複雜，複雜的程式碼以及肥大的框架已逐漸造成編譯效能的低下，此專案目前主要用於熟悉、練習 gulp 為主要目的，但如果你具有相關自動化工具開發的經驗，依然能夠利用此專案，並自行修改便於開發的自動化工具。

實際上，如果沒有特殊需求，此專案對於一般的前端開發任務已足敷使用。

## 測試環境 <a name = "test_enviroment"></a>

1. Node 12.22.12（ Node 14.x 應該也可以正常運作 ）
2. npm v6.14.16

## 快速開始 <a name = "quick_start"></a>

下載該專案並執行下方步驟：

1. `npm install`
2. `gulp`


## 相關命令 <a name = "usage"></a>

1. `gulp html` - 複製 html
2. `gulp css` - 複製 css
3. `gulp js` - 複製 js
4. `gulp clean` - 清除暫存檔案
5. `gulp watch` - 自動監測檔案異動

## 關於 gulp-template 目錄結構

```
gulp-template
| - src/                 # development 目錄
| - public/              # production 目錄
| - gulpfile.js/         # gulp 設定檔
| - postcss.config.js    # postcss 相關套件引入
| - browserslistrc       # 瀏覽器相容性
| - package.json         # Node pkgs
| - README.md
```

## 關於 `gulp watch`

`gulp watch` 可以自動監測檔案的異動狀況，新增以及修改都能夠正常運作，但是當 `src` 目錄中的檔案被移除時，並不會主動的移除 `public` 目錄中的檔案，這點是需要多加注意的地方，解決的辦法是，重新使用 `gulp` 預設指令，此指令會在執行開始時，主動清除舊有的目錄以及檔案，並重新產生新的資料。

## 關於 sourcemaps

輸出目錄 `public/` 中，`styles/` 以及 `scripts/` 皆有一個 `maps/`，此目錄主要用於分類、存放 sourcemaps，如果想要讓專案結構更加扁平化，可以自行到 `gulpfile.js` 自行修改輸出目錄。