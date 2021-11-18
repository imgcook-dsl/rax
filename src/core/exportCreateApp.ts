import { IPanelDisplay } from './interface';

import { CSS_TYPE, OUTPUT_TYPE, prettierJsOpt, prettierHtmlOpt, prettierCssOpt, prettierJsonOpt } from './consts';


export default function exportCreateApp(schema, option): IPanelDisplay[] {
  const folderName = schema.folderName;
  const {
    dependencies,
    dslConfig,
    _,
    prettier,
  } = option;

  let panelValue = '';
  const panelDisplay: IPanelDisplay[] = [];

  // 导出 app.js
  panelValue = `// MPA 模式下该文件无效
  import { runApp } from 'rax-app';
  
  const appConfig = {};
  runApp(appConfig);
  `
  panelDisplay.push({
    panelName: `app.${ dslConfig.useTypescript?'tsx': 'jsx'}`,
    panelType:  dslConfig.useTypescript?'tsx': 'jsx',
    panelValue:  prettier.format(panelValue, prettierJsOpt),
    folder: option.folder || '',
  });

  // 导出 app.json
  panelValue = `{
    "routes": [
      {
        "path": "/",
        "source": "${folderName}",
        "spm": "spm-b"
      }
    ],
    "window": {
      "title": "Rax App"
    },
    "builtInLibrary": {
      "lib-mtop": false
    },
    "spm": "spm-a"
  }`;

  panelDisplay.push({
    panelName: `app.json`,
    panelType:  'json',
    panelValue:  prettier.format(panelValue, prettierJsonOpt),
    folder: option.folder || '',
  });



  // dependencies
  let packDependencies = dependencies;

  // if (schema.imgcook && schema.imgcook.dependencies) {
  //   schema.imgcook.dependencies.forEach(({packageRax1, versionRax1}) => {
  //     packDependencies[packageRax1] = versionRax1
  //   })
  // }


  // package.json
  const packageJson = {
    "name": "@rax-materials/scaffolds-app-js",
    "author": "rax",
    "description": "Rax 无线跨端应用工程，使用 JavaScript。",
    "version": "0.1.0",
    "scripts": {
      "start": "rax-app start",
      "build": "rax-app build",
      "eslint": "eslint --ext .js,.jsx ./",
      "stylelint": "stylelint \"**/*.{css,scss,less}\"",
      "prettier": "prettier **/* --write",
      "lint": "npm run eslint && npm run stylelint"
    },
    "dependencies": {
      "@ali/universal-event-tracking": "^1.0.0",
      "rax": "^1.1.0",
      "rax-document": "^0.1.0",
      "rax-image": "^2.0.0",
      "rax-link": "^1.0.1",
      "rax-picture": "^2.2.1",
      "rax-text": "^2.0.0",
      "rax-view": "^2.0.0",
      ...packDependencies
    },
    "devDependencies": {
      "@iceworks/spec": "^1.0.0",
      "rax-app": "^3.0.0",
      "eslint": "^6.8.0",
      "prettier": "^2.1.2",
      "stylelint": "^13.7.2",
      "@ali/build-plugin-rax-app-def": "^3.0.0",
      "@ali/build-plugin-event-tracking-register": "^1.0.0"
    },
    "private": true,
    "originTemplate": "@rax-materials/scaffolds-app-js"
  }
  

  panelValue = JSON.stringify(packageJson, null, 4)
  panelDisplay.push({
    panelName: `package.json`,
    panelType: 'json',
    panelValue:  prettier.format(panelValue, prettierJsonOpt),
    folder: option.folder || '',
  });


  panelValue = `{
    "inlineStyle": false,
    "targets": [
      "web"
    ],
    "plugins": [
      "@ali/build-plugin-rax-app-def",
      [
        "@ali/build-plugin-event-tracking-register",
        {
          "goldlog": false
        }
      ]
    ]
  }`
  panelDisplay.push({
    panelName: `build.json`,
    panelType: 'json',
    panelValue: prettier.format(panelValue, prettierJsonOpt),
    folder: option.folder || '',
  });


  panelValue = `{
    "type": "rax",
    "builder": "@ali/builder-rax-v1",
    "info": {
      "raxVersion": "1.x"
    }}
  `
  panelDisplay.push({
    panelName: `abc.json`,
    panelType: 'json',
    panelValue: prettier.format(panelValue, prettierJsonOpt),
    folder: option.folder || '',
  });



  panelValue = `{
    "compilerOptions": {
      "baseUrl": ".",
      "jsx": "react",
      "paths": {
        "@/*": ["./src/*"],
        "rax-app": [".rax/index.ts"]
      }
    }
  }  
   `
  panelDisplay.push({
    panelName: `jsconfig.json`,
    panelType: 'json',
    panelValue: prettier.format(panelValue, prettierJsonOpt),
    folder: option.folder || '',
  });


  if (dslConfig.useTypescript) {
    panelValue = `{
      "compilerOptions": {
        "target": "es5",
        "lib": [
          "dom",
          "dom.iterable",
          "esnext"
        ],
        "allowJs": true,
        "skipLibCheck": true,
        "esModuleInterop": true,
        "allowSyntheticDefaultImports": true,
        "strict": true,
        "forceConsistentCasingInFileNames": true,
        "noFallthroughCasesInSwitch": true,
        "module": "esnext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx"
      },
      "include": [
        "src"
      ]
    }
     `
    panelDisplay.push({
      panelName: `tsconfig.json`,
      panelType: 'json',
      panelValue: prettier.format(panelValue, prettierJsonOpt),
      folder: option.folder || '',
    });
  }


  return panelDisplay;
}
