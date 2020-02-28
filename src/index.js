module.exports=function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){const n=e=>/^\{\{.*\}\}$/.test(e),o=e=>"[object Function]"==={}.toString.call(e)?e.toString():"string"==typeof e?e:"object"==typeof e?JSON.stringify(e,(e,t)=>"function"==typeof t?t.toString():t):String(e),r=e=>e.charAt(0).toUpperCase()+e.slice(1),s=e=>{const t=e.toString();return{params:t.match(/\([^\(\)]*\)/)[0].slice(1,-1),content:t.slice(t.indexOf("{")+1,t.lastIndexOf("}"))}},a=(e,t)=>{if("string"==typeof e)return n(e)?t?e.slice(1,-1):e.slice(2,-2):t?e:`'${e}'`;if("function"==typeof e){const{params:t,content:n}=s(e);return`(${t}) => {${n}}`}return"object"==typeof e?`${JSON.stringify(e)}`:e},c=e=>{const t=new RegExp("this.state","g");return e.replace(t,"state")};e.exports={isExpression:n,toString:o,transComponentsMap:(e=[])=>Array.isArray(e)?e.reduce((e,t)=>{const n=t.name;return e[n]||(e[n]=t),e},{}):[],line2Hump:e=>e=(e=e.replace(/[_|-](\w)/g,(e,t)=>t.toUpperCase())).charAt(0).toUpperCase()+e.slice(1),toUpperCaseStart:r,parseStyle:(e,t)=>{for(let n in e)switch(n){case"fontSize":case"marginTop":case"marginBottom":case"paddingTop":case"paddingBottom":case"height":case"top":case"bottom":case"width":case"maxWidth":case"left":case"right":case"paddingRight":case"paddingLeft":case"marginLeft":case"marginRight":case"lineHeight":case"borderBottomRightRadius":case"borderBottomLeftRadius":case"borderTopRightRadius":case"borderTopLeftRadius":case"borderRadius":e[n]=parseInt(e[n])*t+"rpx"}return e},parseDataSource:(e,t)=>{const r=e.id,{uri:c,method:i,params:p}=e.options,l=e.type;let u={};switch(l){case"fetch":-1===t.indexOf("import {fetch} from whatwg-fetch")&&t.push("import {fetch} from 'whatwg-fetch'"),u={method:i};break;case"jsonp":-1===t.indexOf("import {fetchJsonp} from fetch-jsonp")&&t.push("import jsonp from 'fetch-jsonp'")}Object.keys(e.options).forEach(t=>{-1===["uri","method","params"].indexOf(t)&&(u[t]=o(e.options[t]))});let m=null===(d=u)||"[object Object]"!==Object.prototype.toString.call(d)||Object.keys(d).length?",":"";var d;u=p?`${o(u).slice(0,-1)} ${m} body: ${n(p)?a(p):o(p)}}`:o(u);let f=`{\n  return ${l}(${a(c)}, ${o(u)})\n    .then((response) => response.json())\n`;if(e.dataHandler){const{params:t,content:n}=s(e.dataHandler);f+=`.then((${t}) => {${n}})\n    .catch((e) => {\n      console.log('error', e);\n    })\n  `}return f+="}",{value:`function ${r}() ${f}`,imports:t}},parseFunction:s,parseLoop:(e,t,r,s)=>{let a,c=t&&t[0]||"item",i=t&&t[1]||"index";Array.isArray(e)?a=o(e):n(e)&&(a=e.slice(2,-2));const p=r.match(/^<.+?\s/)[0].length;r=`${r.slice(0,p)} key={${i}}${r.slice(p)}`;const l=new RegExp(`this.${c}`,"g");r=r.replace(l,c);let u=a;return a.match(/this\.state\./)&&(u=`state.${a.split(".").pop()}`),{hookState:[],value:`${u}.map((${c}, ${i}) => {\n      return (${r});\n    })`}},parseCondition:(e,t)=>"boolean"==typeof e?`${e} && ${t}`:"string"==typeof e?`${(e=e.replace(/this\./,"")).slice(2,-2)} && ${t}`:void 0,parseProps:a,parseState:e=>`const [state, set${r("state")}] = useState(${o(JSON.parse(e))||null});`,parseLifeCycles:(e,t)=>{let n=[];return!e.lifeCycles._constructor&&t&&(e.lifeCycles._constructor="function _constructor() {}"),Object.keys(e.lifeCycles).forEach(o=>{let{params:r,content:a}=s(e.lifeCycles[o]);switch(a=c(a),o){case"_constructor":t.push(a),n.unshift(`\n          // constructor\n          useState(()=>{\n            ${t.join("\n")}\n          })\n        `);break;case"componentDidMount":n.push(`\n          // componentDidMount\n          useEffect(()=>{\n            ${a}\n          }, [])\n        `);break;case"componentDidUpdate":n.push(`\n          // componentDidUpdate\n          useEffect(()=>{\n            ${a}\n          })\n        `);break;case"componentWillUnMount":n.push(`\n          // componentWillUnMount\n          useEffect(()=>{\n            return ()=>{\n              ${a}\n            }\n          }, [])\n        `)}}),n},replaceState:c,generateCSS:e=>{let t="";for(let o in e){t+=`.${o} {`;for(let r in e[o])t+=`${n=r,n.split(/(?=[A-Z])/).join("-").toLowerCase()}: ${e[o][r]};\n`;t+="}"}var n;return t}}},function(e,t,n){const{exportMod:o,exportPage:r}=n(2),{line2Hump:s,transComponentsMap:a}=n(0);e.exports=function(e,t){const n=[],c=750/(t.responsive&&t.responsive.width||750),i=a(t.componentsMap);t.scale=c,t.componentsMap=i,function e(t){const{json:o,scale:r}=t;switch(o.componentName.toLowerCase()){case"block":o.fileName=o.fileName||o.id,o.smart&&o.smart.layerProtocol&&o.smart.layerProtocol.module&&o.smart.layerProtocol.module.type&&(o.fileName=o.smart.layerProtocol.module.type.replace(/[@|\/]/g,"")),o.fileName=s(o.fileName),n.push(o)}o.children&&o.children.length>0&&Array.isArray(o.children)&&o.children.forEach(t=>{e({json:t,scale:r})})}({json:e,scale:c});let p=[];n.length>0&&n.forEach(e=>{const n=o(e,t);p=p.concat(n)});const l=r(e,t);return p=p.concat(l),{panelDisplay:p,noTemplate:!0}}},function(e,t,n){const o=n(3),r=n(4);e.exports={exportMod:o,exportPage:r}},function(e,t,n){const{toString:o,parseLoop:r,parseStyle:s,parseFunction:a,parseProps:c,parseState:i,parseLifeCycles:p,replaceState:l,parseCondition:u,generateCSS:m,parseDataSource:d,line2Hump:f}=n(0);e.exports=function(e,t){const{prettier:n,scale:$,componentsMap:h}=t,x=e.fileName;let y=[],g=[];const b={},S=[];let j=null,O=[];const w=[];let C=[];const k=[],v=e=>{const t=e.componentName.toLowerCase(),n=e.props&&e.props.className,o=n?` style={styles.${n}}`:"";let a;n&&(b[n]=s(e.props.style,$));let i="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(i+=` ${t}={${c(e.props[t])}}`)}),t){case"text":-1===y.indexOf("import Text from 'rax-text'")&&y.push("import Text from 'rax-text'");let t=c(e.props.text||e.text,!0);t.match(/this\.props/)&&(t=t.replace(/this\./,"")),a=`<Text${o}${i}>${t||""}</Text>`;break;case"image":if(-1===y.indexOf("import Image from 'rax-image'")&&y.push("import Image from 'rax-image'"),e.props.source&&e.props.source.uri)a=`<Image${o}${i} />`;else{let t=c(e.props.src);t=t&&`source={{uri: ${t}}}`||"",a=`<Image${o}${i} ${t} />`}break;case"div":case"view":case"page":case"block":case"component":-1===y.indexOf("import View from 'rax-view'")&&y.push("import View from 'rax-view'"),a=e.children&&e.children.length?`<View${o}>${N(e.children)}</View>`:`<View${o} />`;break;default:let n=(h[e.componentName]||{}).package||componentName;const r=`import ${componentName} from '${n}'`;-1===y.indexOf(r)&&y.push(r),a=e.children&&e.children.length&&Array.isArray(e.children)?`<${componentName}${o}${i}>${N(e.children)}</${componentName}>`:"string"==typeof e.children?`<${componentName}${o}${i} >${e.children}</${componentName}>`:`<${componentName}${o}${i} />`}if(e.loop){const t=r(e.loop,e.loopArgs,a,j);a=t.value,O=O.concat(t.hookState)}return a=l(a),e.condition&&(a=u(e.condition,a)),(e.loop||e.condition)&&(a=`{${a}}`),a},N=e=>{let t="";const n=e.fileName||e.id;if(Array.isArray(e))e.forEach(e=>{t+=N(e)});else{const r=e.componentName.toLowerCase();if(-1!==["page"].indexOf(r)||n===x){const t=[];if(e.state&&(t.push(`state = ${o(e.state)}`),j=o(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:n,content:o}=a(e.methods[t]);w.push(`function ${t}(${n}) {${o}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?k.push(`${e.id}();`):"string"==typeof e.isInit&&k.push(`if (${c(e.isInit)}) { ${e.id}(); }`);const t=d(e,y);w.push(t.value),y=t.imports}),e.dataSource.dataHandler)){const{params:t,content:n}=a(e.dataSource.dataHandler);w.push(`const dataHandler = (${t}) => {${n}}`),k.push("dataHandler()")}e.lifeCycles&&(C=p(e,k)),j&&O.push(i(j))}else if(-1!==["block"].indexOf(r)){let o="";Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(o+=` ${t}={${c(e.props[t])}}`)}),t+=`<${f(n)} ${o} />`,g.push(`import ${f(n)} from '../${n}';`)}else t+=v(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{S.push(`const ${e} = ${t.utils[e]}`)}),N(e);const I=v(e),E=I.match("dispatch"),A=n.format(`\n    'use strict';\n    import { createElement, useState, useEffect, memo } from 'rax';\n    ${y.join("\n")}\n    ${g.join("\n")}\n    ${E?"import { IndexContext } from '../../context';":""}\n\n    import styles from './${x}.css';\n\n    ${S.join("\n")}\n    export default memo((props) => {\n      ${O.join("\n")}\n      ${E?"const { state: { txt }, dispatch} = useContext(IndexContext);":""}\n      ${C.join("\n")}\n      ${w.join("\n")}\n      ${I.match(/^\{true\ \&\& /)?`return (<View>${I}</View>)`:`return (${I})`}\n    });\n  `,{parser:"babel",printWidth:120,singleQuote:!0});return[{panelName:`${x}.jsx`,panelValue:A,panelType:"js",panelImports:y},{panelName:`${x}.css`,panelValue:n.format(`${m(b)}`,{parser:"css"}),panelType:"css"}]}},function(e,t,n){const{toString:o,parseLoop:r,parseStyle:s,parseFunction:a,parseProps:c,parseState:i,parseLifeCycles:p,replaceState:l,parseCondition:u,generateCSS:m,parseDataSource:d,line2Hump:f}=n(0);e.exports=function(e,t){const{prettier:n,scale:$,componentsMap:h}=t,x=e.fileName||e.id;let y=[],g=[];const b={},S=[];let j=null,O=[];const w=[];let C=[];const k=[],v=e=>{const t=e.componentName,n=e.componentName.toLowerCase(),o=e.props&&e.props.className,a=o?` style={styles.${o}}`:"";let i;o&&(b[o]=s(e.props.style,$));let p="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(p+=` ${t}={${c(e.props[t])}}`)}),n){case"text":-1===y.indexOf("import Text from 'rax-text'")&&y.push("import Text from 'rax-text'");const n=c(e.props.text||e.text,!0);i=`<Text${a}${p}>${n||""}</Text>`;break;case"image":if(-1===y.indexOf("import Image from 'rax-image'")&&y.push("import Image from 'rax-image'"),e.props.source&&e.props.source.uri)i=`<Image${a}${p} />`;else{let t=c(e.props.src);t=t&&`source={{uri: ${t}}}`||"",i=`<Image${a}${p} ${t} />`}break;case"div":case"view":case"page":case"block":case"component":-1===y.indexOf("import View from 'rax-view'")&&y.push("import View from 'rax-view'"),i=e.children&&e.children.length?`<View${a}${p}>${N(e.children)}</View>`:`<View${a}${p} />`;break;default:const o=`import ${t} from '${(h[e.componentName]||{}).package||t}'`;-1===y.indexOf(o)&&y.push(o),i=e.children&&e.children.length&&Array.isArray(e.children)?`<${t}${a}${p}>${N(e.children)}</${t}>`:"string"==typeof e.children?`<${t}${a}${p} >${e.children}</${t}>`:`<${t}${a}${p} />`}if(e.loop){const t=r(e.loop,e.loopArgs,i,j);i=t.value,O=O.concat(t.hookState)}return i=l(i),e.condition&&(i=u(e.condition,i)),(e.loop||e.condition)&&(i=`{${i}}`),i},N=e=>{let t="";if(Array.isArray(e))e.forEach(e=>{t+=N(e)});else{const n=e.componentName.toLowerCase();if(-1!==["page"].indexOf(n)){const t=[];if(e.state&&(t.push(`state = ${o(e.state)}`),j=o(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:n,content:o}=a(e.methods[t]);w.push(`function ${t}(${n}) {${o}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?k.push(`${e.id}();`):"string"==typeof e.isInit&&k.push(`if (${c(e.isInit)}) { ${e.id}(); }`);const t=d(e,y);w.push(t.value),y=t.imports}),e.dataSource.dataHandler)){const{params:t,content:n}=a(e.dataSource.dataHandler);w.push(`const dataHandler = (${t}) => {${n}}`),k.push("dataHandler()")}e.lifeCycles&&(C=p(e,k)),j&&O.push(i(j))}else if(-1!==["block"].indexOf(n)){const n=e.fileName||e.id;let o="";Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(o+=` ${t}={${c(e.props[t])}}`)}),t+=`<${f(n)} ${o} />`,g.push(`import ${f(n)} from './${n}';`)}else t+=v(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{S.push(`const ${e} = ${t.utils[e]}`)}),N(e);const I={parser:"babel",printWidth:120,singleQuote:!0},E=v(e),A=n.format("import { createElement, createContext, useReducer } from 'rax';\n\n    const initState = {\n      txt: 'click me' // Get data, trigger proactively useEffect\n    };\n    \n    function UserReducer(state, action) {\n      switch (action.type) {\n        case 'changeTxt':\n          return {\n            ...state,\n            txt: `click me ${action.payload.val}`\n          };\n        default:\n          return state;\n      }\n    }\n    \n    const IndexContext = createContext();\n    \n    const IndexProvider = props => {\n      const [state, dispatch] = useReducer(UserReducer, initState);\n      return (\n        <IndexContext.Provider value={{ state, dispatch }}>\n          {props.children}\n        </IndexContext.Provider>\n      );\n    };\n    \n    export { IndexContext, IndexProvider };\n  ",I),P=E.match("dispatch");return[{panelName:`${x}.jsx`,panelValue:n.format(`\n    'use strict';\n    import { createElement, useState, useEffect } from 'rax';\n    ${y.join("\n")}\n    ${g.join("\n")}\n    import { ${P?"IndexContext, IndexProvider":"IndexProvider"} } from './context';\n    import styles from './${x}.css';\n\n    ${S.join("\n")}\n    export default function Page() {\n      ${O.join("\n")}\n      ${P?"const { state: { txt }, dispatch} = useContext(IndexContext);":""}\n\n      ${C.join("\n")}\n      \n      ${w.join("\n")}\n      return (<IndexProvider>${E}</IndexProvider>)\n    };\n  `,I),panelType:"js",panelImports:y.concat(g)},{panelName:"context.jsx",panelValue:A,panelType:"js",panelImports:[]},{panelName:`${x}.css`,panelValue:n.format(`${m(b)}`,{parser:"css"}),panelType:"css"}]}}]);