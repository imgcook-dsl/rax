module.exports=function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){const n=e=>/^\{\{.*\}\}$/.test(e),o=e=>"[object Function]"==={}.toString.call(e)?e.toString():"string"==typeof e?e:"object"==typeof e?JSON.stringify(e,(e,t)=>"function"==typeof t?t.toString():t):String(e),r=e=>e.charAt(0).toUpperCase()+e.slice(1),s=e=>{const t=e.toString();return{params:t.match(/\([^\(\)]*\)/)[0].slice(1,-1),content:t.slice(t.indexOf("{")+1,t.lastIndexOf("}"))}},a=(e,t)=>{if("string"==typeof e)return n(e)?t?e.slice(1,-1):e.slice(2,-2):t?e:`'${e}'`;if("function"==typeof e){const{params:t,content:n}=s(e);return`(${t}) => {${n}}`}return"object"==typeof e?`${JSON.stringify(e)}`:e},c=e=>{const t=new RegExp("this.state","g");return e.replace(t,"state")};e.exports={isExpression:n,toString:o,getValueByPath:(e,t,n)=>{e||(e={}),t||(t=""),n||(n="");for(var o=(t=(t=t.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),r=0,s=o.length;r<s;++r){var a=o[r];if(!(a in e))return n;e=e[a]}return e},line2Hump:e=>e=(e=e.replace(/[_|-](\w)/g,(e,t)=>t.toUpperCase())).charAt(0).toUpperCase()+e.slice(1),toUpperCaseStart:r,parseStyle:(e,t)=>{for(let n in e)switch(n){case"fontSize":case"marginTop":case"marginBottom":case"paddingTop":case"paddingBottom":case"height":case"top":case"bottom":case"width":case"maxWidth":case"left":case"right":case"paddingRight":case"paddingLeft":case"marginLeft":case"marginRight":case"lineHeight":case"borderBottomRightRadius":case"borderBottomLeftRadius":case"borderTopRightRadius":case"borderTopLeftRadius":case"borderRadius":e[n]=parseInt(e[n])*t+"rpx"}return e},parseDataSource:(e,t)=>{const r=e.id,{uri:c,method:i,params:p}=e.options,l=e.type;let u={};switch(l){case"fetch":-1===t.indexOf("import {fetch} from whatwg-fetch")&&t.push("import {fetch} from 'whatwg-fetch'"),u={method:i};break;case"jsonp":-1===t.indexOf("import {fetchJsonp} from fetch-jsonp")&&t.push("import jsonp from 'fetch-jsonp'")}Object.keys(e.options).forEach(t=>{-1===["uri","method","params"].indexOf(t)&&(u[t]=o(e.options[t]))});let m=null===(f=u)||"[object Object]"!==Object.prototype.toString.call(f)||Object.keys(f).length?",":"";var f;u=p?`${o(u).slice(0,-1)} ${m} body: ${n(p)?a(p):o(p)}}`:o(u);let d=`{\n  return ${l}(${a(c)}, ${o(u)})\n    .then((response) => response.json())\n`;if(e.dataHandler){const{params:t,content:n}=s(e.dataHandler);d+=`.then((${t}) => {${n}})\n    .catch((e) => {\n      console.log('error', e);\n    })\n  `}return d+="}",{value:`function ${r}() ${d}`,imports:t}},parseFunction:s,parseLoop:(e,t,r,s)=>{let a,c=t&&t[0]||"item",i=t&&t[1]||"index";Array.isArray(e)?a=o(e):n(e)&&(a=e.slice(2,-2));const p=r.match(/^<.+?\s/)[0].length;r=`${r.slice(0,p)} key={${i}}${r.slice(p)}`;const l=new RegExp(`this.${c}`,"g");r=r.replace(l,c);let u=a;return a.match(/this\.state\./)&&(u=`state.${a.split(".").pop()}`),{hookState:[],value:`${u}.map((${c}, ${i}) => {\n      return (${r});\n    })`}},parseCondition:(e,t)=>"boolean"==typeof e?`${e} && ${t}`:"string"==typeof e?`${(e=e.replace(/this\./,"")).slice(2,-2)} && ${t}`:void 0,parseProps:a,parseState:e=>`const [state, set${r("state")}] = useState(${o(JSON.parse(e))||null});`,parseLifeCycles:(e,t)=>{let n=[];return!e.lifeCycles._constructor&&t&&(e.lifeCycles._constructor="function _constructor() {}"),Object.keys(e.lifeCycles).forEach(o=>{let{params:r,content:a}=s(e.lifeCycles[o]);switch(a=c(a),o){case"_constructor":t.push(a),n.unshift(`\n          // constructor\n          useState(()=>{\n            ${t.join("\n")}\n          })\n        `);break;case"componentDidMount":n.push(`\n          // componentDidMount\n          useEffect(()=>{\n            ${a}\n          }, [])\n        `);break;case"componentDidUpdate":n.push(`\n          // componentDidUpdate\n          useEffect(()=>{\n            ${a}\n          })\n        `);break;case"componentWillUnMount":n.push(`\n          // componentWillUnMount\n          useEffect(()=>{\n            return ()=>{\n              ${a}\n            }\n          }, [])\n        `)}}),n},replaceState:c,generateCSS:e=>{let t="";for(let o in e){t+=`.${o} {`;for(let r in e[o])t+=`${n=r,n.split(/(?=[A-Z])/).join("-").toLowerCase()}: ${e[o][r]};\n`;t+="}"}var n;return t}}},function(e,t,n){const{exportMod:o,exportPage:r}=n(2),{line2Hump:s}=n(0);e.exports=function(e,t){const n=[],a=750/(t.responsive&&t.responsive.width||750);t.scale=a,function e(t){const{json:o,scale:r}=t;switch(o.componentName.toLowerCase()){case"block":o.fileName=o.fileName||o.id,o.smart&&o.smart.layerProtocol&&o.smart.layerProtocol.module&&o.smart.layerProtocol.module.type&&(o.fileName=o.smart.layerProtocol.module.type.replace(/[@|\/]/g,"")),o.fileName=s(o.fileName),n.push(o)}o.children&&o.children.length>0&&Array.isArray(o.children)&&o.children.forEach(t=>{e({json:t,scale:r})})}({json:e,scale:a});let c=[];n.length>0&&n.forEach(e=>{const n=o(e,t);c=c.concat(n)});const i=r(e,t);return c=c.concat(i),{panelDisplay:c,noTemplate:!0}}},function(e,t,n){const o=n(3),r=n(4);e.exports={exportMod:o,exportPage:r}},function(e,t,n){const{toString:o,getValueByPath:r,parseLoop:s,parseStyle:a,parseFunction:c,parseProps:i,parseState:p,parseLifeCycles:l,replaceState:u,parseCondition:m,generateCSS:f,parseDataSource:d,line2Hump:$}=n(0);e.exports=function(e,t){const{prettier:n,scale:h}=t,x=e.fileName;let y=[],g=[];const b={},S=[];let j=null,O=[];const w=[];let k=[];const v=[],C=e=>{const t=e.componentName.toLowerCase(),n=e.props&&e.props.className,o=n?` style={styles.${n}}`:"";let c;n&&(b[n]=a(e.props.style,h));let p="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(p+=` ${t}={${i(e.props[t])}}`)}),t){case"text":-1===y.indexOf("import Text from 'rax-text'")&&y.push("import Text from 'rax-text'");let t=i(e.props.text||e.text,!0);t.match(/this\.props/)&&(t=t.replace(/this\./,"")),c=`<Text${o}${p}>${t||""}</Text>`;break;case"image":-1===y.indexOf("import Image from 'rax-image'")&&y.push("import Image from 'rax-image'");let n=i(e.props.src);n=n&&`source={{uri: ${n}}}`||"",c=`<Image${o}${p} ${n} />`;break;case"div":case"page":case"block":case"component":-1===y.indexOf("import View from 'rax-view'")&&y.push("import View from 'rax-view'"),c=e.children&&e.children.length?`<View${o}>${N(e.children)}</View>`:`<View${o} />`;break;default:let s=r(e,"smart.layerProtocol.component.package")||componentName;const a=`import ${componentName} from '${s}'`;-1===y.indexOf(a)&&y.push(a),c=e.children&&e.children.length&&Array.isArray(e.children)?`<${componentName}${o}${p}>${N(e.children)}</${componentName}>`:"string"==typeof e.children?`<${componentName}${o}${p} >${e.children}</${componentName}>`:`<${componentName}${o}${p} />`}if(e.loop){const t=s(e.loop,e.loopArgs,c,j);c=t.value,O=O.concat(t.hookState)}return c=u(c),e.condition&&(c=m(e.condition,c)),(e.loop||e.condition)&&(c=`{${c}}`),c},N=e=>{let t="";const n=e.fileName||e.id;if(Array.isArray(e))e.forEach(e=>{t+=N(e)});else{const r=e.componentName.toLowerCase();if(-1!==["page"].indexOf(r)||n===x){const t=[];if(e.state&&(t.push(`state = ${o(e.state)}`),j=o(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:n,content:o}=c(e.methods[t]);w.push(`function ${t}(${n}) {${o}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?v.push(`${e.id}();`):"string"==typeof e.isInit&&v.push(`if (${i(e.isInit)}) { ${e.id}(); }`);const t=d(e,y);w.push(t.value),y=t.imports}),e.dataSource.dataHandler)){const{params:t,content:n}=c(e.dataSource.dataHandler);w.push(`const dataHandler = (${t}) => {${n}}`),v.push("dataHandler()")}e.lifeCycles&&(k=l(e,v)),j&&O.push(p(j))}else if(-1!==["block"].indexOf(r)){let o="";Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(o+=` ${t}={${i(e.props[t])}}`)}),t+=`<${$(n)} ${o} />`,g.push(`import ${$(n)} from '../${n}';`)}else t+=C(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{S.push(`const ${e} = ${t.utils[e]}`)}),N(e);const I=C(e),E=I.match("dispatch"),P=n.format(`\n    'use strict';\n    import { createElement, useState, useEffect, memo } from 'rax';\n    ${y.join("\n")}\n    ${g.join("\n")}\n    ${E?"import { IndexContext } from '../../context';":""}\n\n    import styles from './${x}.css';\n\n    ${S.join("\n")}\n    export default memo((props) => {\n      ${O.join("\n")}\n      ${E?"const { state: { txt }, dispatch} = useContext(IndexContext);":""}\n      ${k.join("\n")}\n      ${w.join("\n")}\n      ${I.match(/^\{true\ \&\& /)?`return (<View>${I}</View>)`:`return (${I})`}\n    });\n  `,{parser:"babel",printWidth:120,singleQuote:!0});return[{panelName:`${x}.jsx`,panelValue:P,panelType:"js",panelImports:y},{panelName:`${x}.css`,panelValue:n.format(`${f(b)}`,{parser:"css"}),panelType:"css"}]}},function(e,t,n){const{toString:o,getValueByPath:r,parseLoop:s,parseStyle:a,parseFunction:c,parseProps:i,parseState:p,parseLifeCycles:l,replaceState:u,parseCondition:m,generateCSS:f,parseDataSource:d,line2Hump:$}=n(0);e.exports=function(e,t){const{prettier:n,scale:h}=t,x=e.fileName||e.id;let y=[],g=[];const b={},S=[];let j=null,O=[];const w=[];let k=[];const v=[],C=e=>{const t=e.componentName,n=e.componentName.toLowerCase(),o=e.props&&e.props.className,c=o?` style={styles.${o}}`:"";let p;o&&(b[o]=a(e.props.style,h));let l="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(l+=` ${t}={${i(e.props[t])}}`)}),n){case"text":-1===y.indexOf("import Text from 'rax-text'")&&y.push("import Text from 'rax-text'");const n=i(e.props.text||e.text,!0);p=`<Text${c}${l}>${n||""}</Text>`;break;case"image":-1===y.indexOf("import Image from 'rax-image'")&&y.push("import Image from 'rax-image'"),e.props.src;let o=i(e.props.src);o=o&&`source={{uri: ${o}}}`||"",p=`<Image${c}${l} ${o} />`;break;case"div":case"page":case"block":case"component":-1===y.indexOf("import View from 'rax-view'")&&y.push("import View from 'rax-view'"),p=e.children&&e.children.length?`<View${c}${l}>${N(e.children)}</View>`:`<View${c}${l} />`;break;default:const s=`import ${t} from '${r(e,"smart.layerProtocol.component.package")||t}'`;-1===y.indexOf(s)&&y.push(s),p=e.children&&e.children.length&&Array.isArray(e.children)?`<${t}${c}${l}>${N(e.children)}</${t}>`:"string"==typeof e.children?`<${t}${c}${l} >${e.children}</${t}>`:`<${t}${c}${l} />`}if(e.loop){const t=s(e.loop,e.loopArgs,p,j);p=t.value,O=O.concat(t.hookState)}return p=u(p),e.condition&&(p=m(e.condition,p)),(e.loop||e.condition)&&(p=`{${p}}`),p},N=e=>{let t="";if(Array.isArray(e))e.forEach(e=>{t+=N(e)});else{const n=e.componentName.toLowerCase();if(-1!==["page"].indexOf(n)){const t=[];if(e.state&&(t.push(`state = ${o(e.state)}`),j=o(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:n,content:o}=c(e.methods[t]);w.push(`function ${t}(${n}) {${o}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?v.push(`${e.id}();`):"string"==typeof e.isInit&&v.push(`if (${i(e.isInit)}) { ${e.id}(); }`);const t=d(e,y);w.push(t.value),y=t.imports}),e.dataSource.dataHandler)){const{params:t,content:n}=c(e.dataSource.dataHandler);w.push(`const dataHandler = (${t}) => {${n}}`),v.push("dataHandler()")}e.lifeCycles&&(k=l(e,v)),j&&O.push(p(j))}else if(-1!==["block"].indexOf(n)){const n=e.fileName||e.id;let o="";Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(o+=` ${t}={${i(e.props[t])}}`)}),t+=`<${$(n)} ${o} />`,g.push(`import ${$(n)} from './${n}';`)}else t+=C(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{S.push(`const ${e} = ${t.utils[e]}`)}),N(e);const I={parser:"babel",printWidth:120,singleQuote:!0},E=C(e),P=n.format("import { createElement, createContext, useReducer } from 'rax';\n\n    const initState = {\n      txt: 'click me' // Get data, trigger proactively useEffect\n    };\n    \n    function UserReducer(state, action) {\n      switch (action.type) {\n        case 'changeTxt':\n          return {\n            ...state,\n            txt: `click me ${action.payload.val}`\n          };\n        default:\n          return state;\n      }\n    }\n    \n    const IndexContext = createContext();\n    \n    const IndexProvider = props => {\n      const [state, dispatch] = useReducer(UserReducer, initState);\n      return (\n        <IndexContext.Provider value={{ state, dispatch }}>\n          {props.children}\n        </IndexContext.Provider>\n      );\n    };\n    \n    export { IndexContext, IndexProvider };\n  ",I),A=E.match("dispatch");return[{panelName:`${x}.jsx`,panelValue:n.format(`\n    'use strict';\n    import { createElement, useState, useEffect } from 'rax';\n    ${y.join("\n")}\n    ${g.join("\n")}\n    import { ${A?"IndexContext, IndexProvider":"IndexProvider"} } from './context';\n    import styles from './${x}.css';\n\n    ${S.join("\n")}\n    export default function Page() {\n      ${O.join("\n")}\n      ${A?"const { state: { txt }, dispatch} = useContext(IndexContext);":""}\n\n      ${k.join("\n")}\n      \n      ${w.join("\n")}\n      return (<IndexProvider>${E}</IndexProvider>)\n    };\n  `,I),panelType:"js",panelImports:y.concat(g)},{panelName:"context.jsx",panelValue:P,panelType:"js",panelImports:[]},{panelName:`${x}.css`,panelValue:n.format(`${f(b)}`,{parser:"css"}),panelType:"css"}]}}]);