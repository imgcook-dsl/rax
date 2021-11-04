const { exportMod, exportPage } = require('./exportCode');
const { line2Hump, transComponentsMap, formatSchema } = require('./utils');

module.exports = function(schema, option) {
  // get blocks json
  const blocks = [];
  const scale = 750 / (option.responsive && option.responsive.width || 750);
  const componentsMap = transComponentsMap(option.componentsMap);

  option.scale = scale;
  option.componentsMap = componentsMap;


  function schemaHandler(option) {
    const { json, scale } = option;
    switch (json.componentName.toLowerCase()) {
      case 'page':
        json.fileName = json.fileName || `page_${json.id.slice(0, 6)}`;
        break;
      case 'block':
        // parse fileName
        json.fileName = json.fileName || `block_${json.id.slice(0, 6)}`;
        json.fileName = json.fileName === 'index' ? json.fileName : line2Hump(json.fileName);
        blocks.push(json);
        break;
      default:
        break;
    }
    if (json.children && json.children.length > 0 && Array.isArray(json.children)) {
      json.children.forEach(child => {
        schemaHandler({
          json: child,
          scale,
        });
      });
    }
  }

  // clear schema
  formatSchema(schema)
  // invoke
  schemaHandler({
    json: schema,
    scale
  });

  // export module code
  let panelDisplay = [];

  option.blocksCount = blocks.length;
  option.blockInPage = schema.componentName === 'Page'
  option.pageGlobalCss = schema.css || ''
  
  option.imgcookConfig = Object.assign({
    globalCss: true,
    cssUnit: 'rpx',
    inlineStyle: "className"
  },
    option.imgcookConfig,
    schema.imgcookConfig,
    option._.get(schema, 'imgcook.dslConfig'),
  )

  option.imgcookConfig.inlineStyle = option.imgcookConfig.inlineStyle === 'className';
  option.imgcookConfig.useHooks = option.imgcookConfig.componentStyle === 'hooks';


  blocks.length > 0 &&
    blocks.forEach(block => {
      const result = exportMod(block, option);
      panelDisplay = panelDisplay.concat(result);
    });
  // export Page code
  if (schema.componentName === 'Page') {
    const result = exportPage(schema, option);
    panelDisplay = panelDisplay.concat(result);
  }

  return {
    panelDisplay,
    noTemplate: true
  };
};
