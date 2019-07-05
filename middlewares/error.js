const routeCommon = require("../routes/routeCommon");

/**
 * 500
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = async function(err, req, res, next) {
  res.status(err.status || 500);
  if (process.env.NODE_ENV === "local") {
    console.log(err.stack);
  }
  if (err.status == 401) {
    res.redirect("/login");
  } else if (err.status == 404) {
    await require("./notFound")(req, res, next);
  } else {
    if (req.xhr) {
      return res.json({
        errorCode: 500,
        errorMsg: "服务器错误",
        httpStatusCode: 500,
        instance: null,
        success: false
      });
    }
    var vm = {};
    routeCommon.pageInfo(vm, {
      title: "서버오류"
    });
    res.status(500);
    vm.errorMsg = err.message;
    // 템플릿 사용 안함
    // vm.layout = false;
    res.render("shared/500", vm);
  }
};
