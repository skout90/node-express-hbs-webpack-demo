module.exports = function (varName, varValue, options) {
  if (!options.data.root) {
      options.data.root = {};
  }
  options.data.root[varName] = varValue;
}