module.exports=function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){const n=e=>/^\{\{.*\}\}$/.test(e),o=e=>"[object Function]"==={}.toString.call(e)?e.toString():"string"==typeof e?e:"object"==typeof e?JSON.stringify(e,(e,t)=>"function"==typeof t?t.toString():t):String(e),r=e=>e.charAt(0).toUpperCase()+e.slice(1),s=e=>{const t=e.toString();return{params:t.match(/\([^\(\)]*\)/)[0].slice(1,-1),content:t.slice(t.indexOf("{")+1,t.lastIndexOf("}"))}},a=(e,t)=>{if("string"==typeof e)return n(e)?t?e.slice(1,-1):e.slice(2,-2):t?e:`'${e}'`;if("function"==typeof e){const{params:t,content:n}=s(e);return`(${t}) => {${n}}`}return"object"==typeof e?`${JSON.stringify(e)}`:void 0},c=e=>{const t=new RegExp("this.state","g");return e.replace(t,"state")};e.exports={isExpression:n,toString:o,line2Hump:e=>e=(e=e.replace(/[_|-](\w)/g,(e,t)=>t.toUpperCase())).charAt(0).toUpperCase()+e.slice(1),toUpperCaseStart:r,parseStyle:(e,t)=>{for(let n in e)switch(n){case"fontSize":case"marginTop":case"marginBottom":case"paddingTop":case"paddingBottom":case"height":case"top":case"bottom":case"width":case"maxWidth":case"left":case"right":case"paddingRight":case"paddingLeft":case"marginLeft":case"marginRight":case"lineHeight":case"borderBottomRightRadius":case"borderBottomLeftRadius":case"borderTopRightRadius":case"borderTopLeftRadius":case"borderRadius":e[n]=parseInt(e[n])*t+"rpx"}return e},parseDataSource:(e,t)=>{const r=e.id,{uri:c,method:i,params:p}=e.options,l=e.type;let u={};switch(l){case"fetch":-1===t.indexOf("import {fetch} from whatwg-fetch")&&t.push("import {fetch} from 'whatwg-fetch'"),u={method:i};break;case"jsonp":-1===t.indexOf("import {fetchJsonp} from fetch-jsonp")&&t.push("import jsonp from 'fetch-jsonp'")}Object.keys(e.options).forEach(t=>{-1===["uri","method","params"].indexOf(t)&&(u[t]=o(e.options[t]))});let m=null===(d=u)||"[object Object]"!==Object.prototype.toString.call(d)||Object.keys(d).length?",":"";var d;u=p?`${o(u).slice(0,-1)} ${m} body: ${n(p)?a(p):o(p)}}`:o(u);let f=`{\n  return ${l}(${a(c)}, ${o(u)})\n    .then((response) => response.json())\n`;if(e.dataHandler){const{params:t,content:n}=s(e.dataHandler);f+=`.then((${t}) => {${n}})\n    .catch((e) => {\n      console.log('error', e);\n    })\n  `}return f+="}",{value:`function ${r}() ${f}`,imports:t}},parseFunction:s,parseLoop:(e,t,s,a)=>{let c,i=t&&t[0]||"item",p=t&&t[1]||"index";Array.isArray(e)?c=o(e):n(e)&&(c=e.slice(2,-2));const l=s.match(/^<.+?\s/)[0].length;s=`${s.slice(0,l)} key={${p}}${s.slice(l)}`;const u=new RegExp(`this.${i}`,"g");s=s.replace(u,i);let m=c;c.match(/this\.state\./)&&(m=c.split(".").pop());const d=[];return a&&d.push(`const [${m}, set${r(m)}] = useState(${o(JSON.parse(a)[m])||null});`),{hookState:d,value:`${m}.map((${i}, ${p}) => {\n      return (${s});\n    })`}},parseCondition:(e,t)=>"boolean"==typeof e?`${e} && ${t}`:"string"==typeof e?`${(e=e.replace(/this\./,"")).slice(2,-2)} && ${t}`:void 0,parseProps:a,parseState:e=>`const [state, set${r("state")}] = useState(${o(JSON.parse(e))||null});`,parseLifeCycles:(e,t)=>{let n=[];return!e.lifeCycles._constructor&&t&&(e.lifeCycles._constructor="function _constructor() {}"),Object.keys(e.lifeCycles).forEach(o=>{let{params:r,content:a}=s(e.lifeCycles[o]);switch(a=c(a),o){case"_constructor":t.push(a),n.unshift(`\n          // constructor\n          useState(()=>{\n            ${t.join("\n")}\n          })\n        `);break;case"componentDidMount":n.push(`\n          // componentDidMount\n          useEffect(()=>{\n            ${a}\n          }, [])\n        `);break;case"componentDidUpdate":n.push(`\n          // componentDidUpdate\n          useEffect(()=>{\n            ${a}\n          })\n        `);break;case"componentWillUnMount":n.push(`\n          // componentWillUnMount\n          useEffect(()=>{\n            return ()=>{\n              ${a}\n            }\n          }, [])\n        `)}}),n},replaceState:c,generateCSS:e=>{let t="";for(let o in e){t+=`.${o} {`;for(let r in e[o])t+=`${n=r,n.split(/(?=[A-Z])/).join("-").toLowerCase()}: ${e[o][r]};\n`;t+="}"}var n;return t}}},function(e,t,n){const{exportMod:o,exportPage:r}=n(2),{line2Hump:s}=n(0);e.exports=function(e,t){const n=[],a=750/(t.responsive&&t.responsive.width||750);t.scale=a,function e(t){const{json:o,scale:r}=t;switch(o.componentName.toLowerCase()){case"block":o.fileName=o.fileName||o.id,o.smart&&o.smart.layerProtocol&&o.smart.layerProtocol.module&&o.smart.layerProtocol.module.type&&(o.fileName=o.smart.layerProtocol.module.type.replace(/[@|\/]/g,"")),o.fileName=s(o.fileName),n.push(o)}o.children&&o.children.length>0&&Array.isArray(o.children)&&o.children.forEach(t=>{e({json:t,scale:r})})}({json:e,scale:a});let c=[];n.length>0&&n.forEach(e=>{const n=o(e,t);c=c.concat(n)});const i=r(e,t);return c=c.concat(i),{panelDisplay:c,noTemplate:!0}}},function(e,t,n){const o=n(3),r=n(4);e.exports={exportMod:o,exportPage:r}},function(e,t,n){const{toString:o,parseLoop:r,parseStyle:s,parseFunction:a,parseProps:c,parseState:i,parseLifeCycles:p,replaceState:l,parseCondition:u,generateCSS:m,parseDataSource:d,line2Hump:f}=n(0);e.exports=function(e,t){const{prettier:n,scale:$}=t,h=e.fileName;let x=[],y=[];const g={},b=[];let S=null,j=[];const O=[];let w=[];const v=[],C=e=>{const t=e.componentName.toLowerCase(),n=e.props&&e.props.className,o=n?` style={styles.${n}}`:"";let a;n&&(g[n]=s(e.props.style,$));let i="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(i+=` ${t}={${c(e.props[t])}}`)}),t){case"text":-1===x.indexOf("import Text from 'rax-text'")&&x.push("import Text from 'rax-text'");let t=c(e.props.text||e.text,!0);t.match(/this\.props/)&&(t=t.replace(/this\./,"")),a=`<Text${o}${i}>${t||""}</Text>`;break;case"image":-1===x.indexOf("import Image from 'rax-image'")&&x.push("import Image from 'rax-image'");let n=c(e.props.src);n=n&&`source={{uri: ${n}}}`||"",a=`<Image${o}${i} ${n} />`;break;case"div":case"page":case"block":case"component":-1===x.indexOf("import View from 'rax-view'")&&x.push("import View from 'rax-view'"),a=e.children&&e.children.length?`<View${o}>${N(e.children)}</View>`:`<View${o} />`;break;default:const r=`import ${componentName} from '${componentName}'`;-1===x.indexOf(r)&&x.push(r),a=e.children&&e.children.length&&Array.isArray(e.children)?`<${componentName}${o}${i}>${N(e.children)}</${componentName}>`:"string"==typeof e.children?`<${componentName}${o}${i} >${e.children}</${componentName}>`:`<${componentName}${o}${i} />`}if(e.loop){const t=r(e.loop,e.loopArgs,a,S);a=t.value,j=j.concat(t.hookState)}return a=l(a),e.condition&&(a=u(e.condition,a)),(e.loop||e.condition)&&(a=`{${a}}`),a},N=e=>{let t="";const n=e.fileName||e.id;if(Array.isArray(e))e.forEach(e=>{t+=N(e)});else{const r=e.componentName.toLowerCase();if(-1!==["page"].indexOf(r)||n===h){const t=[];if(e.state&&(t.push(`state = ${o(e.state)}`),S=o(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:n,content:o}=a(e.methods[t]);O.push(`function ${t}(${n}) {${o}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?v.push(`${e.id}();`):"string"==typeof e.isInit&&v.push(`if (${c(e.isInit)}) { ${e.id}(); }`);const t=d(e,x);O.push(t.value),x=t.imports}),e.dataSource.dataHandler)){const{params:t,content:n}=a(e.dataSource.dataHandler);O.push(`const dataHandler = (${t}) => {${n}}`),v.push("dataHandler()")}e.lifeCycles&&(w=p(e,v)),S&&j.push(i(S))}else if(-1!==["block"].indexOf(r)){let o="";Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(o+=` ${t}={${c(e.props[t])}}`)}),t+=`<${f(n)} ${o} />`,y.push(`import ${f(n)} from '../${n}';`)}else t+=C(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{b.push(`const ${e} = ${t.utils[e]}`)}),N(e);const k=C(e),I=k.match("dispatch"),E=n.format(`\n    'use strict';\n    import { createElement, useState, useEffect, memo } from 'rax';\n    ${x.join("\n")}\n    ${y.join("\n")}\n    ${I?"import { IndexContext } from '../../context';":""}\n\n    import styles from './${h}.css';\n\n    ${b.join("\n")}\n    export default memo((props) => {\n      ${j.join("\n")}\n      ${I?"const { state: { txt }, dispatch} = useContext(IndexContext);":""}\n      ${w.join("\n")}\n      ${O.join("\n")}\n      ${k.match(/^\{true\ \&\& /)?`return (<View>${k}</View>)`:`return (${k})`}\n    });\n  `,{parser:"babel",printWidth:120,singleQuote:!0});return[{panelName:`${h}.jsx`,panelValue:E,panelType:"js",panelImports:x},{panelName:`${h}.css`,panelValue:n.format(`${m(g)}`,{parser:"css"}),panelType:"css"}]}},function(e,t,n){const{toString:o,parseLoop:r,parseStyle:s,parseFunction:a,parseProps:c,parseState:i,parseLifeCycles:p,replaceState:l,parseCondition:u,generateCSS:m,parseDataSource:d,line2Hump:f}=n(0);e.exports=function(e,t){const{prettier:n,scale:$}=t,h=e.fileName||e.id;let x=[],y=[];const g={},b=[];let S=null,j=[];const O=[];let w=[];const v=[],C=e=>{const t=e.componentName,n=e.componentName.toLowerCase(),o=e.props&&e.props.className,a=o?` style={styles.${o}}`:"";let i;o&&(g[o]=s(e.props.style,$));let p="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(p+=` ${t}={${c(e.props[t])}}`)}),n){case"text":-1===x.indexOf("import Text from 'rax-text'")&&x.push("import Text from 'rax-text'");const n=c(e.props.text||e.text,!0);i=`<Text${a}${p}>${n||""}</Text>`;break;case"image":-1===x.indexOf("import Image from 'rax-image'")&&x.push("import Image from 'rax-image'"),e.props.src;let o=c(e.props.src);o=o&&`source={{uri: ${o}}}`||"",i=`<Image${a}${p} ${o} />`;break;case"div":case"page":case"block":case"component":-1===x.indexOf("import View from 'rax-view'")&&x.push("import View from 'rax-view'"),i=e.children&&e.children.length?`<View${a}${p}>${N(e.children)}</View>`:`<View${a}${p} />`;break;default:const r=`import ${t} from '${t}'`;-1===x.indexOf(r)&&x.push(r),i=e.children&&e.children.length&&Array.isArray(e.children)?`<${t}${a}${p}>${N(e.children)}</${t}>`:"string"==typeof e.children?`<${t}${a}${p} >${e.children}</${t}>`:`<${t}${a}${p} />`}if(e.loop){const t=r(e.loop,e.loopArgs,i,S);i=t.value,j=j.concat(t.hookState)}return i=l(i),e.condition&&(i=u(e.condition,i)),(e.loop||e.condition)&&(i=`{${i}}`),i},N=e=>{let t="";if(Array.isArray(e))e.forEach(e=>{t+=N(e)});else{const n=e.componentName.toLowerCase();if(-1!==["page"].indexOf(n)){const t=[];if(e.state&&(t.push(`state = ${o(e.state)}`),S=o(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:n,content:o}=a(e.methods[t]);O.push(`function ${t}(${n}) {${o}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?v.push(`${e.id}();`):"string"==typeof e.isInit&&v.push(`if (${c(e.isInit)}) { ${e.id}(); }`);const t=d(e,x);O.push(t.value),x=t.imports}),e.dataSource.dataHandler)){const{params:t,content:n}=a(e.dataSource.dataHandler);O.push(`const dataHandler = (${t}) => {${n}}`),v.push("dataHandler()")}e.lifeCycles&&(w=p(e,v)),S&&j.push(i(S))}else if(-1!==["block"].indexOf(n)){const n=e.fileName||e.id;let o="";Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(o+=` ${t}={${c(e.props[t])}}`)}),t+=`<${f(n)} ${o} />`,y.push(`import ${f(n)} from './${n}';`)}else t+=C(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{b.push(`const ${e} = ${t.utils[e]}`)}),N(e);const k={parser:"babel",printWidth:120,singleQuote:!0},I=C(e),E=n.format("import { createElement, createContext, useReducer } from 'rax';\n\n    const initState = {\n      txt: 'click me' // Get data, trigger proactively useEffect\n    };\n    \n    function UserReducer(state, action) {\n      switch (action.type) {\n        case 'changeTxt':\n          return {\n            ...state,\n            txt: `click me ${action.payload.val}`\n          };\n        default:\n          return state;\n      }\n    }\n    \n    const IndexContext = createContext();\n    \n    const IndexProvider = props => {\n      const [state, dispatch] = useReducer(UserReducer, initState);\n      return (\n        <IndexContext.Provider value={{ state, dispatch }}>\n          {props.children}\n        </IndexContext.Provider>\n      );\n    };\n    \n    export { IndexContext, IndexProvider };\n  ",k),P=I.match("dispatch");return[{panelName:`${h}.jsx`,panelValue:n.format(`\n    'use strict';\n    import { createElement, useState, useEffect } from 'rax';\n    ${x.join("\n")}\n    ${y.join("\n")}\n    import { ${P?"IndexContext, IndexProvider":"IndexProvider"} } from './context';\n    import styles from './${h}.css';\n\n    ${b.join("\n")}\n    export default function Page() {\n      ${j.join("\n")}\n      ${P?"const { state: { txt }, dispatch} = useContext(IndexContext);":""}\n\n      ${w.join("\n")}\n      \n      ${O.join("\n")}\n      return (<IndexProvider>${I}</IndexProvider>)\n    };\n  `,k),panelType:"js",panelImports:x.concat(y)},{panelName:"context.jsx",panelValue:E,panelType:"js",panelImports:[]},{panelName:`${h}.css`,panelValue:n.format(`${m(g)}`,{parser:"css"}),panelType:"css"}]}}]);