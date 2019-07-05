let handlebarsHelpers = require('handlebars-helpers')(['array', 'string', 'comparison']);

handlebarsHelpers.renderSection = require('./renderSection');
handlebarsHelpers.assign = require('./assign');

module.exports = handlebarsHelpers