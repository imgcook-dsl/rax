import { IImport } from './interface';
const find = require('lodash/find');
const unset = require('lodash/unset');
const camelCase = require('lodash/camelCase');
const kebabCase = require('lodash/kebabCase');
const snakeCase = require('lodash/snakeCase');
const cssParser = require('css/lib/parse');
import { DSL_CONFIG } from './consts'


// 从 css 解析样式规则饿
export const getCssRules = (text: string): {
  selectors: string,
  style: any
}[] => {
  if (!cssParser) {
    return [];
  }
  const globalCssResult = cssParser(text, { source: 'global.css' });

  let rules = globalCssResult.stylesheet.rules;
  rules = rules.filter((item) => item.type === 'rule');
  rules = rules.map((item) => {
    let style = {};
    for (let dec of item.declarations) {
      const property = camelCase(dec.property);
      style[property] = dec.value;
    }

    return {
      selectors: item.selectors[0],
      style: style,
    };
  });

  return rules;
};

//  提取全局样式
export const getGlobalClassNames = (cssObject, globalCssString) => {
  let names: string[] = [];
  if (!(globalCssString && cssParser)) {
    // 没有全局样式名
    return {
      names,
      style: cssObject,
    };
  }

  // 解析全局 css 规则
  const rules = getCssRules(globalCssString);

  for (let rule of rules) {
    // 按顺序提取样式
    // 仅提取 . 选择符
    const isMatch = find([cssObject], rule.style) && rule.selectors.startsWith('.');
    if (isMatch) {
      for (let key in rule.style) {
        unset(cssObject, key);
      }
      names.push(rule.selectors.replace('.', ''));
    }
  }

  return {
    names,
    style: cssObject,
  };
};

export const isExpression = (value) => {
  return /^\{\{.*\}\}$/.test(value);
};

// eg: hello_world => HelloWorld
export const line2Hump = (str) => {
  str = str.replace(/[_|-](\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
};

export const isEmptyObj = (o) => {
  if (o !== null && Object.prototype.toString.call(o) === '[object Object]') {
    return !Object.keys(o).length;
  }
  return false;
};

interface IComp {
  list?: {
    name: string; packageName: string; dependenceVersion: string; dependence: string, exportName: string;
    subName: string;
  }[]
};
export const transComponentsMap = (compsMap: IComp = {}) => {
  if (!compsMap || !Array.isArray(compsMap.list)) {
    return [];
  }
  const list = compsMap.list;
  return list.reduce((obj, comp) => {
    const componentName = comp.name;
    if (!obj[componentName]) {
      if (comp.dependence) {
        try {
          let dependence = typeof comp.dependence === 'string' ? JSON.parse(comp.dependence) : comp.dependence;
          if (dependence) {
            comp.packageName = dependence.package;
          }
          if (!comp.dependenceVersion) {
            comp.dependenceVersion = '*';
          }
          comp.exportName = dependence.export_name;
          comp.subName = dependence.sub_name;
          if (/^\d/.test(comp.dependenceVersion)) {
            comp.dependenceVersion = '^' + comp.dependenceVersion;
          }
        } catch (e) {
          console.log(e);
        }
      }

      obj[componentName] = comp;
    }
    return obj;
  }, {});
};


export const toString = (value) => {
  if ({}.toString.call(value) === '[object Function]') {
    return value.toString();
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, (key, value) => {
      if (typeof value === 'function') {
        return value.toString();
      } else {
        return value;
      }
    });
  }

  return String(value);
};

export const toUpperCaseStart = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};


// 计数器
let counter = {};
const getCounter = (key) => {
  counter[key] = (counter[key] || 0) + 1
  return counter[key];
}

export const resetCounter = (key) => {
  counter[key] = 0;
}

/**
 * 处理schema一些常见问题
 * @param schema 
 * 1. 清理 class 空格
 * 2. 关键节点命名兜底
 */
export const initSchema = (schema) => {
  //  重置计数器
  resetCounter('page');
  resetCounter('block');
  resetCounter('component');

  // 清理 class 空格
  traverse(schema, (node) => {
    if (node && node.props && node.props.className) {
      node.props.className = String(node.props.className).trim();
    }
  });

  // 关键节点命名兜底
  traverse(schema, (json) => {
    json.componentName = json.componentName || ''
    switch (json.componentName.toLowerCase()) {
      case 'page':
        json.fileName = line2Hump(json.fileName || `page_${getCounter('page')}`);
        break;
      case 'block':
        json.fileName = line2Hump(json.fileName || `block_${getCounter('block')}`);
        break;
      case 'component':
        json.fileName = line2Hump(json.fileName || `component_${getCounter('component')}`);
        break;
      default:
        break;
    }
  });
};

// 遍历节点
export const traverse = (json, callback) => {
  if (Array.isArray(json)) {
    json.forEach((node) => {
      traverse(node, callback)
    });
    return
  }

  // 去除 class 空格
  if (json && callback) {
    callback(json)
  }

  if (
    json.children &&
    json.children.length > 0 &&
    Array.isArray(json.children)
  ) {
    json.children.forEach((child) => {
      traverse(child, callback);
    });
  }
};

export const genStyleClass = (string, type) => {
  let classArray = string.split(' ');
  classArray = classArray.filter(name => !!name);
  classArray = classArray.map(name => {
    switch (type) {
      case 'camelCase': return camelCase(name);
      case 'kebabCase': return kebabCase(name);
      case 'snakeCase': return snakeCase(name);
      default:
        return camelCase(name);
    }
  });
  return classArray.join(' ')
}

export const genStyleCode = (styles, key='') => {
  return !/-/.test(key) && key.trim()
    ? `${styles}.${key}`
    : `${styles}['${key}']`;
};

export const parseNumberValue = (value) => {
  const { cssUnit = 'px', scale, responseWidth } = DSL_CONFIG
  value = String(value).replace(/\b[\d\.]+(px|rem|rpx|vw)?\b/, (v) => {
    const nv = parseFloat(v);
    if (!isNaN(nv) && nv !== 0) {
      return toString(nv);
    } else {
      return 0;
    }
  });
  if (/^\-?[\d\.]+$/.test(value)) {
    value = parseFloat(value);
    if (cssUnit == 'rpx') {
      value = 750 * value / Number(responseWidth);
      value = value == 0 ? value : value + 'rpx';
    } else if (cssUnit == 'rem') {
      const htmlFontSize = DSL_CONFIG.htmlFontSize || 16;
      value = parseFloat((value / htmlFontSize).toFixed(2));
      value = value ? `${value}rem` : value;
    } else if (cssUnit == 'vw') {
      const _w = 750 / scale
      value = (100 * parseInt(value) / _w).toFixed(2);
      value = value == 0 ? value : value + 'vw';
    } else {
      value += cssUnit;
    }
  }
  return value;
};

// convert to responsive unit, such as vw
export const parseStyle = (style) => {
  const { scale, cssUnit } = DSL_CONFIG
  const resultStyle = {}
  for (let key in style) {
    switch (key) {
      case 'fontSize':
      case 'marginTop':
      case 'marginBottom':
      case 'paddingTop':
      case 'paddingBottom':
      case 'height':
      case 'top':
      case 'bottom':
      case 'width':
      case 'maxWidth':
      case 'left':
      case 'right':
      case 'paddingRight':
      case 'paddingLeft':
      case 'marginLeft':
      case 'marginRight':
      case 'lineHeight':
      case 'borderBottomRightRadius':
      case 'borderBottomLeftRadius':
      case 'borderTopRightRadius':
      case 'borderTopLeftRadius':
      case 'borderRadius':
        resultStyle[key] = parseInt(style[key]) * scale;
        if (style[key]) {
          resultStyle[key] = parseNumberValue(style[key]);
        }
        break;
      default:
        if (style[key] && String(style[key]).includes('px')) {
          resultStyle[key] = String(style[key]).replace(/[\d\.]+px/g, (v) => {
            return /^[\d\.]+px$/.test(v) ? parseNumberValue(v) : v;
          })
        }
        resultStyle[key] = resultStyle[key] || style[key]
    }
  }

  return resultStyle;
};

// parse function, return params and content
export const parseFunction = (func) => {
  const funcString = func.toString();
  const params = funcString.match(/\([^\(\)]*\)/)[0].slice(1, -1);
  const content = funcString.slice(
    funcString.indexOf('{') + 1,
    funcString.lastIndexOf('}')
  );
  return {
    params,
    content,
  };
};

export const toJsString = (str)=>{
  return typeof str === 'string' && str.includes("'") ? `\`${str}\`` : `'${str}'`
}

// parse layer props(static values or expression)
export const parseProps = (value, isReactNode = false) => {
  if (typeof value === 'string') {
    if (isExpression(value)) {
      if (isReactNode) {
        return value.slice(1, -1);
      } else {
        return value.slice(2, -2);
      }
    }

    if (isReactNode) {
      return value;
    } else {
      return `${toJsString(value)}`;
    }
  } else if (typeof value === 'function') {
    const { params, content } = parseFunction(value);
    return `(${params}) => {${content}}`;
  } else if (typeof value === 'object' && value) {
    if (Array.isArray(value)) {
      return `[${value.map(v => parseProps(v)).join(', ')}]`
    }
    return `{${Object.keys(value).map(key => {
      return `${/^\w+$/.test(key) ? key :  `'${key}'`}: ${parseProps(value[key])}`
    }).join(', ')}}`
    // return `${JSON.stringify(value)}`;
  } else {
    return value;
  }
};

// parse condition: whether render the layer
export const parseCondition = (condition, render) => {
  if (typeof condition === 'boolean') {
    return `${condition} && ${render}`;
  } else if (typeof condition === 'string') {
    condition = condition.replace(/this\./, '');
    return `${condition.slice(2, -2)} && ${render}`;
  }
};

// flexDirection -> flex-direction
export const parseCamelToLine = (string) => {
  return string
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase();
};

// style obj -> css
export const generateCSS = (style, prefix) => {
  let css = '';

  for (let layer in style) {
    css += `${prefix && prefix !== layer ? '.' + prefix + ' ' : ''}.${layer} {`;
    css += generateCssString(style[layer])
    css += '}'
  }

  return css;
};

/**
 * （1）定位属性：position  display  float  left  top  right  bottom   overflow  clear   z-index
（2）自身属性：width  height  padding  border  margin   background
（3）文字样式：font-family   font-size   font-style   font-weight   font-varient   color   
（4）文本属性：text-align   vertical-align   text-wrap   text-transform   text-indent    text-decoration   letter-spacing    word-spacing    white-space   text-overflow
（5）css3中新增属性：content   box-shadow   border-radius  transform……
 */
const orderMap = [
  "position", "display", "float", "left", "top", "right", "bottom", 
  "flex-direction", "justify-content", "align-items", "align-self", "overflow", "clear", "z-index",
  "width", "height", "max-width", "max-height", "padding", "padding-bottom", "padding-left", "padding-right", "padding-left", "border", "margin", "margin-top", "margin-bottom", "margin-left", "margin-right", "background", 
  "background-color", "background-image", "background-size",
  "font-family", "font-size", "font-style", "font-weight", "font-varient", "line-height", "color", "text-align", "vertical-align", "text-wrap", "text-transform", "text-indent", "text-decoration",
  "letter-spacing", "word-spacing", "white-space", "text-overflow",
  "content", "box-shadow", "border-radius", "transform"
]
// genrate css object string
export const generateCssString = (style) => {
  let css = '';
  let array: any[] = [];

  // 缩写margin
  const margin = Object.keys(style).filter(item=>item.startsWith("margin"));
  if(!style['margin'] &&margin.length >2){
    style["margin"] = `${style["marginTop"] || 0} ${style["marginRight"] || 0} ${style["marginBottom"] || 0} ${style["marginLeft"] || 0}`
    delete style["marginTop"];
    delete style["marginLeft"];
    delete style["marginBottom"];
    delete style["marginRight"];
  }

    // 缩写 padding
  const padding = Object.keys(style).filter(item=>item.startsWith("padding"));
  if(!style['padding'] && padding.length >2){
    style["padding"] = `${style["paddingTop"] || 0} ${style["paddingRight"] || 0} ${style["paddingBottom"] || 0} ${style["paddingLeft"] || 0}`
    delete style["paddingTop"];
    delete style["paddingLeft"];
    delete style["paddingBottom"];
    delete style["paddingRight"];
  }



  for (let key in style) {
    const cssKey = parseCamelToLine(key);
    const orderIndex = orderMap.indexOf(cssKey);
    
    array.push({
      key: cssKey,
      value: style[key],
      index: orderIndex == -1 ? 100 : orderIndex
    })
  }


  array.sort((a, b) => {
    return a.index - b.index
  })

  css = array.map(item => {
    return `${item.key}: ${item.value};`
  }).join('');

  return css
}

// 根据 schema 生成 scss 或者 less
export const generateScss = (schema) => {
  let scss = '';

  function walk(json) {
    if (json.props.className) {
      let className = json.props.className;
      scss += `.${className}{`;
      scss += `${generateCssString(parseStyle(json.props.style))};`;
    }

    if (json.children && json.children.length > 0) {
      json.children.forEach((child) => {
        if (!['block', 'component', 'page'].includes(child.componentName.toLowerCase())) {
          walk(child)
        }
      });
    }

    if (json.props.className) {
      scss += '}';
    }
  }

  walk(schema);

  return scss;
};


// parse loop render
export const parseLoop = (loop, loopArg, render, params = {}) => {
  let data;
  let loopArgItem = (loopArg && loopArg[0]) || 'item';
  let loopArgIndex = (loopArg && loopArg[1]) || 'index';

  if (Array.isArray(loop)) {
    data = toString(loop);
  } else if (isExpression(loop)) {
    data = loop.slice(2, -2);
  }

  // add loop key
  const tagEnd = render.match(/^<.+?\s/)[0].length;
  render = `${render.slice(0, tagEnd)} key={${loopArgIndex}}${render.slice(
    tagEnd
  )}`;

  // remove `this`
  const re = new RegExp(`this.${loopArgItem}`, 'g');
  render = render.replace(re, loopArgItem);
  let stateValue = data;
  if (data.match(/this\.state\./)) {
    stateValue = `state.${data.split('.').pop()}`;
  }

  const formatRender = params['formatRender'] || function (str) { return str };
  return {
    hookState: [],
    value: `${stateValue}.map((${loopArgItem}, ${loopArgIndex}) => {
      return (${formatRender(render)});
    })`,
  };
};

// parse state
export const parseState = (states, assignProps = false) => {
  let stateName = 'state';
  let stateStr = toString(JSON.parse(states)) || null;
  if(assignProps){
    stateStr = `Object.assign(${stateStr}, props.data)`
  }
  // hooks state
  return `const [${stateName}, set${toUpperCaseStart(
    stateName
  )}] = useState(${stateStr});`;
};

// replace state
export const replaceState = (render) => {
  // remove `this`
  let stateName = 'state';
  const re = new RegExp(`this.state`, 'g');
  return render.replace(re, stateName);
};

// replace state
export const parseLifeCycles = (schema, init) => {
  let lifeCycles: string[] = [];
  if (!schema.lifeCycles['_constructor'] && init) {
    schema.lifeCycles['_constructor'] = `function _constructor() {}`;
  }

  Object.keys(schema.lifeCycles).forEach((name) => {
    let { params, content } = parseFunction(schema.lifeCycles[name]);
    content = replaceState(content);
    switch (name) {
      case '_constructor': {
        init.push(content);
        lifeCycles.unshift(`
          // constructor
          useState(()=>{
            ${init.join('\n')}
          })
        `);
        break;
      }
      case 'componentDidMount': {
        lifeCycles.push(`
          // componentDidMount
          useEffect(()=>{
            ${content}
          }, [])
        `);
        break;
      }
      case 'componentDidUpdate': {
        lifeCycles.push(`
          // componentDidUpdate
          useEffect(()=>{
            ${content}
          })
        `);
        break;
      }
      case 'componentWillUnMount': {
        lifeCycles.push(`
          // componentWillUnMount
          useEffect(()=>{
            return ()=>{
              ${content}
            }
          }, [])
        `);
        break;
      }
    }
  });
  return lifeCycles;
};

export const existImport = (imports, singleImport) => {
  let exist = false;
  imports.forEach((item) => {
    if (item._import === singleImport) {
      exist = true;
    }
  });
  return exist;
};

// parse async dataSource
export const parseDataSource = (data) => {
  const name = data.id;
  const { uri, method, params } = data.options;
  const action = data.type;
  let payload = {};

  Object.keys(data.options).forEach((key) => {
    if (['uri', 'method', 'params'].indexOf(key) === -1) {
      payload[key] = toString(data.options[key]);
    }
  });

  let comma = isEmptyObj(payload) ? '' : ',';
  // params parse should in string template
  if (params) {
    if (method !== 'GET') {
      payload = `${toString(payload).slice(0, -1)} ${comma} body: ${isExpression(params) ? parseProps(params) : toString(params)
        }}`;
    } else {
      payload = `${toString(payload).slice(0, -1)}}`;
    }
  } else {
    payload = toString(payload);
  }


  let result = `{
  return ${action}(${parseProps(uri)}, ${toString(payload)})
    .then((response) => response.json())
`;

  if (data.dataHandler) {
    const { params, content } = parseFunction(data.dataHandler);
    result += `.then((${params}) => {${content}})
    .catch((e) => {
      console.log('error', e);
    })
  `;
  }

  result += '}';

  return {
    value: `${name}() ${result}`,
    functionName: name,
    functionBody: result
  };
};

// get children text
export const getText = (schema) => {
  let text = '';
  let hasExpress = false;
  const getChildrenText = (schema) => {
    const type = schema.componentName.toLowerCase();
    if (type === 'text') {
      const textValue = schema.props.text || schema.text;
      if(isExpression(textValue)){
        hasExpress = true
      }
      text += parseProps(textValue, false);
    }

    schema.children &&
      Array.isArray(schema.children) &&
      schema.children.map((item) => {
        if(item && !item.loop && !item.loopArgs){
          getChildrenText(item);
        }
      });
  };

  getChildrenText(schema);

  if(text){
    return hasExpress ? '`${' +text +'}`': text;
  }

  return '``'
};


export const transAnimation = function (animation) {
  let keyFrames = ``;
  for (let i of animation.keyframes) {
    keyFrames += `${((i.offset * 10000) / 100.0).toFixed(0) + '%'} {
  ${i.opacity ? 'opacity: '.concat(i.opacity) + ';' : ''}
  ${i.transform ? 'transform: '.concat(i.transform) + ';' : ''}
}
`;
  }
  let keyframes = `
@keyframes ${animation.name} {
${keyFrames}
}
`;
  return keyframes;
};

export const addAnimation = function (schema) {
  let animationRes = ``;
  traverse(schema, (json) => {
    if (json.animation) {
      animationRes += transAnimation(json.animation);
    }
  })
  return animationRes;
};

// 生成依赖map
export const genDepComponentsMap = (dependencies, componentsMap) => {
  dependencies.forEach(dep => {
    if (dep.alias && !componentsMap[dep.alias]) {
      componentsMap[dep.alias] = {
        name: dep.alias,
        exportName: dep.alias,
        packageName: dep.packageRax1,
        dependenceVersion: dep.versionRax1,
        dependence: {
          package: dep.packageRax1,
          export_name: dep.alias
        }
      }
    }
  })
}

/**
 * constrcut the import string
 */
 export const importString = (importsMap) => {
  const importStrings: string[] = [];
  const subImports: string[] = [];
  for (const [packageName, pkgSet] of importsMap) {
    const set1 = new Set(), set2 = new Set();
    for (const pkg of pkgSet) {
      let exportName = pkg.exportName;
      let subName = pkg.subName;
      let componentName = pkg.name;

      if (pkg.subName) {
        subImports.push(`const ${componentName} = ${exportName}.${subName};`);
      }
      if (!exportName) {
        exportName = componentName
      }
      if (componentName !== exportName && !pkg.subName) {
        exportName = `${exportName} as ${componentName}`;
      }
      if (pkg.dependence && pkg.dependence.destructuring) {
        set2.add(exportName);
      } else {
        set1.add(exportName);
      }
    }
    const set1Str = [...set1].join(',');
    let set2Str = [...set2].join(',');
    const dot = set1Str && set2Str ? ',' : '';
    if (set2Str) {
      set2Str = `{${set2Str}}`;
    }
    importStrings.push(`import ${set1Str} ${dot} ${set2Str} from '${packageName}'`);
  }
  return importStrings.concat(subImports);
}