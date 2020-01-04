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
const parseStyle = (style) => {
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
        style[key] = parseInt(style[key]) + 'rpx';
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
  }
}

// parse condition: whether render the layer
const parseCondition = (condition, render) => {
  if (typeof condition === 'boolean') {
    return `${condition} && ${render}`
  } else if (typeof condition === 'string') {
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
  render = `${render.slice(0, tagEnd)} key={${loopArgIndex}}${render.slice(
    tagEnd
  )}`;

  // remove `this`
  const re = new RegExp(`this.${loopArgItem}`, 'g');
  render = render.replace(re, loopArgItem);
  let stateValue = data;
  if (data.match(/this\.state\./)) {
    stateValue = data.split('.').pop();
  }
  
  // hooks state
  const hookState = [];
  hookState.push(
    `const [${stateValue}, set${toUpperCaseStart(
      stateValue
    )}] = useState(${toString(JSON.parse(states)[stateValue]) || null});`
  );
  return {
    hookState,
    value: `${stateValue}.map((${loopArgItem}, ${loopArgIndex}) => {
      return (${render});
    })`
  };
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

  // params parse should in string template
  if (params) {
    payload = `${toString(payload).slice(0, -1)} ,body: ${
      isExpression(params) ? parseProps(params) : toString(params)
    }}`;
  } else {
    payload = toString(payload);
  }

  let result = `{
  ${action}(${parseProps(uri)}, ${toString(payload)})
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
  line2Hump,
  toUpperCaseStart,
  parseStyle,
  parseDataSource,
  parseFunction,
  parseLoop,
  parseCondition,
  parseProps,
  generateCSS
}