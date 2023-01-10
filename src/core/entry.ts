import { IPanelDisplay, IDslConfig } from './interface';
import {
  genDepComponentsMap,
  transComponentsMap,
  initSchema,
  traverse,
  genStyleClass,
  getGlobalClassNames,
  genStyleCode,
  isExpression
} from './utils';
import { CSS_TYPE, COMPONENT_TYPE, OUTPUT_TYPE, initConfig } from './consts';



import exportBlock from './exportBlock';
// const exportPage from './exportPage';
import exportCreateApp from './exportCreateApp';
import exportGlobalCss from './exportGlobalCss';
import defaultComponentsMap from './defaultComponentsMap';

module.exports = function(schema, option) {

  // get blocks json
  const blocks: any[] = [];
  const pages: any[] = []

  // 参数设置
  option.scale = 750 / ((option.responsive && option.responsive.width) || 750);

  const componentsMap = Object.keys(option.componentsMap).length == 0 ? transComponentsMap(defaultComponentsMap as any) : transComponentsMap(option.componentsMap || {})

  if (schema && schema.imgcook && schema.imgcook.dependencies) {
    genDepComponentsMap(schema.imgcook.dependencies, componentsMap)
  }
  option.componentsMap = componentsMap;
  option.blockInPage = schema.componentName === 'Page';
  option.pageGlobalCss = schema.css || '';

  // console.log('schema', schema, option)

  const dslConfig = Object.assign(
    {
      scale: option.scale,
      globalCss: true,
      cssUnit: 'px',
      inlineStyle: CSS_TYPE.MODULE_CLASS,
      componentStyle: COMPONENT_TYPE.HOOKS,
      htmlFontSize: 16
    },
    option._.get(schema, 'imgcook.dslConfig')
  );

  dslConfig.useHooks = dslConfig.componentStyle ===  COMPONENT_TYPE.HOOKS;
  dslConfig.useTypescript = dslConfig.jsx === 'typescript'
  option.dslConfig = dslConfig;

  // 初始化全局参数
  initConfig(dslConfig);

  // 可选 className name  style
  // inlineStyle = inlineStyle !== 'className';


  const { inlineStyle } = dslConfig
  // clear schema
  initSchema(schema);

  // 记录所有blocks
  traverse(schema, (json) => {
    json.componentName = json.componentName || '';
    switch (json.componentName.toLowerCase()) {
      case 'block':
        blocks.push(json);
        break;
      case 'page':
        pages.push(json);
        break;
    }
  });

  // 样式名处理：指定命名风格
  traverse(schema, (json) => {
    if (json.props && json.props.className) {
      json.props.className = genStyleClass(
        json.props.className,
        dslConfig.cssStyle
      );
    }
  });

  // 提取全局样式，类名数组存于 json.classString , 剩余样式覆盖 style
  traverse(schema, (json) => {
    let className = json.props && json.props.className || '';
    let classString = '';
    let style = json.props.style;
    if(!className){
      return
    }

    let fileStyle = {};
    let codeStyles = {};

    Object.keys(json.props.style || {}).forEach(key => {
      if (isExpression(json.props.style[key])) {
        codeStyles[key] = json.props.style[key]
      } else {
        fileStyle[key] = json.props.style[key]
      }
    });
   
    // inline 
    if(inlineStyle === CSS_TYPE.INLINE_CSS){
      classString = `className="${className}"`;
      json.props.codeStyle = style;
    }else if(inlineStyle === CSS_TYPE.MODULE_STYLE){
      classString = ` style={${genStyleCode('styles', className)}}`;
      json.props.codeStyle = {};
    }else{
      let classnames: string[] = []
      let enableGlobalCss = dslConfig.globalCss && schema.css
   
      // 计算全局样式类名
      if (enableGlobalCss) {
        const cssResults = getGlobalClassNames(style, schema.css);
        if (cssResults.names.length > 0) {
          classnames = cssResults.names
        } 
        style = cssResults.style;
      } 
      
      if(inlineStyle == CSS_TYPE.MODULE_CLASS){
        // classnames.push(genStyleCode('styles', className));
     
        if(classnames.length){
          const nameStr =`${classnames.join(' ')} \$\{ ${ genStyleCode('styles', className) }\}`;
          classString = ` className={\`${nameStr.trim()}\`}`;
        }else{
          classString = ` className={${ genStyleCode('styles', className).trim()}}`;
        }

      }else{
        classnames.push(className);
        classString = ` className="${classnames.join(' ')}"`;
      }

      json.props.codeStyle = codeStyles;
      json.props.style = fileStyle;
    }
    

    json.classString = classString;
  });

  option.blocksCount = blocks.length;
  option.pagesCount = pages.length;

  // export module code
  let panelDisplay: IPanelDisplay[] = [];

  blocks.length > 0 &&
    blocks.forEach((block) => {
      const result = exportBlock(block, option);
      panelDisplay = panelDisplay.concat(result);
    });
  // export Page code
  if (schema.componentName === 'Page') {
    const result = exportBlock(schema, option);
    panelDisplay = panelDisplay.concat(result);
  }


  if(dslConfig.outputStyle == OUTPUT_TYPE.PROJECT){
    // 依赖 package.json
    const dependencies = {};
    for(let item of panelDisplay){
      if(item.panelImports && item.panelImports.length > 0){
        for( let pack of item.panelImports){
          dependencies[pack.package] = pack.version || '*'
        }
      }
    }

    // 项目文件
    panelDisplay = panelDisplay.concat(exportCreateApp(schema, {...option, dependencies}));
  }


    
  // 全局样式
  panelDisplay = panelDisplay.concat(exportGlobalCss(schema, option));


  return {
    panelDisplay,
    noTemplate: true,
  };
};



module.exports.CONFIG_FORM = [
  { name: 'componentStyle', title: '组件风格', type: 'radio', initValue: 'hooks', options: [{ label: 'Hooks', value: 'hooks' }, { label: 'Class Component', value: 'component' }] },
  { name: 'globalCss', title: '提取全局样式', help: '', type: 'switch', initValue: false, },
  { name: 'cssUnit', title: '单位', type: 'radio', initValue: 'px', options: ['px', 'rem', 'vw', 'rpx'] },
  { name: 'cssType', title: '类型', type: 'radio', initValue: 'css', options: [ 'css', 'scss', 'less'] },
  { name: 'inlineStyle', title: '样式引入方式', type: 'radio', initValue: 'module', options: [{ label: 'CSS Module', value: 'module' }, { label: 'Import', value: 'import' }, { label: 'Inline CSS', value: 'module_style' }, { label: 'Inline', value: 'inline' }] },
  { name: 'cssStyle', title: '样式名', type: 'radio', initValue: 'camelCase', options: [{ label: '驼峰式', value: 'camelCase' }, { label: '中划线', value: 'kebabCase' }, { label: '下划线', value: 'snakeCase' }] },
  { name: 'outputStyle', title: '导出格式', type: 'radio', initValue: 'component', options: [{ label: '仅组件', value: 'component' }, { label: '完整项目', value: 'project' }] },
  { name: 'jsx', title: '导出 jsx/tsx', type: 'radio', initValue: 'javascript', options: [{ label: 'javascript', value: 'javascript' }, { label: 'typescript', value: 'typescript' }] },
  { name: 'accessible', title: '无障碍', type: 'switch', initValue: true, },
]