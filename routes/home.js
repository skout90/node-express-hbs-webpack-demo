const express = require("express");
const router = express.Router();
const routeCommon = require("./routeCommon");

/* GET home page. */
router.get("/", function(req, res, next) {
  var vm = {
  };
  routeCommon.pageInfo(vm, {
    title: "홈"
  });
  res.render("home/index", vm);

  // res.render('index', {
  //     title  : '홈',
  //     message: 'hello world',
  //     layout: 'shared-templates',
  //     helpers: {
  //         yell: function (msg) {
  //             return (msg + '!!!');
  //         }
  //     }
  // });
});

router.get("/index", function(req, res, next) {
  res.redirect("/");
});

router.get("/about", function(req, res, next) {
  res.send("Webpack Express project");
});

module.exports = router;
