module.exports=function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){const n=e=>/^\{\{.*\}\}$/.test(e),o=e=>"[object Function]"==={}.toString.call(e)?e.toString():"string"==typeof e?e:"object"==typeof e?JSON.stringify(e,(e,t)=>"function"==typeof t?t.toString():t):String(e),r=e=>e.charAt(0).toUpperCase()+e.slice(1),s=e=>{const t=e.toString();return{params:t.match(/\([^\(\)]*\)/)[0].slice(1,-1),content:t.slice(t.indexOf("{")+1,t.lastIndexOf("}"))}},a=(e,t)=>{if("string"==typeof e)return n(e)?t?e.slice(1,-1):e.slice(2,-2):t?e:`'${e}'`;if("function"==typeof e){const{params:t,content:n}=s(e);return`(${t}) => {${n}}`}};e.exports={isExpression:n,toString:o,line2Hump:e=>e=(e=e.replace(/[_|-](\w)/g,(e,t)=>t.toUpperCase())).charAt(0).toUpperCase()+e.slice(1),toUpperCaseStart:r,parseStyle:e=>{for(let t in e)switch(t){case"fontSize":case"marginTop":case"marginBottom":case"paddingTop":case"paddingBottom":case"height":case"top":case"bottom":case"width":case"maxWidth":case"left":case"right":case"paddingRight":case"paddingLeft":case"marginLeft":case"marginRight":case"lineHeight":case"borderBottomRightRadius":case"borderBottomLeftRadius":case"borderTopRightRadius":case"borderTopLeftRadius":case"borderRadius":e[t]=parseInt(e[t])+"rpx"}return e},parseDataSource:(e,t)=>{const r=e.id,{uri:c,method:i,params:p}=e.options,l=e.type;let u={};switch(l){case"fetch":-1===t.indexOf("import {fetch} from whatwg-fetch")&&t.push("import {fetch} from 'whatwg-fetch'"),u={method:i};break;case"jsonp":-1===t.indexOf("import {fetchJsonp} from fetch-jsonp")&&t.push("import jsonp from 'fetch-jsonp'")}Object.keys(e.options).forEach(t=>{-1===["uri","method","params"].indexOf(t)&&(u[t]=o(e.options[t]))}),u=p?`${o(u).slice(0,-1)} ,body: ${n(p)?a(p):o(p)}}`:o(u);let d=`{\n  ${l}(${a(c)}, ${o(u)})\n    .then((response) => response.json())\n`;if(e.dataHandler){const{params:t,content:n}=s(e.dataHandler);d+=`.then((${t}) => {${n}})\n    .catch((e) => {\n      console.log('error', e);\n    })\n  `}return d+="}",{value:`function ${r}() ${d}`,imports:t}},parseFunction:s,parseLoop:(e,t,s,a)=>{let c,i=t&&t[0]||"item",p=t&&t[1]||"index";Array.isArray(e)?c=o(e):n(e)&&(c=e.slice(2,-2));const l=s.match(/^<.+?\s/)[0].length;s=`${s.slice(0,l)} key={${p}}${s.slice(l)}`;const u=new RegExp(`this.${i}`,"g");s=s.replace(u,i);let d=c;c.match(/this\.state\./)&&(d=c.split(".").pop());const f=[];return a&&f.push(`const [${d}, set${r(d)}] = useState(${o(JSON.parse(a)[d])||null});`),{hookState:f,value:`${d}.map((${i}, ${p}) => {\n      return (${s});\n    })`}},parseCondition:(e,t)=>"boolean"==typeof e?`${e} && ${t}`:"string"==typeof e?`${(e=e.replace(/this\./,"")).slice(2,-2)} && ${t}`:void 0,parseProps:a,generateCSS:e=>{let t="";for(let o in e){t+=`.${o} {`;for(let r in e[o])t+=`${n=r,n.split(/(?=[A-Z])/).join("-").toLowerCase()}: ${e[o][r]};\n`;t+="}"}var n;return t}}},function(e,t,n){const{exportMod:o,exportPage:r}=n(2),{line2Hump:s}=n(0);e.exports=function(e,t){const n=[];!function e(t){switch(t.componentName.toLowerCase()){case"block":t.fileName=t.fileName||t.id,t.smart&&t.smart.layerProtocol&&t.smart.layerProtocol.module&&t.smart.layerProtocol.module.type&&(t.fileName=t.smart.layerProtocol.module.type.replace(/[@|\/]/g,"")),t.fileName=s(t.fileName),n.push(t)}t.children&&t.children.length>0&&Array.isArray(t.children)&&t.children.forEach(t=>{e(t)})}(e);let a=[];n.length>0&&n.forEach(e=>{const n=o(e,t);a=a.concat(n)});const c=r(e,t);return a=a.concat(c),{panelDisplay:a,noTemplate:!0}}},function(e,t,n){const{toString:o,parseLoop:r,parseStyle:s,parseFunction:a,parseProps:c,parseCondition:i,generateCSS:p,parseDataSource:l,line2Hump:u}=n(0);e.exports={exportMod:function(e,t){const{prettier:n}=t,d=e.fileName;let f=[],m=[];const $={},h=[];let x=null,y=[];const g=[],b=[],j=e=>{const t=e.componentName.toLowerCase(),n=e.props&&e.props.className,o=n?` style={styles.${n}}`:"";let a;n&&($[n]=s(e.props.style));let p="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(p+=` ${t}={${c(e.props[t])}}`)}),t){case"text":-1===f.indexOf("import Text from 'rax-text'")&&f.push("import Text from 'rax-text'");const t=c(e.props.text,!0);a=`<Text${o}${p}>${t}</Text>`;break;case"image":-1===f.indexOf("import Image from 'rax-image'")&&f.push("import Image from 'rax-image'");const n=c(e.props.src);a=`<Image${o}${p} source={{uri: ${n}}} />`;break;case"div":case"page":case"block":case"component":-1===f.indexOf("import View from 'rax-view'")&&f.push("import View from 'rax-view'"),a=e.children&&e.children.length?`<View${o}${p}>${S(e.children)}</View>`:`<View${o}${p} />`;break;default:const r=`import ${componentName} from '${componentName}'`;-1===f.indexOf(r)&&f.push(r),a=e.children&&e.children.length&&Array.isArray(e.children)?`<${componentName}${o}${p}>${S(e.children)}</${componentName}>`:"string"==typeof e.children?`<${componentName}${o}${p} >${e.children}</${componentName}>`:`<${componentName}${o}${p} />`}if(e.loop){const t=r(e.loop,e.loopArgs,a,x);a=t.value,y=y.concat(t.hookState)}return e.condition&&(a=i(e.condition,a)),(e.loop||e.condition)&&(a=`{${a}}`),a},S=e=>{let t="";const n=e.fileName||e.id;if(Array.isArray(e))e.forEach(e=>{t+=S(e)});else{const r=e.componentName.toLowerCase();if(-1!==["page"].indexOf(r)||n===d){const t=[],n=[];if(e.state&&(t.push(`state = ${o(e.state)}`),x=o(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:n,content:o}=a(e.methods[t]);g.push(`function ${t}(${n}) {${o}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?b.push(`${e.id}();`):"string"==typeof e.isInit&&b.push(`if (${c(e.isInit)}) { ${e.id}(); }`);const t=l(e,f);g.push(t.value),f=t.imports}),e.dataSource.dataHandler)){const{params:t,content:n}=a(e.dataSource.dataHandler);g.push(`dataHandler(${t}) {${n}}`),b.push("dataHandler()")}e.lifeCycles&&(e.lifeCycles._constructor||n.push(`constructor(props, context) { super(); ${b.join("\n")}}`),Object.keys(e.lifeCycles).forEach(t=>{const{params:o,content:r}=a(e.lifeCycles[t]);"_constructor"===t?b.push(r):n.push(`${t}(${o}) {${r}}`)}))}else-1!==["block"].indexOf(r)?(t+=`<${u(n)} />`,m.push(`import ${u(n)} from '../${n}';`)):t+=j(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{h.push(`const ${e} = ${t.utils[e]}`)}),S(e);const C=j(e),O=C.match("dispatch"),w=n.format(`\n    'use strict';\n    import { createElement, useState, useEffect, useRef, memo } from 'rax';\n    ${f.join("\n")}\n    ${m.join("\n")}\n    ${O?"import { IndexContext } from '../../context';":""}\n\n    import styles from './${d}.css';\n\n    ${h.join("\n")}\n    export default memo((props) => {\n      ${y.join("\n")}\n      const hasCalled = useRef(false);\n      ${O?"const { state: { txt }, dispatch} = useContext(IndexContext);":""}\n      useEffect(() => {\n        if (!hasCalled.current) {\n          hasCalled.current = true;\n          ${b.join("\n")}\n        }\n      })\n      ${g.join("\n")}\n      return (${C})\n    });\n  `,{parser:"babel",printWidth:120,singleQuote:!0});return[{panelName:`${d}.jsx`,panelValue:w,panelType:"js",panelImports:f},{panelName:`${d}.css`,panelValue:n.format(`${p($)}`,{parser:"css"}),panelType:"css"}]},exportPage:function(e,t){const{prettier:n}=t,d=e.fileName||e.id;let f=[],m=[];const $={},h=[];let x=null,y=[];const g=[],b=[],j=e=>{const t=e.componentName,n=e.componentName.toLowerCase(),o=e.props&&e.props.className,a=o?` style={styles.${o}}`:"";let p;o&&($[o]=s(e.props.style));let l="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(l+=` ${t}={${c(e.props[t])}}`)}),n){case"text":-1===f.indexOf("import Text from 'rax-text'")&&f.push("import Text from 'rax-text'");const n=c(e.props.text,!0);p=`<Text${a}${l}>${n}</Text>`;break;case"image":-1===f.indexOf("import Image from 'rax-image'")&&f.push("import Image from 'rax-image'");const o=c(e.props.src);p=`<Image${a}${l} source={{uri: ${o}}} />`;break;case"div":case"page":case"block":case"component":-1===f.indexOf("import View from 'rax-view'")&&f.push("import View from 'rax-view'"),p=e.children&&e.children.length?`<View${a}${l}>${S(e.children)}</View>`:`<View${a}${l} />`;break;default:const r=`import ${t} from '${t}'`;-1===f.indexOf(r)&&f.push(r),p=e.children&&e.children.length&&Array.isArray(e.children)?`<${t}${a}${l}>${S(e.children)}</${t}>`:"string"==typeof e.children?`<${t}${a}${l} >${e.children}</${t}>`:`<${t}${a}${l} />`}if(e.loop){const t=r(e.loop,e.loopArgs,p,x);p=t.value,y=y.concat(t.hookState)}return e.condition&&(p=i(e.condition,p)),(e.loop||e.condition)&&(p=`{${p}}`),p},S=e=>{let t="";if(Array.isArray(e))e.forEach(e=>{t+=S(e)});else{const n=e.componentName.toLowerCase();if(-1!==["page"].indexOf(n)){const t=[],n=[];if(e.state&&(t.push(`state = ${o(e.state)}`),x=o(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:n,content:o}=a(e.methods[t]);g.push(`function ${t}(${n}) {${o}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?b.push(`${e.id}();`):"string"==typeof e.isInit&&b.push(`if (${c(e.isInit)}) { ${e.id}(); }`);const t=l(e,f);g.push(t.value),f=t.imports}),e.dataSource.dataHandler)){const{params:t,content:n}=a(e.dataSource.dataHandler);g.push(`dataHandler(${t}) {${n}}`),b.push("dataHandler()")}e.lifeCycles&&(e.lifeCycles._constructor||n.push(`constructor(props, context) { super(); ${b.join("\n")}}`),Object.keys(e.lifeCycles).forEach(t=>{const{params:o,content:r}=a(e.lifeCycles[t]);"_constructor"===t?b.push(r):n.push(`${t}(${o}) {${r}}`)}))}else if(-1!==["block"].indexOf(n)){const n=e.fileName||e.id;t+=`<${u(n)} />`,m.push(`import ${u(n)} from './${n}';`)}else t+=j(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{h.push(`const ${e} = ${t.utils[e]}`)}),S(e);const C={parser:"babel",printWidth:120,singleQuote:!0},O=j(e),w=n.format("import { createElement, createContext, useReducer } from 'rax';\n\n    const initState = {\n      txt: 'click me' // Get data, trigger proactively useEffect\n    };\n    \n    function UserReducer(state, action) {\n      switch (action.type) {\n        case 'changeTxt':\n          return {\n            ...state,\n            txt: `click me ${action.payload.val}`\n          };\n        default:\n          return state;\n      }\n    }\n    \n    const IndexContext = createContext();\n    \n    const IndexProvider = props => {\n      const [state, dispatch] = useReducer(UserReducer, initState);\n      return (\n        <IndexContext.Provider value={{ state, dispatch }}>\n          {props.children}\n        </IndexContext.Provider>\n      );\n    };\n    \n    export { IndexContext, IndexProvider };\n  ",C),v=O.match("dispatch");return[{panelName:`${d}.jsx`,panelValue:n.format(`\n    'use strict';\n    import { createElement, useState, useEffect, useRef } from 'rax';\n    ${f.join("\n")}\n    ${m.join("\n")}\n    import { ${v?"IndexContext, IndexProvider":"IndexProvider"} } from './context';\n    import styles from './${d}.css';\n\n    ${h.join("\n")}\n    export default function Page() {\n      ${y.join("\n")}\n      const hasCalled = useRef(false);\n      ${v?"const { state: { txt }, dispatch} = useContext(IndexContext);":""}\n      useEffect(() => {\n        if (!hasCalled.current) {\n          hasCalled.current = true;\n          ${b.join("\n")}\n        }\n      })\n      ${g.join("\n")}\n      return (<IndexProvider>${O}</IndexProvider>)\n    };\n  `,C),panelType:"js",panelImports:f.concat(m)},{panelName:"context.jsx",panelValue:w,panelType:"js",panelImports:[]},{panelName:`${d}.css`,panelValue:n.format(`${p($)}`,{parser:"css"}),panelType:"css"}]}}}]);