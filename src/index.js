module.exports=function(e){var t={};function o(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,o),s.l=!0,s.exports}return o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)o.d(n,s,function(t){return e[t]}.bind(null,s));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){const{exportMod:n,exportPage:s}=o(1);e.exports=function(e,t){const o=[];!function e(t){switch(t.componentName.toLowerCase()){case"block":o.push(t)}t.children&&t.children.length>0&&t.children.forEach(t=>{e(t)})}(e);let r=[];o.length>0&&o.forEach(e=>{const o=n(e,t);r=r.concat(o)});const a=s(e,t);return r=r.concat(a),{panelDisplay:r,noTemplate:!0}}},function(e,t,o){const{toString:n,parseLoop:s,parseStyle:r,parseFunction:a,parseProps:i,parseCondition:c,generateCSS:p,parseDataSource:l,line2Hump:u}=o(2);e.exports={exportMod:function(e,t){const{prettier:o}=t,u=e.fileName||e.id;let f=[];const d={},m=[];let h=null,$=[];const y=[],x=[],g=e=>{const t=e.componentName.toLowerCase(),o=e.props&&e.props.className,n=o?` style={styles.${o}}`:"";let a;o&&(d[o]=r(e.props.style));let p="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(p+=` ${t}={${i(e.props[t])}}`)}),t){case"text":-1===f.indexOf("import Text from 'rax-text'")&&f.push("import Text from 'rax-text'");const t=i(e.props.text,!0);a=`<Text${n}${p}>${t}</Text>`;break;case"image":-1===f.indexOf("import Image from 'rax-image'")&&f.push("import Image from 'rax-image'");const o=i(e.props.src);a=`<Image${n}${p} source={{uri: ${o}}} />`;break;case"div":case"page":case"block":case"component":-1===f.indexOf("import View from 'rax-view'")&&f.push("import View from 'rax-view'"),a=e.children&&e.children.length?`<View${n}${p}>${b(e.children)}</View>`:`<View${n}${p} />`}if(e.loop){const t=s(e.loop,e.loopArgs,a,h);a=t.value,$=$.concat(t.hookState)}return e.condition&&(a=c(e.condition.replace(/this\./,""),a)),(e.loop||e.condition)&&(a=`{${a}}`),a},b=e=>{let t="";if(Array.isArray(e))e.forEach(e=>{t+=b(e)});else{const o=e.componentName.toLowerCase();if(-1!==["page"].indexOf(o)){const t=[],o=[];if(e.state&&(t.push(`state = ${n(e.state)}`),h=n(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:o,content:n}=a(e.methods[t]);y.push(`function ${t}(${o}) {${n}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?x.push(`${e.id}();`):"string"==typeof e.isInit&&x.push(`if (${i(e.isInit)}) { ${e.id}(); }`);const t=l(e,f);y.push(t.value),f=t.imports}),e.dataSource.dataHandler)){const{params:t,content:o}=a(e.dataSource.dataHandler);y.push(`dataHandler(${t}) {${o}}`),x.push("dataHandler()")}e.lifeCycles&&(e.lifeCycles._constructor||o.push(`constructor(props, context) { super(); ${x.join("\n")}}`),Object.keys(e.lifeCycles).forEach(t=>{const{params:n,content:s}=a(e.lifeCycles[t]);"_constructor"===t?x.push(s):o.push(`${t}(${n}) {${s}}`)}))}else t+=g(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{m.push(`const ${e} = ${t.utils[e]}`)}),b(e);const j=g(e);return[{panelName:`${u}.jsx`,panelValue:o.format(`\n    'use strict';\n    import { createElement, useState, useEffect, useRef } from 'rax';\n    ${f.join("\n")}\n    import styles from './${u}.css';\n\n    ${m.join("\n")}\n    export default function Mod() {\n      ${$.join("\n")}\n      const hasCalled = useRef(false);\n      useEffect(() => {\n        if (!hasCalled.current) {\n          hasCalled.current = true;\n          ${x.join("\n")}\n        }\n      })\n      ${y.join("\n")}\n      return (${j})\n    };\n  `,{parser:"babel",printWidth:120,singleQuote:!0}),panelType:"js",panelImports:f},{panelName:`${u}.css`,panelValue:o.format(`${p(d)}`,{parser:"css"}),panelType:"css"}]},exportPage:function(e,t){const{prettier:o}=t,f=e.fileName||e.id;let d=[],m=[];const h={},$=[];let y=null,x=[];const g=[],b=[],j=e=>{const t=e.componentName.toLowerCase(),o=e.props&&e.props.className,n=o?` style={styles.${o}}`:"";let a;o&&(h[o]=r(e.props.style));let p="";switch(Object.keys(e.props).forEach(t=>{-1===["className","style","text","src","key"].indexOf(t)&&(p+=` ${t}={${i(e.props[t])}}`)}),t){case"text":-1===d.indexOf("import Text from 'rax-text'")&&d.push("import Text from 'rax-text'");const t=i(e.props.text,!0);a=`<Text${n}${p}>${t}</Text>`;break;case"image":-1===d.indexOf("import Image from 'rax-image'")&&d.push("import Image from 'rax-image'");const o=i(e.props.src);a=`<Image${n}${p} source={{uri: ${o}}} />`;break;case"div":case"page":case"block":case"component":-1===d.indexOf("import View from 'rax-view'")&&d.push("import View from 'rax-view'"),a=e.children&&e.children.length?`<View${n}${p}>${S(e.children)}</View>`:`<View${n}${p} />`}if(e.loop){const t=s(e.loop,e.loopArgs,a,y);a=t.value,x=x.concat(t.hookState)}return e.condition&&(a=c(e.condition.replace(/this\./,""),a)),(e.loop||e.condition)&&(a=`{${a}}`),a},S=e=>{let t="";if(Array.isArray(e))e.forEach(e=>{t+=S(e)});else{const o=e.componentName.toLowerCase();if(-1!==["page"].indexOf(o)){const t=[],o=[];if(e.state&&(t.push(`state = ${n(e.state)}`),y=n(e.state)),e.methods&&Object.keys(e.methods).forEach(t=>{const{params:o,content:n}=a(e.methods[t]);g.push(`function ${t}(${o}) {${n}}`)}),e.dataSource&&Array.isArray(e.dataSource.list)&&(e.dataSource.list.forEach(e=>{"boolean"==typeof e.isInit&&e.isInit?b.push(`${e.id}();`):"string"==typeof e.isInit&&b.push(`if (${i(e.isInit)}) { ${e.id}(); }`);const t=l(e,d);g.push(t.value),d=t.imports}),e.dataSource.dataHandler)){const{params:t,content:o}=a(e.dataSource.dataHandler);g.push(`dataHandler(${t}) {${o}}`),b.push("dataHandler()")}e.lifeCycles&&(e.lifeCycles._constructor||o.push(`constructor(props, context) { super(); ${b.join("\n")}}`),Object.keys(e.lifeCycles).forEach(t=>{const{params:n,content:s}=a(e.lifeCycles[t]);"_constructor"===t?b.push(s):o.push(`${t}(${n}) {${s}}`)}))}else if(-1!==["block"].indexOf(o)){const o=e.fileName||e.id;t+=`<${u(o)} />`,m.push(`import ${u(o)} from './${o}';`)}else t+=j(e)}return t};t.utils&&Object.keys(t.utils).forEach(e=>{$.push(`const ${e} = ${t.utils[e]}`)}),S(e);const O=j(e);return[{panelName:`${f}.jsx`,panelValue:o.format(`\n    'use strict';\n    import { createElement, useState, useEffect, useRef } from 'rax';\n    ${d.join("\n")}\n    ${m.join("\n")}\n    import styles from './${f}.css';\n    \n\n    ${$.join("\n")}\n    export default function Page() {\n      ${x.join("\n")}\n      const hasCalled = useRef(false);\n      useEffect(() => {\n        if (!hasCalled.current) {\n          hasCalled.current = true;\n          ${b.join("\n")}\n        }\n      })\n      ${g.join("\n")}\n      return (${O})\n    };\n  `,{parser:"babel",printWidth:120,singleQuote:!0}),panelType:"js",panelImports:d.concat(m)},{panelName:`${f}.css`,panelValue:o.format(`${p(h)}`,{parser:"css"}),panelType:"css"}]}}},function(e,t){const o=e=>/^\{\{.*\}\}$/.test(e),n=e=>"[object Function]"==={}.toString.call(e)?e.toString():"string"==typeof e?e:"object"==typeof e?JSON.stringify(e,(e,t)=>"function"==typeof t?t.toString():t):String(e),s=e=>e.charAt(0).toUpperCase()+e.slice(1),r=e=>{const t=e.toString();return{params:t.match(/\([^\(\)]*\)/)[0].slice(1,-1),content:t.slice(t.indexOf("{")+1,t.lastIndexOf("}"))}},a=(e,t)=>{if("string"==typeof e)return o(e)?t?e.slice(1,-1):e.slice(2,-2):t?e:`'${e}'`;if("function"==typeof e){const{params:t,content:o}=r(e);return`(${t}) => {${o}}`}};e.exports={isExpression:o,toString:n,line2Hump:e=>e=(e=e.replace(/[_|-](\w)/g,(e,t)=>t.toUpperCase())).charAt(0).toUpperCase()+e.slice(1),toUpperCaseStart:s,parseStyle:e=>{for(let t in e)switch(t){case"fontSize":case"marginTop":case"marginBottom":case"paddingTop":case"paddingBottom":case"height":case"top":case"bottom":case"width":case"maxWidth":case"left":case"right":case"paddingRight":case"paddingLeft":case"marginLeft":case"marginRight":case"lineHeight":case"borderBottomRightRadius":case"borderBottomLeftRadius":case"borderTopRightRadius":case"borderTopLeftRadius":case"borderRadius":e[t]=parseInt(e[t])+"rpx"}return e},parseDataSource:(e,t)=>{const s=e.id,{uri:i,method:c,params:p}=e.options,l=e.type;let u={};switch(l){case"fetch":-1===t.indexOf("import {fetch} from whatwg-fetch")&&t.push("import {fetch} from 'whatwg-fetch'"),u={method:c};break;case"jsonp":-1===t.indexOf("import {fetchJsonp} from fetch-jsonp")&&t.push("import jsonp from 'fetch-jsonp'")}Object.keys(e.options).forEach(t=>{-1===["uri","method","params"].indexOf(t)&&(u[t]=n(e.options[t]))}),u=p?`${n(u).slice(0,-1)} ,body: ${o(p)?a(p):n(p)}}`:n(u);let f=`{\n  ${l}(${a(i)}, ${n(u)})\n    .then((response) => response.json())\n`;if(e.dataHandler){const{params:t,content:o}=r(e.dataHandler);f+=`.then((${t}) => {${o}})\n    .catch((e) => {\n      console.log('error', e);\n    })\n  `}return f+="}",{value:`function ${s}() ${f}`,imports:t}},parseFunction:r,parseLoop:(e,t,r,a)=>{let i,c=t&&t[0]||"item",p=t&&t[1]||"index";Array.isArray(e)?i=n(e):o(e)&&(i=e.slice(2,-2));const l=r.match(/^<.+?\s/)[0].length;r=`${r.slice(0,l)} key={${p}}${r.slice(l)}`;const u=new RegExp(`this.${c}`,"g");r=r.replace(u,c);let f=i;i.match(/this\.state\./)&&(f=i.split(".").pop());const d=[];return d.push(`const [${f}, set${s(f)}] = useState(${n(JSON.parse(a)[f])||null});`),{hookState:d,value:`${f}.map((${c}, ${p}) => {\n      return (${r});\n    })`}},parseCondition:(e,t)=>"boolean"==typeof e?`${e} && ${t}`:"string"==typeof e?`${e.slice(2,-2)} && ${t}`:void 0,parseProps:a,generateCSS:e=>{let t="";for(let n in e){t+=`.${n} {`;for(let s in e[n])t+=`${o=s,o.split(/(?=[A-Z])/).join("-").toLowerCase()}: ${e[n][s]};\n`;t+="}"}var o;return t}}}]);