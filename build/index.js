let config = {};
if (process.env.NODE_ENV === "production") {
  config = require("./webpack.production");
} else if (process.env.NODE_ENV === "local") {
  config = require("./webpack.local");
} else {
  //process.env.NODE_ENV === 'dev'
  config = require("./webpack.dev");
}
module.exports = config;
