const favicon = require("serve-favicon");
const path = require("path");
require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const compression = require("compression");
const utils = require("./utils");
const middlewares = require("./middlewares");
const expressHandlebarsMemoryFs = require("express-handlebars-memory-fs");

const isLocal = process.env.NODE_ENV === "local";
let appConfig = null;

function initExpressApp(config) {
  appConfig = config;

  if (!appConfig.appName) {
    throw new Error("앱 이름을 설정해주세요.");
  }
  global.appName = appConfig.appName;

  let app = express();

  app.disable("etag");
  // 서버 종류 감춤
  app.locals.settings["x-powered-by"] = false;
  app.use(compression());

  let projectRootPath = appConfig.projectRootPath;
  if (isLocal) {
    app.use(
      favicon(path.join(projectRootPath, "client", "assets", "favicon.ico"))
    );
  } else {
    app.use(
      favicon(path.join(projectRootPath, "dist", "assets", "favicon.ico"))
    );
  }
  app.use(express.static(path.join(projectRootPath, "dist")));

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  app.use(cookieParser());

  if (isLocal) {
    const reload = require("reload");
    reload(app, {
      port: appConfig.build.reloadPort
    });
  }
  return app;
}

function useHandlebarsViewEngine(app) {
  const exphbs = require("express-handlebars");
  let projectRootPath = appConfig.projectRootPath;
  // view engine setup
  let hbs = exphbs.create({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: utils.handlebarsHelpers
  });

  app.set("views", path.join(projectRootPath, "dist", "views"));
  app.engine("hbs", hbs.engine);
  app.set("view engine", "hbs");
  if (!isLocal) {
    app.set("view cache", true);
  }
}

function addWebpackDevAndHotMiddleware(app) {
  if (!isLocal) {
    return;
  }

  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const webpackHotMiddleware = require("webpack-hot-middleware");
  let webpackConfig = require("./build");

  let compiler = webpack(webpackConfig);
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      hot: true,
      stats: {
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }
    })
  );

  let hotMiddleware = webpackHotMiddleware(compiler);
  // compiler.plugin('compilation', function (compilation) {
  //   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
  //     //let cccc = compilation.getStats().toJson();
  //     hotMiddleware.publish({
  //       action: 'hbs-reload',
  //       data: data
  //     })
  //     if(cb){
  //       cb()
  //     }
  //   })
  // })
  app.use(hotMiddleware);

  expressHandlebarsMemoryFs(compiler.outputFileSystem);
}

function initAppMiddlewares(app) {
  // request 마다 id 부여
  app.use(middlewares.requestId);
}

function beforeInitAppRoutes(app) {
  // logger
  app.use(utils.logger.defaultLogger);
}

function afterInitAppRoutes(app) {
  // 404
  app.use(middlewares.notFound);

  // error logger
  app.use(utils.logger.errorLogger);

  // 오류처리
  app.use(middlewares.error);
}

function createHttpServer(app) {
  let appPort = normalizePort();
  let server = app.listen(appPort, function() {
    let addr = server.address();
    let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("Web server listening on " + bind);
  });
  server.on("error", onError);

  // Normalize a port into a number, string, or false.
  function normalizePort() {
    let port = parseInt(appConfig.appPort, 10);
    if (isNaN(port)) {
      // named pipe
      return appConfig.appPort;
    }
    if (port >= 0) {
      // port number
      return port;
    }
    return false;
  }

  // Event listener for HTTP server "error" event.
  function onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    let port = parseInt(appConfig.appPort, 10);
    let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}

module.exports = {
  initExpressApp,
  useHandlebarsViewEngine,
  addWebpackDevAndHotMiddleware,
  initAppMiddlewares,
  beforeInitAppRoutes,
  afterInitAppRoutes,
  createHttpServer
};
