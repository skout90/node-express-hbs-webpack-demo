const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = require("../../config");
const path = require("path");

var htmlWebpackPlugins = [];

var walk = function(dir) {
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + "/" + file;
    var stat = fs.statSync(file);
    // 폴더일 경우
    if (stat && stat.isDirectory()) {
      if (file.indexOf("partials") === -1) {
        walk(file);
      }
    } else {
      // 파일일 경우 HtmlWebpackPlugin에 추가
      var option = {
        inject: false, // 템플릿의 script 및 asset 주입여부, 해당 프로젝트에서는 script/asset을 따로 관리한다.
        template: file,
        cache: true,
        filename: file.substr(file.indexOf("views"), file.length),
        custominject: true,
        // 해당 주석을 찾아 chunk파일을 추가
        styleplaceholder: "<!--webpack_style_placeholder-->",
        scriptplaceholder: "<!--webpack_script_placeholder-->",
        chunks: []
      };
      
      // 레이아웃 아래에 있는 경우 청크를 만들지 않음
      if (file.indexOf("layout") === -1) {
        // 청크 명명 규칙은 다음과 같이 views 폴더 아래에있는`directory name.filename`입니다 : home.index
        const chunk = file
          .replace(config.build.viewsSourcePath, "")
          .replace(path.extname(file), "")
          .replace("/", "")
          .replace(/\//g, ".");
        option.chunks.push(chunk);
      }
      htmlWebpackPlugins.push(new HtmlWebpackPlugin(option));
    }
  });
  return htmlWebpackPlugins;
};
walk(config.build.viewsSourcePath);
module.exports = htmlWebpackPlugins;
