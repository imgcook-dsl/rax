const {
  toString,
  parseLoop,
  parseStyle,
  parseFunction,
  parseProps,
  parseCondition,
  generateCSS,
  parseDataSource,
  line2Hump
} = require('./utils');

function exportMod(schema, option) {
  const { prettier } = option;

  const fileName = schema.fileName;

  // imports
  let imports = [];

  // imports mods
  let importMods = [];

  // inline style
  const style = {};

  // Global Public Functions
  const utils = [];

  // states
  let statesData = null;

  // useState
  let useState = [];

  // methods
  const methods = [];

  // init
  const init = [];

  // generate render xml
  const generateRender = schema => {
    const type = schema.componentName.toLowerCase();
    const className = schema.props && schema.props.className;
    const classString = className ? ` style={styles.${className}}` : '';

    if (className) {
      style[className] = parseStyle(schema.props.style);
    }

    let xml;
    let props = '';

    Object.keys(schema.props).forEach(key => {
      if (['className', 'style', 'text', 'src', 'key'].indexOf(key) === -1) {
        props += ` ${key}={${parseProps(schema.props[key])}}`;
      }
    });

    switch (type) {
      case 'text':
        if (imports.indexOf(`import Text from 'rax-text'`) === -1) {
          imports.push(`import Text from 'rax-text'`);
        }
        const innerText = parseProps(schema.props.text, true);
        xml = `<Text${classString}${props}>${innerText}</Text>`;
        break;
      case 'image':
        if (imports.indexOf(`import Image from 'rax-image'`) === -1) {
          imports.push(`import Image from 'rax-image'`);
        }
        const source = parseProps(schema.props.src);
        xml = `<Image${classString}${props} source={{uri: ${source}}} />`;
        break;
      case 'div':
      case 'page':
      case 'block':
      case 'component':
        if (imports.indexOf(`import View from 'rax-view'`) === -1) {
          imports.push(`import View from 'rax-view'`);
        }
        if (schema.children && schema.children.length) {
          xml = `<View${classString}${props}>${transform(
            schema.children
          )}</View>`;
        } else {
          xml = `<View${classString}${props} />`;
        }
        break;
      default:
        const singleImport = `import ${componentName} from '${componentName}'`;
        if (imports.indexOf(singleImport) === -1) {
          imports.push(singleImport);
        }
        if (
          schema.children &&
          schema.children.length &&
          Array.isArray(schema.children)
        ) {
          xml = `<${componentName}${classString}${props}>${transform(
            schema.children
          )}</${componentName}>`;
        } else if (typeof schema.children === 'string') {
          xml = `<${componentName}${classString}${props} >${schema.children}</${componentName}>`;
        } else {
          xml = `<${componentName}${classString}${props} />`;
        }
    }

    if (schema.loop) {
      const parseLoopData = parseLoop(
        schema.loop,
        schema.loopArgs,
        xml,
        statesData
      );
      xml = parseLoopData.value;
      useState = useState.concat(parseLoopData.hookState);
    }
    if (schema.condition) {
      xml = parseCondition(schema.condition, xml);
    }
    if (schema.loop || schema.condition) {
      xml = `{${xml}}`;
    }
    return xml;
  };

  // parse schema
  const transform = schema => {
    let result = '';
    const blockName = schema.fileName || schema.id;
    if (Array.isArray(schema)) {
      schema.forEach(layer => {
        result += transform(layer);
      });
    } else {
      const type = schema.componentName.toLowerCase();

      if (['page'].indexOf(type) !== -1 || blockName === fileName) {
        // 容器组件处理: state/method/dataSource/lifeCycle
        const states = [];
        const lifeCycles = [];

        if (schema.state) {
          states.push(`state = ${toString(schema.state)}`);
          statesData = toString(schema.state);
        }

        if (schema.methods) {
          Object.keys(schema.methods).forEach(name => {
            const { params, content } = parseFunction(schema.methods[name]);
            methods.push(`function ${name}(${params}) {${content}}`);
          });
        }

        if (schema.dataSource && Array.isArray(schema.dataSource.list)) {
          schema.dataSource.list.forEach(item => {
            if (typeof item.isInit === 'boolean' && item.isInit) {
              init.push(`${item.id}();`);
            } else if (typeof item.isInit === 'string') {
              init.push(`if (${parseProps(item.isInit)}) { ${item.id}(); }`);
            }
            const parseDataSourceData = parseDataSource(item, imports);
            methods.push(parseDataSourceData.value);
            imports = parseDataSourceData.imports;
          });

          if (schema.dataSource.dataHandler) {
            const { params, content } = parseFunction(
              schema.dataSource.dataHandler
            );
            methods.push(`dataHandler(${params}) {${content}}`);
            init.push(`dataHandler()`);
          }
        }

        if (schema.lifeCycles) {
          if (!schema.lifeCycles['_constructor']) {
            lifeCycles.push(
              `constructor(props, context) { super(); ${init.join('\n')}}`
            );
          }

          Object.keys(schema.lifeCycles).forEach(name => {
            const { params, content } = parseFunction(schema.lifeCycles[name]);

            if (name === '_constructor') {
              init.push(content);
            } else {
              lifeCycles.push(`${name}(${params}) {${content}}`);
            }
          });
        }
      } else if (['block'].indexOf(type) !== -1) {
        result += `<${line2Hump(blockName)} />`;
        importMods.push(
          `import ${line2Hump(blockName)} from '../${blockName}';`
        );
      } else {
        result += generateRender(schema);
      }
    }

    return result;
  };

  // option.utils
  if (option.utils) {
    Object.keys(option.utils).forEach(name => {
      utils.push(`const ${name} = ${option.utils[name]}`);
    });
  }

  // start parse schema
  transform(schema);

  // output
  const prettierJsOpt = {
    parser: 'babel',
    printWidth: 120,
    singleQuote: true
  };
  const prettierCssOpt = {
    parser: 'css'
  };
  const hooksView = generateRender(schema);
  const hasDispatch = hooksView.match('dispatch');
  const indexValue = prettier.format(
    `
    'use strict';
    import { createElement, useState, useEffect, useRef, memo } from 'rax';
    ${imports.join('\n')}
    ${importMods.join('\n')}
    ${hasDispatch ? "import { IndexContext } from '../../context';" : ''}

    import styles from './${fileName}.css';

    ${utils.join('\n')}
    export default memo((props) => {
      ${useState.join('\n')}
      const hasCalled = useRef(false);
      ${
        hasDispatch
          ? 'const { state: { txt }, dispatch} = useContext(IndexContext);'
          : ''
      }
      useEffect(() => {
        if (!hasCalled.current) {
          hasCalled.current = true;
          ${init.join('\n')}
        }
      })
      ${methods.join('\n')}
      return (${hooksView})
    });
  `,
    prettierJsOpt
  );

  return [
    {
      panelName: `${fileName}.jsx`,
      panelValue: indexValue,
      panelType: 'js',
      panelImports: imports
    },
    {
      panelName: `${fileName}.css`,
      panelValue: prettier.format(`${generateCSS(style)}`, prettierCssOpt),
      panelType: 'css'
    }
  ];
}

function exportPage(schema, option) {
  const { prettier } = option;

  const fileName = schema.fileName || schema.id;

  // imports
  let imports = [];

  // import mods
  let importMods = [];

  // inline style
  const style = {};

  // Global Public Functions
  const utils = [];

  // states
  let statesData = null;

  // useState
  let useState = [];

  // methods
  const methods = [];

  // init
  const init = [];

  // generate render xml
  const generateRender = schema => {
    const componentName = schema.componentName;
    const type = schema.componentName.toLowerCase();
    const className = schema.props && schema.props.className;
    const classString = className ? ` style={styles.${className}}` : '';

    if (className) {
      style[className] = parseStyle(schema.props.style);
    }

    let xml;
    let props = '';

    Object.keys(schema.props).forEach(key => {
      if (['className', 'style', 'text', 'src', 'key'].indexOf(key) === -1) {
        props += ` ${key}={${parseProps(schema.props[key])}}`;
      }
    });

    switch (type) {
      case 'text':
        if (imports.indexOf(`import Text from 'rax-text'`) === -1) {
          imports.push(`import Text from 'rax-text'`);
        }
        const innerText = parseProps(schema.props.text, true);
        xml = `<Text${classString}${props}>${innerText}</Text>`;
        break;
      case 'image':
        if (imports.indexOf(`import Image from 'rax-image'`) === -1) {
          imports.push(`import Image from 'rax-image'`);
        }
        const source = parseProps(schema.props.src);
        xml = `<Image${classString}${props} source={{uri: ${source}}} />`;
        break;
      case 'div':
      case 'page':
      case 'block':
      case 'component':
        if (imports.indexOf(`import View from 'rax-view'`) === -1) {
          imports.push(`import View from 'rax-view'`);
        }
        if (schema.children && schema.children.length) {
          xml = `<View${classString}${props}>${transform(
            schema.children
          )}</View>`;
        } else {
          xml = `<View${classString}${props} />`;
        }
        break;
      default:
        const singleImport = `import ${componentName} from '${componentName}'`;
        if (imports.indexOf(singleImport) === -1) {
          imports.push(singleImport);
        }
        if (
          schema.children &&
          schema.children.length &&
          Array.isArray(schema.children)
        ) {
          xml = `<${componentName}${classString}${props}>${transform(
            schema.children
          )}</${componentName}>`;
        } else if (typeof schema.children === 'string') {
          xml = `<${componentName}${classString}${props} >${schema.children}</${componentName}>`;
        } else {
          xml = `<${componentName}${classString}${props} />`;
        }
    }

    if (schema.loop) {
      const parseLoopData = parseLoop(
        schema.loop,
        schema.loopArgs,
        xml,
        statesData
      );
      xml = parseLoopData.value;
      useState = useState.concat(parseLoopData.hookState);
    }
    if (schema.condition) {
      xml = parseCondition(schema.condition, xml);
    }
    if (schema.loop || schema.condition) {
      xml = `{${xml}}`;
    }
    return xml;
  };

  // parse schema
  const transform = schema => {
    let result = '';

    if (Array.isArray(schema)) {
      schema.forEach(layer => {
        result += transform(layer);
      });
    } else {
      const type = schema.componentName.toLowerCase();

      if (['page'].indexOf(type) !== -1) {
        // 容器组件处理: state/method/dataSource/lifeCycle
        const states = [];
        const lifeCycles = [];
        if (schema.state) {
          states.push(`state = ${toString(schema.state)}`);
          statesData = toString(schema.state);
        }

        if (schema.methods) {
          Object.keys(schema.methods).forEach(name => {
            const { params, content } = parseFunction(schema.methods[name]);
            methods.push(`function ${name}(${params}) {${content}}`);
          });
        }

        if (schema.dataSource && Array.isArray(schema.dataSource.list)) {
          schema.dataSource.list.forEach(item => {
            if (typeof item.isInit === 'boolean' && item.isInit) {
              init.push(`${item.id}();`);
            } else if (typeof item.isInit === 'string') {
              init.push(`if (${parseProps(item.isInit)}) { ${item.id}(); }`);
            }
            const parseDataSourceData = parseDataSource(item, imports);
            methods.push(parseDataSourceData.value);
            imports = parseDataSourceData.imports;
          });

          if (schema.dataSource.dataHandler) {
            const { params, content } = parseFunction(
              schema.dataSource.dataHandler
            );
            methods.push(`dataHandler(${params}) {${content}}`);
            init.push(`dataHandler()`);
          }
        }

        if (schema.lifeCycles) {
          if (!schema.lifeCycles['_constructor']) {
            lifeCycles.push(
              `constructor(props, context) { super(); ${init.join('\n')}}`
            );
          }

          Object.keys(schema.lifeCycles).forEach(name => {
            const { params, content } = parseFunction(schema.lifeCycles[name]);

            if (name === '_constructor') {
              init.push(content);
            } else {
              lifeCycles.push(`${name}(${params}) {${content}}`);
            }
          });
        }
      } else if (['block'].indexOf(type) !== -1) {
        const blockName = schema.fileName || schema.id;
        result += `<${line2Hump(blockName)} />`;
        importMods.push(
          `import ${line2Hump(blockName)} from './${blockName}';`
        );
      } else {
        result += generateRender(schema);
      }
    }

    return result;
  };

  // option.utils
  if (option.utils) {
    Object.keys(option.utils).forEach(name => {
      utils.push(`const ${name} = ${option.utils[name]}`);
    });
  }

  // start parse schema
  transform(schema);

  // output
  const prettierJsOpt = {
    parser: 'babel',
    printWidth: 120,
    singleQuote: true
  };
  const prettierCssOpt = {
    parser: 'css'
  };
  const hooksView = generateRender(schema);

  const contextValue = prettier.format(
    `import { createElement, createContext, useReducer } from 'rax';

    const initState = {
      txt: 'click me' // Get data, trigger proactively useEffect
    };
    
    function UserReducer(state, action) {
      switch (action.type) {
        case 'changeTxt':
          return {
            ...state,
            txt: \`click me \${action.payload.val}\`
          };
        default:
          return state;
      }
    }
    
    const IndexContext = createContext();
    
    const IndexProvider = props => {
      const [state, dispatch] = useReducer(UserReducer, initState);
      return (
        <IndexContext.Provider value={{ state, dispatch }}>
          {props.children}
        </IndexContext.Provider>
      );
    };
    
    export { IndexContext, IndexProvider };
  `,
    prettierJsOpt
  );

  const hasDispatch = hooksView.match('dispatch');
  const indexValue = prettier.format(
    `
    'use strict';
    import { createElement, useState, useEffect, useRef } from 'rax';
    ${imports.join('\n')}
    ${importMods.join('\n')}
    import { ${
      hasDispatch ? 'IndexContext, IndexProvider' : 'IndexProvider'
    } } from './context';
    import styles from './${fileName}.css';

    ${utils.join('\n')}
    export default function Page() {
      ${useState.join('\n')}
      const hasCalled = useRef(false);
      ${
        hasDispatch
          ? 'const { state: { txt }, dispatch} = useContext(IndexContext);'
          : ''
      }
      useEffect(() => {
        if (!hasCalled.current) {
          hasCalled.current = true;
          ${init.join('\n')}
        }
      })
      ${methods.join('\n')}
      return (<IndexProvider>${hooksView}</IndexProvider>)
    };
  `,
    prettierJsOpt
  );

  return [
    {
      panelName: `${fileName}.jsx`,
      panelValue: indexValue,
      panelType: 'js',
      panelImports: imports.concat(importMods)
    },
    {
      panelName: `context.jsx`,
      panelValue: contextValue,
      panelType: 'js',
      panelImports: []
    },
    {
      panelName: `${fileName}.css`,
      panelValue: prettier.format(`${generateCSS(style)}`, prettierCssOpt),
      panelType: 'css'
    }
  ];
}

module.exports = {
  exportMod,
  exportPage
};
