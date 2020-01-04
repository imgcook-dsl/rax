
const { exportMod, exportPage } = require('./exportCode');

module.exports = function(schema, option) {

  // get blocks json
  const blocks = [];
  function schemaHandler(json) {
    switch (json.componentName.toLowerCase()) {
      case 'block':
        blocks.push(json);
        break;
      default:
        break;
    }
    if (json.children && json.children.length > 0) {
      json.children.forEach((child) => {
        schemaHandler(child);
      });
    }
  }

  // invoke
  schemaHandler(schema);

  // export module code
  let panelDisplay = [];
  blocks.length > 0 && blocks.forEach((block) => {
    const result = exportMod(block, option);
    panelDisplay = panelDisplay.concat(result);
  });

  // export Page code
  const result = exportPage(schema, option);
  panelDisplay = panelDisplay.concat(result);

  return {
    panelDisplay,
    noTemplate: true
  };
};
