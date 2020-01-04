
const { exportMod } = require('./exportCode');

module.exports = function(schema, option) {
  const result = exportMod(schema, option);
  const panelDisplay = result;
  return {
    panelDisplay,
    noTemplate: true
  };
};
