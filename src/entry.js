const { exportMod, exportPage } = require('./exportCode');
const { line2Hump } = require('./utils');

module.exports = function(schema, option) {
  // get blocks json
  const blocks = [];
  function schemaHandler(json) {
    switch (json.componentName.toLowerCase()) {
      case 'block':
        // parse fileName
        json.fileName = json.fileName || json.id;
        if (
          json.smart &&
          json.smart.layerProtocol &&
          json.smart.layerProtocol.module &&
          json.smart.layerProtocol.module.type
        ) {
          json.fileName = json.smart.layerProtocol.module.type.replace(
            /[@|\/]/g,
            ''
          );
        }
        json.fileName = line2Hump(json.fileName);
        blocks.push(json);
        break;
      default:
        break;
    }
    if (json.children && json.children.length > 0) {
      json.children.forEach(child => {
        schemaHandler(child);
      });
    }
  }

  // invoke
  schemaHandler(schema);

  // export module code
  let panelDisplay = [];
  blocks.length > 0 &&
    blocks.forEach(block => {
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
