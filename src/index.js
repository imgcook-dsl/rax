module.exports=function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){const n=e=>/^\{\{.*\}\}$/.test(e),o=e=>"[object Function]"==={}.toString.call(e)?e.toString():"string"==typeof e?e:"object"==typeof e?JSON.stringify(e,(e,t)=>"function"==typeof t?t.toString():t):String(e),r=e=>e.charAt(0).toUpperCase()+e.slice(1),s=e=>{const t=e.toString();return{params:t.match(/\([^\(\)]*\)/)[0].slice(1,-1),content:t.slice(t.indexOf("{")+1,t.lastIndexOf("}"))}},a=(e,t)=>{if("string"==typeof e)return n(e)?t?e.slice(1,-1):e.slice(2,-2):t?e:`'${e}'`;if("function"==typeof e){const{params:t,content:n}=s(e);return`(${t}) => {${n}}`}return"object"==typeof e?`${JSON.stringify(e)}`:e},c=e=>{const t=new RegExp("this.state","g");return e.replace(t,"state")},i=(e,t)=>{let n=!1;return e.forEach(e=>{e.import===t&&(n=!0)}),n};e.exports={isExpression:n,toString:o,transComponentsMap:(e={})=>{if(!e||!Array.isArray(e.list))return[];return e.list.reduce((e,t)=>{const n=t.name;if(!e[n]){try{let e=JSON.parse(t.dependence);e&&(t.packageName=e.package)}catch(e){}e[n]=t}return e},{})},line2Hump:e=>e=(e=e.replace(/[_|-](\w)/g,(e,t)=>t.toUpperCase())).charAt(0).toUpperCase()+e.slice(1),existImport:i,toUpperCaseStart:r,parseStyle:(e,t)=>{for(let n in e)switch(n){case"fontSize":case"marginTop":case"marginBottom":case"paddingTop":case"paddingBottom":case"height":case"top":case"bottom":case"width":case"maxWidth":case"left":case"right":case"paddingRight":case"paddingLeft":case"marginLeft":case"marginRight":case"lineHeight":case"borderBottomRightRadius":case"borderBottomLeftRadius":case"borderTopRightRadius":case"borderTopLeftRadius":case"borderRadius":e[n]=parseInt(e[n])*t+"rpx"}return e},parseDataSource:(e,t)=>{const r=e.id,{uri:c,method:p,params:l}=e.options,u=e.type;let d,m={};switch(u){case"fetch":d="import {fetch} from whatwg-fetch",i(t,d)||t.push({import:d,package:"whatwg-fetch",version:"^3.0.0"}),m={method:p};break;case"jsonp":d="import {fetchJsonp} from fetch-jsonp",i(t,d)||t.push({import:d,package:"fetch-jsonp",version:"^1.1.3"})}Object.keys(e.options).forEach(t=>{-1===["uri","method","params"].indexOf(t)&&(m[t]=o(e.options[t]))});let f=null===($=m)||"[object Object]"!==Object.prototype.toString.call($)||Object.keys($).length?",":"";var $;m=l?`${o(m).slice(0,-1)} ${f} body: ${n(l)?a(l):o(l)}}`:o(m);let h=`{\n  return ${u}(${a(c)}, ${o(m)})\n    .then((response) => response.json())\n`;if(e.dataHandler){const{params:t,content:n}=s(e.dataHandler);h+=`.then((${t}) => {${n}})\n    .catch((e) => {\n      console.log('error', e);\n    })\n  `}return h+="}",{value:`function ${r}() ${h}`,imports:t}},parseFunction:s,parseLoop:(e,t,r,s)=>{let a,c=t&&t[0]||"item",i=t&&t[1]||"index";Array.isArray(e)?a=o(e):n(e)&&(a=e.slice(2,-2));const p=r.match(/^<.+?\s/)[0].length;r=`${r.slice(0,p)} key={${i}}${r.slice(p)}`;const l=new RegExp(`this.${c}`,"g");r=r.replace(l,c);let u=a;return a.match(/this\.state\./)&&(u=`state.${a.split(".").pop()}`),{hookState:[],value:`${u}.map((${c}, ${i}) => {\n      return (${r});\n    })`}},parseCondition:(e,t)=>"boolean"==typeof e?`${e} && ${t}`:"string"==typeof e?`${(e=e.replace(/this\./,"")).slice(2,-2)} && ${t}`:void 0,parseProps:a,parseState:e=>`const [state, set${r("state")}] = useState(${o(JSON.parse(e))||null});`,parseLifeCycles:(e,t)=>{let n=[];return!e.lifeCycles._constructor&&t&&(e.lifeCycles._constructor="function _constructor() {}"),Object.keys(e.lifeCycles).forEach(o=>{let{params:r,content:a}=s(e.lifeCycles[o]);switch(a=c(a),o){case"_constructor":t.push(a),n.unshift(`\n          // constructor\n          useState(()=>{\n            ${t.join("\n")}\n          })\n        `);break;case"componentDidMount":n.push(`\n          // componentDidMount\n          useEffect(()=>{\n            ${a}\n          }, [])\n        `);break;case"componentDidUpdate":n.push(`\n          // componentDidUpdate\n          useEffect(()=>{\n            ${a}\n          })\n        `);break;case"componentWillUnMount":n.push(`\n          // componentWillUnMount\n          useEffect(()=>{\n            return ()=>{\n              ${a}\n            }\n          }, [])\n        `)}}),n},replaceState:c,generateCSS:e=>{let t="";for(let o in e){t+=`.${o} {`;for(let r in e[o])t+=`${n=r,n.split(/(?=[A-Z])/).join("-").toLowerCase()}: ${e[o][r]};\n`;t+="}"}var n;return t},getText:e=>{let t="";const n=e=>{"text"===e.componentName.toLowerCase()&&(t+=a(e.props.text||e.text,!0).replace(/\{/g,"${")),e.children&&Array.isArray(e.children)&&e.children.map(e=>{n(e)})};return n(e),t}}},function(e,t,n){const{exportMod:o,exportPage:r}=n(2),{line2Hump:s,transComponentsMap:a}=n(0);e.exports=function(e,t){const n=[],c=750/(t.responsive&&t.responsive.width||750),i=a(t.componentsMap);t.scale=c,t.componentsMap=i,function e(t){const{json:o,scale:r}=t;switch(o.componentName.toLowerCase()){case"block":o.fileName=o.fileName||`block_${o.id.slice(0,6)}`,o.smart&&o.smart.layerProtocol&&o.smart.layerProtocol.module&&o.smart.layerProtocol.module.type&&(o.fileName=o.smart.layerProtocol.module.type.replace(/[@|\/]/g,"")),o.fileName=s(o.fileName),n.push(o)}o.children&&o.children.length>0&&Array.isArray(o.children)&&o.children.forEach(t=>{e({json:t,scale:r})})}({json:e,scale:c});let p=[];n.length>0&&n.forEach(e=>{const n=o(e,t);p=p.concat(n)});const l=r(e,t);return p=p.concat(l),{panelDisplay:p,noTemplate:!0}}},function(e,t,n){const o=n(3),r=n(4);e.exports={exportMod:o,exportPage:r}},function(e,t,n){const{toString:o,existImport:r,parseLoop:s,parseStyle:a,parseFunction:c,parseProps:i,parseState:p,parseLifeCycles:l,replaceState:u,parseCondition:d,generateCSS:m,parseDataSource:f,line2Hump:$,getText:h}=n(0);e.exports=function(e,t){const{prettier:n,scale:y,componentsMap:x}=t,g=e.fileName;let b=[],S=[];const k={},j=[];let C=null,N=[];const v=[];let O=[];const w=[],I=e=>{let t=x[e]||{},n=t.packageName||e;const o=`import ${e} from '${n}'`;r(b,o)||b.push({import:o,package:n,version:t.dependenceVersion||"*"})},E=e=>{const t=e.componentName.toLowerCase(),n=e.props&&e.props.className,o=n?` style={styles.${n}}`:"";let r;n&&(k[n]=a(e.props.style,y));let c="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(c+=` ${t}={${i(e.props[t])}}`),0===["onClick"].indexOf(t)&&(c+=` accessible={true} role="link" aria-label={\`${h(e)}\`}`)}),"link"!==t||c.match("accessible")||(c+=` accessible={true} aria-label={\`${h(e)}\`}`),t){case"text":I("Text");let t=i(e.props.text||e.text,!0);t.match(/this\.props/)&&(t=t.replace(/this\./,"")),r=`<Text${o}${c}>${t||""}</Text>`;break;case"image":if(I("Image"),c.match("onClick")||(c+=" aria-hidden={true}"),e.props.source&&e.props.source.uri)r=`<Image${o}${c} />`;else{let t=i(e.props.src);t=t&&`source={{uri: ${t}}}`||"",r=`<Image${o}${c} ${t} />`}break;case"div":case"view":case"page":case"block":case"component":I("View"),r=e.children&&e.children.length?`<View${o}>${A(e.children)}</View>`:`<View${o} />`;break;default:I(e.componentName),r=e.children&&e.children.length&&Array.isArray(e.children)?`<${componentName}${o}${c}>${A(e.children)}</${componentName}>`:"string"==typeof e.children?`<${componentName}${o}${c} >${e.children}</${componentName}>`:`<${componentName}${o}${c} />`}if(e.loop){const t=s(e.loop,e.loopArgs,r,C);r=t.value,N=N.concat(t.hookState)}return r=u(r),e.condition&&(r=d(e.condition,r)),(e.loop||e.condition)&&(r=`{${r}}`),r},A=e=>{let t="";const n=e.fileName||e.id;if(Array.isArray(e))e.forEach(e=>{t+=A(e)});else{const r=e.componentName.toLowerCase();if(-1!==["page"].indexOf(r)||n===g){const t=[];if(e.state&&(t.push(`state = ${o(e.state)}`),C=o(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:n,content:o}=c(e.methods[t]);v.push(`function ${t}(${n}) {${o}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?w.push(`${e.id}();`):"string"==typeof e.isInit&&w.push(`if (${i(e.isInit)}) { ${e.id}(); }`);const t=f(e,b);v.push(t.value),b=t.imports}),e.dataSource.dataHandler)){const{params:t,content:n}=c(e.dataSource.dataHandler);v.push(`const dataHandler = (${t}) => {${n}}`),w.push("dataHandler()")}e.lifeCycles&&(O=l(e,w)),C&&N.push(p(C))}else if(-1!==["block"].indexOf(r)){let o="";Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(o+=` ${t}={${i(e.props[t])}}`)}),t+=`<${$(n)} ${o} />`,S.push({import:`import ${$(n)} from '../${n}';`})}else t+=E(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{j.push(`const ${e} = ${t.utils[e]}`)}),A(e);const P=E(e),T=P.match("dispatch"),L=n.format(`\n    'use strict';\n    import { createElement, useState, useEffect, memo } from 'rax';\n    ${b.map(e=>e.import).join("\n")}\n    ${S.map(e=>e.import).join("\n")}\n    ${T?"import { IndexContext } from '../../context';":""}\n\n    import styles from './${g}.css';\n\n    ${j.join("\n")}\n    export default memo((props) => {\n      ${N.join("\n")}\n      ${T?"const { state: { txt }, dispatch} = useContext(IndexContext);":""}\n      ${O.join("\n")}\n      ${v.join("\n")}\n      ${P.match(/^\{true\ \&\& /)?`return (<View>${P}</View>)`:`return (${P})`}\n    });\n  `,{parser:"babel",printWidth:120,singleQuote:!0});return[{panelName:`${g}.jsx`,panelValue:L,panelType:"js",panelImports:b},{panelName:`${g}.css`,panelValue:n.format(`${m(k)}`,{parser:"css"}),panelType:"css"}]}},function(e,t,n){const{toString:o,existImport:r,parseLoop:s,parseStyle:a,parseFunction:c,parseProps:i,parseState:p,parseLifeCycles:l,replaceState:u,parseCondition:d,generateCSS:m,parseDataSource:f,line2Hump:$,getText:h}=n(0);e.exports=function(e,t){const{prettier:n,scale:y,componentsMap:x}=t,g=e.fileName||e.id;let b=[],S=[];const k={},j=[];let C=null,N=[];const v=[];let O=[];const w=[],I=e=>{let t=x[e]||{},n=t.packageName||e;const o=`import ${e} from '${n}'`;r(b,o)||b.push({import:o,package:n,version:t.dependenceVersion||"*"})},E=e=>{const t=e.componentName,n=e.componentName.toLowerCase(),o=e.props&&e.props.className,r=o?` style={styles.${o}}`:"";let c;o&&(k[o]=a(e.props.style,y));let p="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(p+=` ${t}={${i(e.props[t])}}`),0===["onClick"].indexOf(t)&&(p+=` accessible={true} aria-label={\`${h(e)}\`}`)}),"link"!==n||p.match("accessible")||(p+=` accessible={true} role="link" aria-label={\`${h(e)}\`}`),n){case"text":I("Text");const n=i(e.props.text||e.text,!0);c=`<Text${r}${p}>${n||""}</Text>`;break;case"image":if(I("Image"),p.match("onClick")||(p+=" aria-hidden={true}"),e.props.source&&e.props.source.uri)c=`<Image${r}${p} />`;else{let t=i(e.props.src);t=t&&`source={{uri: ${t}}}`||"",c=`<Image${r}${p} ${t} />`}break;case"div":case"view":case"page":case"block":case"component":I("View"),c=e.children&&e.children.length?`<View${r}${p}>${A(e.children)}</View>`:`<View${r}${p} />`;break;default:I(e.componentName),c=e.children&&e.children.length&&Array.isArray(e.children)?`<${t}${r}${p}>${A(e.children)}</${t}>`:"string"==typeof e.children?`<${t}${r}${p} >${e.children}</${t}>`:`<${t}${r}${p} />`}if(e.loop){const t=s(e.loop,e.loopArgs,c,C);c=t.value,N=N.concat(t.hookState)}return c=u(c),e.condition&&(c=d(e.condition,c)),(e.loop||e.condition)&&(c=`{${c}}`),c},A=e=>{let t="";if(Array.isArray(e))e.forEach(e=>{t+=A(e)});else{const n=e.componentName.toLowerCase();if(-1!==["page"].indexOf(n)){const t=[];if(e.state&&(t.push(`state = ${o(e.state)}`),C=o(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:n,content:o}=c(e.methods[t]);v.push(`function ${t}(${n}) {${o}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?w.push(`${e.id}();`):"string"==typeof e.isInit&&w.push(`if (${i(e.isInit)}) { ${e.id}(); }`);const t=f(e,b);v.push(t.value),b=t.imports}),e.dataSource.dataHandler)){const{params:t,content:n}=c(e.dataSource.dataHandler);v.push(`const dataHandler = (${t}) => {${n}}`),w.push("dataHandler()")}e.lifeCycles&&(O=l(e,w)),C&&N.push(p(C))}else if(-1!==["block"].indexOf(n)){const n=e.fileName||e.id;let o="";Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(o+=` ${t}={${i(e.props[t])}}`)}),t+=`<${$(n)} ${o} />`,S.push({import:`import ${$(n)} from './${n}';`})}else t+=E(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{j.push(`const ${e} = ${t.utils[e]}`)}),A(e);const P={parser:"babel",printWidth:120,singleQuote:!0},T=E(e),L=n.format("import { createElement, createContext, useReducer } from 'rax';\n\n    const initState = {\n      txt: 'click me' // Get data, trigger proactively useEffect\n    };\n    \n    function UserReducer(state, action) {\n      switch (action.type) {\n        case 'changeTxt':\n          return {\n            ...state,\n            txt: `click me ${action.payload.val}`\n          };\n        default:\n          return state;\n      }\n    }\n    \n    const IndexContext = createContext();\n    \n    const IndexProvider = props => {\n      const [state, dispatch] = useReducer(UserReducer, initState);\n      return (\n        <IndexContext.Provider value={{ state, dispatch }}>\n          {props.children}\n        </IndexContext.Provider>\n      );\n    };\n    \n    export { IndexContext, IndexProvider };\n  ",P),V=T.match("dispatch");return[{panelName:`${g}.jsx`,panelValue:n.format(`\n    'use strict';\n    import { createElement, useState, useEffect } from 'rax';\n    ${b.map(e=>e.import).join("\n")}\n    ${S.map(e=>e.import).join("\n")}\n    import { ${V?"IndexContext, IndexProvider":"IndexProvider"} } from './context';\n    import styles from './${g}.css';\n\n    ${j.join("\n")}\n    export default function Page() {\n      ${N.join("\n")}\n      ${V?"const { state: { txt }, dispatch} = useContext(IndexContext);":""}\n\n      ${O.join("\n")}\n      \n      ${v.join("\n")}\n      return (<IndexProvider>${T}</IndexProvider>)\n    };\n  `,P),panelType:"js",panelImports:b.concat(S)},{panelName:"context.jsx",panelValue:L,panelType:"js",panelImports:[]},{panelName:`${g}.css`,panelValue:n.format(`${m(k)}`,{parser:"css"}),panelType:"css"}]}}]);