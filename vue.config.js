const path = require("path");
const fs = require("fs");
function resolve(name) {
  return path.resolve(__dirname, name);
}
const entry = {};
//获取packages文件夹下所有文件名
const files = fs.readdirSync(resolve("./packages"));
files.forEach(name => {
  name = name.split(".")[0];
  entry[name] = resolve("./packages/" + name);
});
console.log(entry);
/*
多入口打包配置
{ 
  index: 'E:\\demo\\chuman-ui\\packages\\index', 
  modal: 'E:\\demo\\chuman-ui\\packages\\modal', 
  toast: 'E:\\demo\\chuman-ui\\packages\\toast' 
}
*/
const prod = {
  css: {
    sourceMap: true,
    extract: {
      filename: "style/[name].css"
    }
  },
  configureWebpack: {
    entry: {
      ...entry
    },
    output: {
      filename: "[name]/index.js",
      libraryTarget: "commonjs2"
    }
  },
  chainWebpack: config => {
    // @ 默认指向 src 目录，这里要改成 examples
    // 另外也可以新增一个 ~ 指向 packages
    config.resolve.alias
      .set("@", path.resolve("examples"))
      .set("~", path.resolve("packages"));
    config.module
      .rule("js")
      .include.add(/packages/)
      .end()
      .include.add(/examples/)
      .end()
      .use("babel")
      .loader("babel-loader")
      .tap(options => {
        // 修改它的选项...
        return options;
      });
    config.optimization.delete("splitChunks");
    config.plugins.delete("copy");
    config.plugins.delete("html");
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    config.plugins.delete("hmr");
    config.entryPoints.delete("app");
  },
  outputDir: "lib",
  productionSourceMap: false
};
const dev = {
  pages: {
    index: {
      entry: "examples/main.js",
      template: "public/index.html",
      filename: "index.html"
    }
  },
  chainWebpack: config => {
    // @ 默认指向 src 目录，这里要改成 examples
    // 另外也可以新增一个 ~ 指向 packages
    config.resolve.alias
      .set("@", path.resolve("examples"))
      .set("~", path.resolve("packages"));
    config.module
      .rule("js")
      .include.add(/packages/)
      .end()
      .include.add(/examples/)
      .end()
      .use("babel")
      .loader("babel-loader")
      .tap(options => {
        // 修改它的选项...
        return options;
      });
  }
};
module.exports = process.env.NODE_ENV === "production" ? prod : dev;
