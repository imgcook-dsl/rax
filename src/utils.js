const isExpression = (value) => {
  return /^\{\{.*\}\}$/.test(value);
}

// eg: hello_world => HelloWorld
const line2Hump = (str) => {
  str = str.replace(/[_|-](\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
  str = str.charAt(0).toUpperCase() + str.slice(1);
  return str;
}

const isEmptyObj = o => {
  if (o !== null && Object.prototype.toString.call(o) === '[object Object]') {
    return !Object.keys(o).length;
  }
  return false;
};

const getValueByPath = (o, s, def) => {
  if (!o) o = {};
  if (!s) s = '';
  if (!def) def = '';
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return def;
    }
  }
  return o;
}

const toString = (value) => {
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
    })
  }

  return String(value);
};

const toUpperCaseStart = (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

// convert to responsive unit, such as vw
const parseStyle = (style, scale) => {
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
        style[key] = parseInt(style[key]) * scale + 'rpx';
        break;
    }
  }

  return style;
}

// parse function, return params and content
const parseFunction = (func) => {
  const funcString = func.toString();
  const params = funcString.match(/\([^\(\)]*\)/)[0].slice(1, -1);
  const content = funcString.slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'));
  return {
    params,
    content
  };
}

// parse layer props(static values or expression)
const parseProps = (value, isReactNode) => {
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
      return `'${value}'`;
    }
  } else if (typeof value === 'function') {
    const {params, content} = parseFunction(value);
    return `(${params}) => {${content}}`;
  } else if (typeof value === 'object') {
    return `${JSON.stringify(value)}`;
  } else {
    return value;
  }
}

// parse condition: whether render the layer
const parseCondition = (condition, render) => {
  if (typeof condition === 'boolean') {
    return `${condition} && ${render}`
  } else if (typeof condition === 'string') {
    condition = condition.replace(/this\./, '');
    return `${condition.slice(2, -2)} && ${render}`
  }
}

// flexDirection -> flex-direction
const parseCamelToLine = string => {
  return string
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase();
};

// style obj -> css
const generateCSS = style => {
  let css = '';

  for (let layer in style) {
    css += `.${layer} {`;
    for (let key in style[layer]) {
      css += `${parseCamelToLine(key)}: ${style[layer][key]};\n`;
    }
    css += '}';
  }

  return css;
};

// parse loop render
const parseLoop = (loop, loopArg, render, states) => {
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
  render = `${render.slice(0, tagEnd)} key={${loopArgIndex}}${render.slice(tagEnd)}`;

  // remove `this`
  const re = new RegExp(`this.${loopArgItem}`, 'g');
  render = render.replace(re, loopArgItem);
  let stateValue = data;
  if (data.match(/this\.state\./)) {
    stateValue = `state.${data.split('.').pop()}`;
  }

  return {
    hookState: [],
    value: `${stateValue}.map((${loopArgItem}, ${loopArgIndex}) => {
      return (${render});
    })`
  };
};

// parse state
const parseState = (states) => {
  let stateName = 'state';
  // hooks state
  return `const [${stateName}, set${toUpperCaseStart(
    stateName
  )}] = useState(${toString(JSON.parse(states)) || null});`;
};

// replace state
const replaceState = (render) => {
  // remove `this`
  let stateName = 'state';
  const re = new RegExp(`this.state`, 'g');
  return render.replace(re, stateName);
};

// replace state
const parseLifeCycles = (schema, init) => {
  let lifeCycles = [];
  if (!schema.lifeCycles['_constructor'] && init) {
    schema.lifeCycles['_constructor'] = `function _constructor() {}`
  }

  Object.keys(schema.lifeCycles).forEach(name => {
    let { params, content } = parseFunction(schema.lifeCycles[name]);
    content = replaceState(content);
    switch(name){
      case '_constructor':{
        init.push(content);
        lifeCycles.unshift(`
          // constructor
          useState(()=>{
            ${init.join('\n')}
          })
        `)
        break;
      }
      case 'componentDidMount':{
        lifeCycles.push(`
          // componentDidMount
          useEffect(()=>{
            ${content}
          }, [])
        `)
        break;
      }
      case 'componentDidUpdate':{
        lifeCycles.push(`
          // componentDidUpdate
          useEffect(()=>{
            ${content}
          })
        `)
        break;
      }
      case 'componentWillUnMount':{
        lifeCycles.push(`
          // componentWillUnMount
          useEffect(()=>{
            return ()=>{
              ${content}
            }
          }, [])
        `)
        break;
      }
    }
  });
  return lifeCycles;
};


// parse async dataSource
const parseDataSource = (data, imports) => {
  const name = data.id;
  const { uri, method, params } = data.options;
  const action = data.type;
  let payload = {};

  switch (action) {
    case 'fetch':
      if (imports.indexOf(`import {fetch} from whatwg-fetch`) === -1) {
        imports.push(`import {fetch} from 'whatwg-fetch'`);
      }
      payload = {
        method: method
      };

      break;
    case 'jsonp':
      if (imports.indexOf(`import {fetchJsonp} from fetch-jsonp`) === -1) {
        imports.push(`import jsonp from 'fetch-jsonp'`);
      }
      break;
  }

  Object.keys(data.options).forEach(key => {
    if (['uri', 'method', 'params'].indexOf(key) === -1) {
      payload[key] = toString(data.options[key]);
    }
  });

  let comma = isEmptyObj(payload) ? '' : ',';
  // params parse should in string template
  if (params) {
    payload = `${toString(payload).slice(0, -1)} ${comma} body: ${
      isExpression(params) ? parseProps(params) : toString(params)
    }}`;
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
    value: `function ${name}() ${result}`,
    imports,
  };
};

module.exports = {
  isExpression,
  toString,
  getValueByPath,
  line2Hump,
  toUpperCaseStart,
  parseStyle,
  parseDataSource,
  parseFunction,
  parseLoop,
  parseCondition,
  parseProps,
  parseState,
  parseLifeCycles,
  replaceState,
  generateCSS
}