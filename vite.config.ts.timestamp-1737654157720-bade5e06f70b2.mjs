// vite.generated.ts
import path from "path";
import { existsSync as existsSync5, mkdirSync as mkdirSync2, readdirSync as readdirSync2, readFileSync as readFileSync4, writeFileSync as writeFileSync2 } from "fs";
import { createHash } from "crypto";
import * as net from "net";

// target/plugins/application-theme-plugin/theme-handle.js
import { existsSync as existsSync3, readFileSync as readFileSync2 } from "fs";
import { resolve as resolve3 } from "path";

// target/plugins/application-theme-plugin/theme-generator.js
import { globSync as globSync2 } from "file:///Users/mirakhreis/team1.frontend1/node_modules/glob/dist/esm/index.js";
import { resolve as resolve2, basename as basename2 } from "path";
import { existsSync as existsSync2, readFileSync, writeFileSync } from "fs";

// target/plugins/application-theme-plugin/theme-copy.js
import { readdirSync, statSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { resolve, basename, relative, extname } from "path";
import { globSync } from "file:///Users/mirakhreis/team1.frontend1/node_modules/glob/dist/esm/index.js";
var ignoredFileExtensions = [".css", ".js", ".json"];
function copyThemeResources(themeFolder2, projectStaticAssetsOutputFolder, logger) {
  const staticAssetsThemeFolder = resolve(projectStaticAssetsOutputFolder, "themes", basename(themeFolder2));
  const collection = collectFolders(themeFolder2, logger);
  if (collection.files.length > 0) {
    mkdirSync(staticAssetsThemeFolder, { recursive: true });
    collection.directories.forEach((directory) => {
      const relativeDirectory = relative(themeFolder2, directory);
      const targetDirectory = resolve(staticAssetsThemeFolder, relativeDirectory);
      mkdirSync(targetDirectory, { recursive: true });
    });
    collection.files.forEach((file) => {
      const relativeFile = relative(themeFolder2, file);
      const targetFile = resolve(staticAssetsThemeFolder, relativeFile);
      copyFileIfAbsentOrNewer(file, targetFile, logger);
    });
  }
}
function collectFolders(folderToCopy, logger) {
  const collection = { directories: [], files: [] };
  logger.trace("files in directory", readdirSync(folderToCopy));
  readdirSync(folderToCopy).forEach((file) => {
    const fileToCopy = resolve(folderToCopy, file);
    try {
      if (statSync(fileToCopy).isDirectory()) {
        logger.debug("Going through directory", fileToCopy);
        const result = collectFolders(fileToCopy, logger);
        if (result.files.length > 0) {
          collection.directories.push(fileToCopy);
          logger.debug("Adding directory", fileToCopy);
          collection.directories.push.apply(collection.directories, result.directories);
          collection.files.push.apply(collection.files, result.files);
        }
      } else if (!ignoredFileExtensions.includes(extname(fileToCopy))) {
        logger.debug("Adding file", fileToCopy);
        collection.files.push(fileToCopy);
      }
    } catch (error) {
      handleNoSuchFileError(fileToCopy, error, logger);
    }
  });
  return collection;
}
function copyStaticAssets(themeName, themeProperties, projectStaticAssetsOutputFolder, logger) {
  const assets = themeProperties["assets"];
  if (!assets) {
    logger.debug("no assets to handle no static assets were copied");
    return;
  }
  mkdirSync(projectStaticAssetsOutputFolder, {
    recursive: true
  });
  const missingModules = checkModules(Object.keys(assets));
  if (missingModules.length > 0) {
    throw Error(
      "Missing npm modules '" + missingModules.join("', '") + "' for assets marked in 'theme.json'.\nInstall package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
    );
  }
  Object.keys(assets).forEach((module) => {
    const copyRules = assets[module];
    Object.keys(copyRules).forEach((copyRule) => {
      const nodeSources = resolve("node_modules/", module, copyRule);
      const files = globSync(nodeSources, { nodir: true });
      const targetFolder = resolve(projectStaticAssetsOutputFolder, "themes", themeName, copyRules[copyRule]);
      mkdirSync(targetFolder, {
        recursive: true
      });
      files.forEach((file) => {
        const copyTarget = resolve(targetFolder, basename(file));
        copyFileIfAbsentOrNewer(file, copyTarget, logger);
      });
    });
  });
}
function checkModules(modules) {
  const missing = [];
  modules.forEach((module) => {
    if (!existsSync(resolve("node_modules/", module))) {
      missing.push(module);
    }
  });
  return missing;
}
function copyFileIfAbsentOrNewer(fileToCopy, copyTarget, logger) {
  try {
    if (!existsSync(copyTarget) || statSync(copyTarget).mtime < statSync(fileToCopy).mtime) {
      logger.trace("Copying: ", fileToCopy, "=>", copyTarget);
      copyFileSync(fileToCopy, copyTarget);
    }
  } catch (error) {
    handleNoSuchFileError(fileToCopy, error, logger);
  }
}
function handleNoSuchFileError(file, error, logger) {
  if (error.code === "ENOENT") {
    logger.warn("Ignoring not existing file " + file + ". File may have been deleted during theme processing.");
  } else {
    throw error;
  }
}

// target/plugins/application-theme-plugin/theme-generator.js
var themeComponentsFolder = "components";
var documentCssFilename = "document.css";
var stylesCssFilename = "styles.css";
var CSSIMPORT_COMMENT = "CSSImport end";
var headerImport = `import 'construct-style-sheets-polyfill';
`;
function writeThemeFiles(themeFolder2, themeName, themeProperties, options) {
  const productionMode = !options.devMode;
  const useDevServerOrInProductionMode = !options.useDevBundle;
  const outputFolder = options.frontendGeneratedFolder;
  const styles = resolve2(themeFolder2, stylesCssFilename);
  const documentCssFile = resolve2(themeFolder2, documentCssFilename);
  const autoInjectComponents = themeProperties.autoInjectComponents ?? true;
  const autoInjectGlobalCssImports = themeProperties.autoInjectGlobalCssImports ?? false;
  const globalFilename = "theme-" + themeName + ".global.generated.js";
  const componentsFilename = "theme-" + themeName + ".components.generated.js";
  const themeFilename = "theme-" + themeName + ".generated.js";
  let themeFileContent = headerImport;
  let globalImportContent = "// When this file is imported, global styles are automatically applied\n";
  let componentsFileContent = "";
  var componentsFiles;
  if (autoInjectComponents) {
    componentsFiles = globSync2("*.css", {
      cwd: resolve2(themeFolder2, themeComponentsFolder),
      nodir: true
    });
    if (componentsFiles.length > 0) {
      componentsFileContent += "import { unsafeCSS, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles';\n";
    }
  }
  if (themeProperties.parent) {
    themeFileContent += `import { applyTheme as applyBaseTheme } from './theme-${themeProperties.parent}.generated.js';
`;
  }
  themeFileContent += `import { injectGlobalCss } from 'Frontend/generated/jar-resources/theme-util.js';
`;
  themeFileContent += `import { webcomponentGlobalCssInjector } from 'Frontend/generated/jar-resources/theme-util.js';
`;
  themeFileContent += `import './${componentsFilename}';
`;
  themeFileContent += `let needsReloadOnChanges = false;
`;
  const imports = [];
  const componentCssImports = [];
  const globalFileContent = [];
  const globalCssCode = [];
  const shadowOnlyCss = [];
  const componentCssCode = [];
  const parentTheme = themeProperties.parent ? "applyBaseTheme(target);\n" : "";
  const parentThemeGlobalImport = themeProperties.parent ? `import './theme-${themeProperties.parent}.global.generated.js';
` : "";
  const themeIdentifier = "_vaadintheme_" + themeName + "_";
  const lumoCssFlag = "_vaadinthemelumoimports_";
  const globalCssFlag = themeIdentifier + "globalCss";
  const componentCssFlag = themeIdentifier + "componentCss";
  if (!existsSync2(styles)) {
    if (productionMode) {
      throw new Error(`styles.css file is missing and is needed for '${themeName}' in folder '${themeFolder2}'`);
    }
    writeFileSync(
      styles,
      "/* Import your application global css files here or add the styles directly to this file */",
      "utf8"
    );
  }
  let filename = basename2(styles);
  let variable = camelCase(filename);
  const lumoImports = themeProperties.lumoImports || ["typography", "color", "spacing", "badge", "utility"];
  if (lumoImports) {
    lumoImports.forEach((lumoImport) => {
      imports.push(`import { ${lumoImport} } from '@vaadin/vaadin-lumo-styles/${lumoImport}.js';
`);
      if (lumoImport === "utility" || lumoImport === "badge" || lumoImport === "typography" || lumoImport === "color") {
        globalFileContent.push(`import '@vaadin/vaadin-lumo-styles/${lumoImport}-global.js';
`);
      }
    });
    lumoImports.forEach((lumoImport) => {
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${lumoImport}.cssText, '', target, true));
`);
    });
  }
  if (useDevServerOrInProductionMode) {
    globalFileContent.push(parentThemeGlobalImport);
    globalFileContent.push(`import 'themes/${themeName}/${filename}';
`);
    imports.push(`import ${variable} from 'themes/${themeName}/${filename}?inline';
`);
    shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable}.toString(), '', target));
    `);
  }
  if (existsSync2(documentCssFile)) {
    filename = basename2(documentCssFile);
    variable = camelCase(filename);
    if (useDevServerOrInProductionMode) {
      globalFileContent.push(`import 'themes/${themeName}/${filename}';
`);
      imports.push(`import ${variable} from 'themes/${themeName}/${filename}?inline';
`);
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable}.toString(),'', document));
    `);
    }
  }
  let i = 0;
  if (themeProperties.documentCss) {
    const missingModules = checkModules(themeProperties.documentCss);
    if (missingModules.length > 0) {
      throw Error(
        "Missing npm modules or files '" + missingModules.join("', '") + "' for documentCss marked in 'theme.json'.\nInstall or update package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
      );
    }
    themeProperties.documentCss.forEach((cssImport) => {
      const variable2 = "module" + i++;
      imports.push(`import ${variable2} from '${cssImport}?inline';
`);
      globalCssCode.push(`if(target !== document) {
        removers.push(injectGlobalCss(${variable2}.toString(), '', target));
    }
    `);
      globalCssCode.push(
        `removers.push(injectGlobalCss(${variable2}.toString(), '${CSSIMPORT_COMMENT}', document));
    `
      );
    });
  }
  if (themeProperties.importCss) {
    const missingModules = checkModules(themeProperties.importCss);
    if (missingModules.length > 0) {
      throw Error(
        "Missing npm modules or files '" + missingModules.join("', '") + "' for importCss marked in 'theme.json'.\nInstall or update package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
      );
    }
    themeProperties.importCss.forEach((cssPath) => {
      const variable2 = "module" + i++;
      globalFileContent.push(`import '${cssPath}';
`);
      imports.push(`import ${variable2} from '${cssPath}?inline';
`);
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable2}.toString(), '${CSSIMPORT_COMMENT}', target));
`);
    });
  }
  if (autoInjectComponents) {
    componentsFiles.forEach((componentCss) => {
      const filename2 = basename2(componentCss);
      const tag = filename2.replace(".css", "");
      const variable2 = camelCase(filename2);
      componentCssImports.push(
        `import ${variable2} from 'themes/${themeName}/${themeComponentsFolder}/${filename2}?inline';
`
      );
      const componentString = `registerStyles(
        '${tag}',
        unsafeCSS(${variable2}.toString())
      );
      `;
      componentCssCode.push(componentString);
    });
  }
  themeFileContent += imports.join("");
  const themeFileApply = `
  let themeRemovers = new WeakMap();
  let targets = [];

  export const applyTheme = (target) => {
    const removers = [];
    if (target !== document) {
      ${shadowOnlyCss.join("")}
      ${autoInjectGlobalCssImports ? `
        webcomponentGlobalCssInjector((css) => {
          removers.push(injectGlobalCss(css, '', target));
        });
        ` : ""}
    }
    ${parentTheme}
    ${globalCssCode.join("")}

    if (import.meta.hot) {
      targets.push(new WeakRef(target));
      themeRemovers.set(target, removers);
    }

  }

`;
  componentsFileContent += `
${componentCssImports.join("")}

if (!document['${componentCssFlag}']) {
  ${componentCssCode.join("")}
  document['${componentCssFlag}'] = true;
}

if (import.meta.hot) {
  import.meta.hot.accept((module) => {
    window.location.reload();
  });
}

`;
  themeFileContent += themeFileApply;
  themeFileContent += `
if (import.meta.hot) {
  import.meta.hot.accept((module) => {

    if (needsReloadOnChanges) {
      window.location.reload();
    } else {
      targets.forEach(targetRef => {
        const target = targetRef.deref();
        if (target) {
          themeRemovers.get(target).forEach(remover => remover())
          module.applyTheme(target);
        }
      })
    }
  });

  import.meta.hot.on('vite:afterUpdate', (update) => {
    document.dispatchEvent(new CustomEvent('vaadin-theme-updated', { detail: update }));
  });
}

`;
  globalImportContent += `
${globalFileContent.join("")}
`;
  writeIfChanged(resolve2(outputFolder, globalFilename), globalImportContent);
  writeIfChanged(resolve2(outputFolder, themeFilename), themeFileContent);
  writeIfChanged(resolve2(outputFolder, componentsFilename), componentsFileContent);
}
function writeIfChanged(file, data) {
  if (!existsSync2(file) || readFileSync(file, { encoding: "utf-8" }) !== data) {
    writeFileSync(file, data);
  }
}
function camelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, "").replace(/\.|\-/g, "");
}

// target/plugins/application-theme-plugin/theme-handle.js
var nameRegex = /theme-(.*)\.generated\.js/;
var prevThemeName = void 0;
var firstThemeName = void 0;
function processThemeResources(options, logger) {
  const themeName = extractThemeName(options.frontendGeneratedFolder);
  if (themeName) {
    if (!prevThemeName && !firstThemeName) {
      firstThemeName = themeName;
    } else if (prevThemeName && prevThemeName !== themeName && firstThemeName !== themeName || !prevThemeName && firstThemeName !== themeName) {
      const warning = `Attention: Active theme is switched to '${themeName}'.`;
      const description = `
      Note that adding new style sheet files to '/themes/${themeName}/components', 
      may not be taken into effect until the next application restart.
      Changes to already existing style sheet files are being reloaded as before.`;
      logger.warn("*******************************************************************");
      logger.warn(warning);
      logger.warn(description);
      logger.warn("*******************************************************************");
    }
    prevThemeName = themeName;
    findThemeFolderAndHandleTheme(themeName, options, logger);
  } else {
    prevThemeName = void 0;
    logger.debug("Skipping Vaadin application theme handling.");
    logger.trace("Most likely no @Theme annotation for application or only themeClass used.");
  }
}
function findThemeFolderAndHandleTheme(themeName, options, logger) {
  let themeFound = false;
  for (let i = 0; i < options.themeProjectFolders.length; i++) {
    const themeProjectFolder = options.themeProjectFolders[i];
    if (existsSync3(themeProjectFolder)) {
      logger.debug("Searching themes folder '" + themeProjectFolder + "' for theme '" + themeName + "'");
      const handled = handleThemes(themeName, themeProjectFolder, options, logger);
      if (handled) {
        if (themeFound) {
          throw new Error(
            "Found theme files in '" + themeProjectFolder + "' and '" + themeFound + "'. Theme should only be available in one folder"
          );
        }
        logger.debug("Found theme files from '" + themeProjectFolder + "'");
        themeFound = themeProjectFolder;
      }
    }
  }
  if (existsSync3(options.themeResourceFolder)) {
    if (themeFound && existsSync3(resolve3(options.themeResourceFolder, themeName))) {
      throw new Error(
        "Theme '" + themeName + `'should not exist inside a jar and in the project at the same time
Extending another theme is possible by adding { "parent": "my-parent-theme" } entry to the theme.json file inside your theme folder.`
      );
    }
    logger.debug(
      "Searching theme jar resource folder '" + options.themeResourceFolder + "' for theme '" + themeName + "'"
    );
    handleThemes(themeName, options.themeResourceFolder, options, logger);
    themeFound = true;
  }
  return themeFound;
}
function handleThemes(themeName, themesFolder, options, logger) {
  const themeFolder2 = resolve3(themesFolder, themeName);
  if (existsSync3(themeFolder2)) {
    logger.debug("Found theme ", themeName, " in folder ", themeFolder2);
    const themeProperties = getThemeProperties(themeFolder2);
    if (themeProperties.parent) {
      const found = findThemeFolderAndHandleTheme(themeProperties.parent, options, logger);
      if (!found) {
        throw new Error(
          "Could not locate files for defined parent theme '" + themeProperties.parent + "'.\nPlease verify that dependency is added or theme folder exists."
        );
      }
    }
    copyStaticAssets(themeName, themeProperties, options.projectStaticAssetsOutputFolder, logger);
    copyThemeResources(themeFolder2, options.projectStaticAssetsOutputFolder, logger);
    writeThemeFiles(themeFolder2, themeName, themeProperties, options);
    return true;
  }
  return false;
}
function getThemeProperties(themeFolder2) {
  const themePropertyFile = resolve3(themeFolder2, "theme.json");
  if (!existsSync3(themePropertyFile)) {
    return {};
  }
  const themePropertyFileAsString = readFileSync2(themePropertyFile);
  if (themePropertyFileAsString.length === 0) {
    return {};
  }
  return JSON.parse(themePropertyFileAsString);
}
function extractThemeName(frontendGeneratedFolder) {
  if (!frontendGeneratedFolder) {
    throw new Error(
      "Couldn't extract theme name from 'theme.js', because the path to folder containing this file is empty. Please set the a correct folder path in ApplicationThemePlugin constructor parameters."
    );
  }
  const generatedThemeFile = resolve3(frontendGeneratedFolder, "theme.js");
  if (existsSync3(generatedThemeFile)) {
    const themeName = nameRegex.exec(readFileSync2(generatedThemeFile, { encoding: "utf8" }))[1];
    if (!themeName) {
      throw new Error("Couldn't parse theme name from '" + generatedThemeFile + "'.");
    }
    return themeName;
  } else {
    return "";
  }
}

// target/plugins/theme-loader/theme-loader-utils.js
import { existsSync as existsSync4, readFileSync as readFileSync3 } from "fs";
import { resolve as resolve4, basename as basename3 } from "path";
import { globSync as globSync3 } from "file:///Users/mirakhreis/team1.frontend1/node_modules/glob/dist/esm/index.js";
var urlMatcher = /(url\(\s*)(\'|\")?(\.\/|\.\.\/)((?:\3)*)?(\S*)(\2\s*\))/g;
function assetsContains(fileUrl, themeFolder2, logger) {
  const themeProperties = getThemeProperties2(themeFolder2);
  if (!themeProperties) {
    logger.debug("No theme properties found.");
    return false;
  }
  const assets = themeProperties["assets"];
  if (!assets) {
    logger.debug("No defined assets in theme properties");
    return false;
  }
  for (let module of Object.keys(assets)) {
    const copyRules = assets[module];
    for (let copyRule of Object.keys(copyRules)) {
      if (fileUrl.startsWith(copyRules[copyRule])) {
        const targetFile = fileUrl.replace(copyRules[copyRule], "");
        const files = globSync3(resolve4("node_modules/", module, copyRule), { nodir: true });
        for (let file of files) {
          if (file.endsWith(targetFile)) return true;
        }
      }
    }
  }
  return false;
}
function getThemeProperties2(themeFolder2) {
  const themePropertyFile = resolve4(themeFolder2, "theme.json");
  if (!existsSync4(themePropertyFile)) {
    return {};
  }
  const themePropertyFileAsString = readFileSync3(themePropertyFile);
  if (themePropertyFileAsString.length === 0) {
    return {};
  }
  return JSON.parse(themePropertyFileAsString);
}
function rewriteCssUrls(source, handledResourceFolder, themeFolder2, logger, options) {
  source = source.replace(urlMatcher, function(match, url, quoteMark, replace2, additionalDotSegments, fileUrl, endString) {
    let absolutePath = resolve4(handledResourceFolder, replace2, additionalDotSegments || "", fileUrl);
    let existingThemeResource = absolutePath.startsWith(themeFolder2) && existsSync4(absolutePath);
    if (!existingThemeResource && additionalDotSegments) {
      absolutePath = resolve4(handledResourceFolder, replace2, fileUrl);
      existingThemeResource = absolutePath.startsWith(themeFolder2) && existsSync4(absolutePath);
    }
    const isAsset = assetsContains(fileUrl, themeFolder2, logger);
    if (existingThemeResource || isAsset) {
      const replacement = options.devMode ? "./" : "../static/";
      const skipLoader = existingThemeResource ? "" : replacement;
      const frontendThemeFolder = skipLoader + "themes/" + basename3(themeFolder2);
      logger.log(
        "Updating url for file",
        "'" + replace2 + fileUrl + "'",
        "to use",
        "'" + frontendThemeFolder + "/" + fileUrl + "'"
      );
      const pathResolved = isAsset ? "/" + fileUrl : absolutePath.substring(themeFolder2.length).replace(/\\/g, "/");
      return url + (quoteMark ?? "") + frontendThemeFolder + pathResolved + endString;
    } else if (options.devMode) {
      logger.log("No rewrite for '", match, "' as the file was not found.");
    } else {
      return url + (quoteMark ?? "") + "../../" + fileUrl + endString;
    }
    return match;
  });
  return source;
}

// target/plugins/react-function-location-plugin/react-function-location-plugin.js
import * as t from "file:///Users/mirakhreis/team1.frontend1/node_modules/@babel/types/lib/index.js";
function addFunctionComponentSourceLocationBabel() {
  function isReactFunctionName(name) {
    return name && name.match(/^[A-Z].*/);
  }
  function addDebugInfo(path2, name, filename, loc) {
    const lineNumber = loc.start.line;
    const columnNumber = loc.start.column + 1;
    const debugSourceMember = t.memberExpression(t.identifier(name), t.identifier("__debugSourceDefine"));
    const debugSourceDefine = t.objectExpression([
      t.objectProperty(t.identifier("fileName"), t.stringLiteral(filename)),
      t.objectProperty(t.identifier("lineNumber"), t.numericLiteral(lineNumber)),
      t.objectProperty(t.identifier("columnNumber"), t.numericLiteral(columnNumber))
    ]);
    const assignment = t.expressionStatement(t.assignmentExpression("=", debugSourceMember, debugSourceDefine));
    const condition = t.binaryExpression(
      "===",
      t.unaryExpression("typeof", t.identifier(name)),
      t.stringLiteral("function")
    );
    const ifFunction = t.ifStatement(condition, t.blockStatement([assignment]));
    path2.insertAfter(ifFunction);
  }
  return {
    visitor: {
      VariableDeclaration(path2, state) {
        path2.node.declarations.forEach((declaration) => {
          if (declaration.id.type !== "Identifier") {
            return;
          }
          const name = declaration?.id?.name;
          if (!isReactFunctionName(name)) {
            return;
          }
          const filename = state.file.opts.filename;
          if (declaration?.init?.body?.loc) {
            addDebugInfo(path2, name, filename, declaration.init.body.loc);
          }
        });
      },
      FunctionDeclaration(path2, state) {
        const node = path2.node;
        const name = node?.id?.name;
        if (!isReactFunctionName(name)) {
          return;
        }
        const filename = state.file.opts.filename;
        if (node.body.loc) {
          addDebugInfo(path2, name, filename, node.body.loc);
        }
      }
    }
  };
}

// target/vaadin-dev-server-settings.json
var vaadin_dev_server_settings_default = {
  frontendFolder: "/Users/mirakhreis/team1.frontend1/./src/main/frontend",
  themeFolder: "themes",
  themeResourceFolder: "/Users/mirakhreis/team1.frontend1/./src/main/frontend/generated/jar-resources",
  staticOutput: "/Users/mirakhreis/team1.frontend1/target/classes/META-INF/VAADIN/webapp/VAADIN/static",
  generatedFolder: "generated",
  statsOutput: "/Users/mirakhreis/team1.frontend1/target/classes/META-INF/VAADIN/config",
  frontendBundleOutput: "/Users/mirakhreis/team1.frontend1/target/classes/META-INF/VAADIN/webapp",
  devBundleOutput: "/Users/mirakhreis/team1.frontend1/target/dev-bundle/webapp",
  devBundleStatsOutput: "/Users/mirakhreis/team1.frontend1/target/dev-bundle/config",
  jarResourcesFolder: "/Users/mirakhreis/team1.frontend1/./src/main/frontend/generated/jar-resources",
  themeName: "my-app",
  clientServiceWorkerSource: "/Users/mirakhreis/team1.frontend1/target/sw.ts",
  pwaEnabled: false,
  offlineEnabled: false,
  offlinePath: "'offline.html'"
};

// vite.generated.ts
import {
  defineConfig,
  mergeConfig
} from "file:///Users/mirakhreis/team1.frontend1/node_modules/vite/dist/node/index.js";
import { getManifest } from "file:///Users/mirakhreis/team1.frontend1/node_modules/workbox-build/build/index.js";
import * as rollup from "file:///Users/mirakhreis/team1.frontend1/node_modules/rollup/dist/es/rollup.js";
import brotli from "file:///Users/mirakhreis/team1.frontend1/node_modules/rollup-plugin-brotli/lib/index.cjs.js";
import replace from "file:///Users/mirakhreis/team1.frontend1/node_modules/@rollup/plugin-replace/dist/es/index.js";
import checker from "file:///Users/mirakhreis/team1.frontend1/node_modules/vite-plugin-checker/dist/esm/main.js";

// target/plugins/rollup-plugin-postcss-lit-custom/rollup-plugin-postcss-lit.js
import { createFilter } from "file:///Users/mirakhreis/team1.frontend1/node_modules/@rollup/pluginutils/dist/es/index.js";
import transformAst from "file:///Users/mirakhreis/team1.frontend1/node_modules/transform-ast/index.js";
var assetUrlRE = /__VITE_ASSET__([\w$]+)__(?:\$_(.*?)__)?/g;
var escape = (str) => str.replace(assetUrlRE, '${unsafeCSSTag("__VITE_ASSET__$1__$2")}').replace(/`/g, "\\`").replace(/\\(?!`)/g, "\\\\");
function postcssLit(options = {}) {
  const defaultOptions = {
    include: "**/*.{css,sss,pcss,styl,stylus,sass,scss,less}",
    exclude: null,
    importPackage: "lit"
  };
  const opts = { ...defaultOptions, ...options };
  const filter = createFilter(opts.include, opts.exclude);
  return {
    name: "postcss-lit",
    enforce: "post",
    transform(code, id) {
      if (!filter(id)) return;
      const ast = this.parse(code, {});
      let defaultExportName;
      let isDeclarationLiteral = false;
      const magicString = transformAst(code, { ast }, (node) => {
        if (node.type === "ExportDefaultDeclaration") {
          defaultExportName = node.declaration.name;
          isDeclarationLiteral = node.declaration.type === "Literal";
        }
      });
      if (!defaultExportName && !isDeclarationLiteral) {
        return;
      }
      magicString.walk((node) => {
        if (defaultExportName && node.type === "VariableDeclaration") {
          const exportedVar = node.declarations.find((d) => d.id.name === defaultExportName);
          if (exportedVar) {
            exportedVar.init.edit.update(`cssTag\`${escape(exportedVar.init.value)}\``);
          }
        }
        if (isDeclarationLiteral && node.type === "ExportDefaultDeclaration") {
          node.declaration.edit.update(`cssTag\`${escape(node.declaration.value)}\``);
        }
      });
      magicString.prepend(`import {css as cssTag, unsafeCSS as unsafeCSSTag} from '${opts.importPackage}';
`);
      return {
        code: magicString.toString(),
        map: magicString.generateMap({
          hires: true
        })
      };
    }
  };
}

// vite.generated.ts
import { createRequire } from "module";
import { visualizer } from "file:///Users/mirakhreis/team1.frontend1/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import reactPlugin from "file:///Users/mirakhreis/team1.frontend1/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/mirakhreis/team1.frontend1";
var __vite_injected_original_import_meta_url = "file:///Users/mirakhreis/team1.frontend1/vite.generated.ts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var appShellUrl = ".";
var frontendFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.frontendFolder);
var themeFolder = path.resolve(frontendFolder, vaadin_dev_server_settings_default.themeFolder);
var frontendBundleFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.frontendBundleOutput);
var devBundleFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.devBundleOutput);
var devBundle = !!process.env.devBundle;
var jarResourcesFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.jarResourcesFolder);
var themeResourceFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.themeResourceFolder);
var projectPackageJsonFile = path.resolve(__vite_injected_original_dirname, "package.json");
var buildOutputFolder = devBundle ? devBundleFolder : frontendBundleFolder;
var statsFolder = path.resolve(__vite_injected_original_dirname, devBundle ? vaadin_dev_server_settings_default.devBundleStatsOutput : vaadin_dev_server_settings_default.statsOutput);
var statsFile = path.resolve(statsFolder, "stats.json");
var bundleSizeFile = path.resolve(statsFolder, "bundle-size.html");
var nodeModulesFolder = path.resolve(__vite_injected_original_dirname, "node_modules");
var webComponentTags = "";
var projectIndexHtml = path.resolve(frontendFolder, "index.html");
var projectStaticAssetsFolders = [
  path.resolve(__vite_injected_original_dirname, "src", "main", "resources", "META-INF", "resources"),
  path.resolve(__vite_injected_original_dirname, "src", "main", "resources", "static"),
  frontendFolder
];
var themeProjectFolders = projectStaticAssetsFolders.map((folder) => path.resolve(folder, vaadin_dev_server_settings_default.themeFolder));
var themeOptions = {
  devMode: false,
  useDevBundle: devBundle,
  // The following matches folder 'frontend/generated/themes/'
  // (not 'frontend/themes') for theme in JAR that is copied there
  themeResourceFolder: path.resolve(themeResourceFolder, vaadin_dev_server_settings_default.themeFolder),
  themeProjectFolders,
  projectStaticAssetsOutputFolder: devBundle ? path.resolve(devBundleFolder, "../assets") : path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.staticOutput),
  frontendGeneratedFolder: path.resolve(frontendFolder, vaadin_dev_server_settings_default.generatedFolder)
};
var hasExportedWebComponents = existsSync5(path.resolve(frontendFolder, "web-component.html"));
console.trace = () => {
};
console.debug = () => {
};
function injectManifestToSWPlugin() {
  const rewriteManifestIndexHtmlUrl = (manifest) => {
    const indexEntry = manifest.find((entry) => entry.url === "index.html");
    if (indexEntry) {
      indexEntry.url = appShellUrl;
    }
    return { manifest, warnings: [] };
  };
  return {
    name: "vaadin:inject-manifest-to-sw",
    async transform(code, id) {
      if (/sw\.(ts|js)$/.test(id)) {
        const { manifestEntries } = await getManifest({
          globDirectory: buildOutputFolder,
          globPatterns: ["**/*"],
          globIgnores: ["**/*.br"],
          manifestTransforms: [rewriteManifestIndexHtmlUrl],
          maximumFileSizeToCacheInBytes: 100 * 1024 * 1024
          // 100mb,
        });
        return code.replace("self.__WB_MANIFEST", JSON.stringify(manifestEntries));
      }
    }
  };
}
function buildSWPlugin(opts) {
  let config;
  const devMode = opts.devMode;
  const swObj = {};
  async function build(action, additionalPlugins = []) {
    const includedPluginNames = [
      "vite:esbuild",
      "rollup-plugin-dynamic-import-variables",
      "vite:esbuild-transpile",
      "vite:terser"
    ];
    const plugins = config.plugins.filter((p) => {
      return includedPluginNames.includes(p.name);
    });
    const resolver = config.createResolver();
    const resolvePlugin = {
      name: "resolver",
      resolveId(source, importer, _options) {
        return resolver(source, importer);
      }
    };
    plugins.unshift(resolvePlugin);
    plugins.push(
      replace({
        values: {
          "process.env.NODE_ENV": JSON.stringify(config.mode),
          ...config.define
        },
        preventAssignment: true
      })
    );
    if (additionalPlugins) {
      plugins.push(...additionalPlugins);
    }
    const bundle = await rollup.rollup({
      input: path.resolve(vaadin_dev_server_settings_default.clientServiceWorkerSource),
      plugins
    });
    try {
      return await bundle[action]({
        file: path.resolve(buildOutputFolder, "sw.js"),
        format: "es",
        exports: "none",
        sourcemap: config.command === "serve" || config.build.sourcemap,
        inlineDynamicImports: true
      });
    } finally {
      await bundle.close();
    }
  }
  return {
    name: "vaadin:build-sw",
    enforce: "post",
    async configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async buildStart() {
      if (devMode) {
        const { output } = await build("generate");
        swObj.code = output[0].code;
        swObj.map = output[0].map;
      }
    },
    async load(id) {
      if (id.endsWith("sw.js")) {
        return "";
      }
    },
    async transform(_code, id) {
      if (id.endsWith("sw.js")) {
        return swObj;
      }
    },
    async closeBundle() {
      if (!devMode) {
        await build("write", [injectManifestToSWPlugin(), brotli()]);
      }
    }
  };
}
function statsExtracterPlugin() {
  function collectThemeJsonsInFrontend(themeJsonContents, themeName) {
    const themeJson = path.resolve(frontendFolder, vaadin_dev_server_settings_default.themeFolder, themeName, "theme.json");
    if (existsSync5(themeJson)) {
      const themeJsonContent = readFileSync4(themeJson, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
      themeJsonContents[themeName] = themeJsonContent;
      const themeJsonObject = JSON.parse(themeJsonContent);
      if (themeJsonObject.parent) {
        collectThemeJsonsInFrontend(themeJsonContents, themeJsonObject.parent);
      }
    }
  }
  return {
    name: "vaadin:stats",
    enforce: "post",
    async writeBundle(options, bundle) {
      const modules = Object.values(bundle).flatMap((b) => b.modules ? Object.keys(b.modules) : []);
      const nodeModulesFolders = modules.map((id) => id.replace(/\\/g, "/")).filter((id) => id.startsWith(nodeModulesFolder.replace(/\\/g, "/"))).map((id) => id.substring(nodeModulesFolder.length + 1));
      const npmModules = nodeModulesFolders.map((id) => id.replace(/\\/g, "/")).map((id) => {
        const parts = id.split("/");
        if (id.startsWith("@")) {
          return parts[0] + "/" + parts[1];
        } else {
          return parts[0];
        }
      }).sort().filter((value, index, self) => self.indexOf(value) === index);
      const npmModuleAndVersion = Object.fromEntries(npmModules.map((module) => [module, getVersion(module)]));
      const cvdls = Object.fromEntries(
        npmModules.filter((module) => getCvdlName(module) != null).map((module) => [module, { name: getCvdlName(module), version: getVersion(module) }])
      );
      mkdirSync2(path.dirname(statsFile), { recursive: true });
      const projectPackageJson = JSON.parse(readFileSync4(projectPackageJsonFile, { encoding: "utf-8" }));
      const entryScripts = Object.values(bundle).filter((bundle2) => bundle2.isEntry).map((bundle2) => bundle2.fileName);
      const generatedIndexHtml = path.resolve(buildOutputFolder, "index.html");
      const customIndexData = readFileSync4(projectIndexHtml, { encoding: "utf-8" });
      const generatedIndexData = readFileSync4(generatedIndexHtml, {
        encoding: "utf-8"
      });
      const customIndexRows = new Set(customIndexData.split(/[\r\n]/).filter((row) => row.trim() !== ""));
      const generatedIndexRows = generatedIndexData.split(/[\r\n]/).filter((row) => row.trim() !== "");
      const rowsGenerated = [];
      generatedIndexRows.forEach((row) => {
        if (!customIndexRows.has(row)) {
          rowsGenerated.push(row);
        }
      });
      const parseImports = (filename, result) => {
        const content = readFileSync4(filename, { encoding: "utf-8" });
        const lines = content.split("\n");
        const staticImports = lines.filter((line) => line.startsWith("import ")).map((line) => line.substring(line.indexOf("'") + 1, line.lastIndexOf("'"))).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line);
        const dynamicImports = lines.filter((line) => line.includes("import(")).map((line) => line.replace(/.*import\(/, "")).map((line) => line.split(/'/)[1]).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line);
        staticImports.forEach((staticImport) => result.add(staticImport));
        dynamicImports.map((dynamicImport) => {
          const importedFile = path.resolve(path.dirname(filename), dynamicImport);
          parseImports(importedFile, result);
        });
      };
      const generatedImportsSet = /* @__PURE__ */ new Set();
      parseImports(
        path.resolve(themeOptions.frontendGeneratedFolder, "flow", "generated-flow-imports.js"),
        generatedImportsSet
      );
      const generatedImports = Array.from(generatedImportsSet).sort();
      const frontendFiles = {};
      const projectFileExtensions = [".js", ".js.map", ".ts", ".ts.map", ".tsx", ".tsx.map", ".css", ".css.map"];
      const isThemeComponentsResource = (id) => id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) && id.match(/.*\/jar-resources\/themes\/[^\/]+\/components\//);
      const isGeneratedWebComponentResource = (id) => id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) && id.match(/.*\/flow\/web-components\//);
      const isFrontendResourceCollected = (id) => !id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) || isThemeComponentsResource(id) || isGeneratedWebComponentResource(id);
      modules.map((id) => id.replace(/\\/g, "/")).filter((id) => id.startsWith(frontendFolder.replace(/\\/g, "/"))).filter(isFrontendResourceCollected).map((id) => id.substring(frontendFolder.length + 1)).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line).forEach((line) => {
        const filePath = path.resolve(frontendFolder, line);
        if (projectFileExtensions.includes(path.extname(filePath))) {
          const fileBuffer = readFileSync4(filePath, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
          frontendFiles[line] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        }
      });
      generatedImports.filter((line) => line.includes("generated/jar-resources")).forEach((line) => {
        let filename = line.substring(line.indexOf("generated"));
        const fileBuffer = readFileSync4(path.resolve(frontendFolder, filename), { encoding: "utf-8" }).replace(
          /\r\n/g,
          "\n"
        );
        const hash = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        const fileKey = line.substring(line.indexOf("jar-resources/") + 14);
        frontendFiles[fileKey] = hash;
      });
      let frontendFolderAlias = "Frontend";
      generatedImports.filter((line) => line.startsWith(frontendFolderAlias + "/")).filter((line) => !line.startsWith(frontendFolderAlias + "/generated/")).filter((line) => !line.startsWith(frontendFolderAlias + "/themes/")).map((line) => line.substring(frontendFolderAlias.length + 1)).filter((line) => !frontendFiles[line]).forEach((line) => {
        const filePath = path.resolve(frontendFolder, line);
        if (projectFileExtensions.includes(path.extname(filePath)) && existsSync5(filePath)) {
          const fileBuffer = readFileSync4(filePath, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
          frontendFiles[line] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        }
      });
      if (existsSync5(path.resolve(frontendFolder, "index.ts"))) {
        const fileBuffer = readFileSync4(path.resolve(frontendFolder, "index.ts"), { encoding: "utf-8" }).replace(
          /\r\n/g,
          "\n"
        );
        frontendFiles[`index.ts`] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
      }
      const themeJsonContents = {};
      const themesFolder = path.resolve(jarResourcesFolder, "themes");
      if (existsSync5(themesFolder)) {
        readdirSync2(themesFolder).forEach((themeFolder2) => {
          const themeJson = path.resolve(themesFolder, themeFolder2, "theme.json");
          if (existsSync5(themeJson)) {
            themeJsonContents[path.basename(themeFolder2)] = readFileSync4(themeJson, { encoding: "utf-8" }).replace(
              /\r\n/g,
              "\n"
            );
          }
        });
      }
      collectThemeJsonsInFrontend(themeJsonContents, vaadin_dev_server_settings_default.themeName);
      let webComponents = [];
      if (webComponentTags) {
        webComponents = webComponentTags.split(";");
      }
      const stats = {
        packageJsonDependencies: projectPackageJson.dependencies,
        npmModules: npmModuleAndVersion,
        bundleImports: generatedImports,
        frontendHashes: frontendFiles,
        themeJsonContents,
        entryScripts,
        webComponents,
        cvdlModules: cvdls,
        packageJsonHash: projectPackageJson?.vaadin?.hash,
        indexHtmlGenerated: rowsGenerated
      };
      writeFileSync2(statsFile, JSON.stringify(stats, null, 1));
    }
  };
}
function vaadinBundlesPlugin() {
  const disabledMessage = "Vaadin component dependency bundles are disabled.";
  const modulesDirectory = nodeModulesFolder.replace(/\\/g, "/");
  let vaadinBundleJson;
  function parseModuleId(id) {
    const [scope, scopedPackageName] = id.split("/", 3);
    const packageName = scope.startsWith("@") ? `${scope}/${scopedPackageName}` : scope;
    const modulePath = `.${id.substring(packageName.length)}`;
    return {
      packageName,
      modulePath
    };
  }
  function getExports(id) {
    const { packageName, modulePath } = parseModuleId(id);
    const packageInfo = vaadinBundleJson.packages[packageName];
    if (!packageInfo) return;
    const exposeInfo = packageInfo.exposes[modulePath];
    if (!exposeInfo) return;
    const exportsSet = /* @__PURE__ */ new Set();
    for (const e of exposeInfo.exports) {
      if (typeof e === "string") {
        exportsSet.add(e);
      } else {
        const { namespace, source } = e;
        if (namespace) {
          exportsSet.add(namespace);
        } else {
          const sourceExports = getExports(source);
          if (sourceExports) {
            sourceExports.forEach((e2) => exportsSet.add(e2));
          }
        }
      }
    }
    return Array.from(exportsSet);
  }
  function getExportBinding(binding) {
    return binding === "default" ? "_default as default" : binding;
  }
  function getImportAssigment(binding) {
    return binding === "default" ? "default: _default" : binding;
  }
  return {
    name: "vaadin:bundles",
    enforce: "pre",
    apply(config, { command }) {
      if (command !== "serve") return false;
      try {
        const vaadinBundleJsonPath = require2.resolve("@vaadin/bundles/vaadin-bundle.json");
        vaadinBundleJson = JSON.parse(readFileSync4(vaadinBundleJsonPath, { encoding: "utf8" }));
      } catch (e) {
        if (typeof e === "object" && e.code === "MODULE_NOT_FOUND") {
          vaadinBundleJson = { packages: {} };
          console.info(`@vaadin/bundles npm package is not found, ${disabledMessage}`);
          return false;
        } else {
          throw e;
        }
      }
      const versionMismatches = [];
      for (const [name, packageInfo] of Object.entries(vaadinBundleJson.packages)) {
        let installedVersion = void 0;
        try {
          const { version: bundledVersion } = packageInfo;
          const installedPackageJsonFile = path.resolve(modulesDirectory, name, "package.json");
          const packageJson = JSON.parse(readFileSync4(installedPackageJsonFile, { encoding: "utf8" }));
          installedVersion = packageJson.version;
          if (installedVersion && installedVersion !== bundledVersion) {
            versionMismatches.push({
              name,
              bundledVersion,
              installedVersion
            });
          }
        } catch (_) {
        }
      }
      if (versionMismatches.length) {
        console.info(`@vaadin/bundles has version mismatches with installed packages, ${disabledMessage}`);
        console.info(`Packages with version mismatches: ${JSON.stringify(versionMismatches, void 0, 2)}`);
        vaadinBundleJson = { packages: {} };
        return false;
      }
      return true;
    },
    async config(config) {
      return mergeConfig(
        {
          optimizeDeps: {
            exclude: [
              // Vaadin bundle
              "@vaadin/bundles",
              ...Object.keys(vaadinBundleJson.packages),
              "@vaadin/vaadin-material-styles"
            ]
          }
        },
        config
      );
    },
    load(rawId) {
      const [path2, params] = rawId.split("?");
      if (!path2.startsWith(modulesDirectory)) return;
      const id = path2.substring(modulesDirectory.length + 1);
      const bindings = getExports(id);
      if (bindings === void 0) return;
      const cacheSuffix = params ? `?${params}` : "";
      const bundlePath = `@vaadin/bundles/vaadin.js${cacheSuffix}`;
      return `import { init as VaadinBundleInit, get as VaadinBundleGet } from '${bundlePath}';
await VaadinBundleInit('default');
const { ${bindings.map(getImportAssigment).join(", ")} } = (await VaadinBundleGet('./node_modules/${id}'))();
export { ${bindings.map(getExportBinding).join(", ")} };`;
    }
  };
}
function themePlugin(opts) {
  const fullThemeOptions = { ...themeOptions, devMode: opts.devMode };
  return {
    name: "vaadin:theme",
    config() {
      processThemeResources(fullThemeOptions, console);
    },
    configureServer(server) {
      function handleThemeFileCreateDelete(themeFile, stats) {
        if (themeFile.startsWith(themeFolder)) {
          const changed = path.relative(themeFolder, themeFile);
          console.debug("Theme file " + (!!stats ? "created" : "deleted"), changed);
          processThemeResources(fullThemeOptions, console);
        }
      }
      server.watcher.on("add", handleThemeFileCreateDelete);
      server.watcher.on("unlink", handleThemeFileCreateDelete);
    },
    handleHotUpdate(context) {
      const contextPath = path.resolve(context.file);
      const themePath = path.resolve(themeFolder);
      if (contextPath.startsWith(themePath)) {
        const changed = path.relative(themePath, contextPath);
        console.debug("Theme file changed", changed);
        if (changed.startsWith(vaadin_dev_server_settings_default.themeName)) {
          processThemeResources(fullThemeOptions, console);
        }
      }
    },
    async resolveId(id, importer) {
      if (path.resolve(themeOptions.frontendGeneratedFolder, "theme.js") === importer && !existsSync5(path.resolve(themeOptions.frontendGeneratedFolder, id))) {
        console.debug("Generate theme file " + id + " not existing. Processing theme resource");
        processThemeResources(fullThemeOptions, console);
        return;
      }
      if (!id.startsWith(vaadin_dev_server_settings_default.themeFolder)) {
        return;
      }
      for (const location of [themeResourceFolder, frontendFolder]) {
        const result = await this.resolve(path.resolve(location, id));
        if (result) {
          return result;
        }
      }
    },
    async transform(raw, id, options) {
      const [bareId, query] = id.split("?");
      if (!bareId?.startsWith(themeFolder) && !bareId?.startsWith(themeOptions.themeResourceFolder) || !bareId?.endsWith(".css")) {
        return;
      }
      const resourceThemeFolder = bareId.startsWith(themeFolder) ? themeFolder : themeOptions.themeResourceFolder;
      const [themeName] = bareId.substring(resourceThemeFolder.length + 1).split("/");
      return rewriteCssUrls(raw, path.dirname(bareId), path.resolve(resourceThemeFolder, themeName), console, opts);
    }
  };
}
function runWatchDog(watchDogPort, watchDogHost) {
  const client = new net.Socket();
  client.setEncoding("utf8");
  client.on("error", function(err) {
    console.log("Watchdog connection error. Terminating vite process...", err);
    client.destroy();
    process.exit(0);
  });
  client.on("close", function() {
    client.destroy();
    runWatchDog(watchDogPort, watchDogHost);
  });
  client.connect(watchDogPort, watchDogHost || "localhost");
}
var allowedFrontendFolders = [frontendFolder, nodeModulesFolder];
function showRecompileReason() {
  return {
    name: "vaadin:why-you-compile",
    handleHotUpdate(context) {
      console.log("Recompiling because", context.file, "changed");
    }
  };
}
var DEV_MODE_START_REGEXP = /\/\*[\*!]\s+vaadin-dev-mode:start/;
var DEV_MODE_CODE_REGEXP = /\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i;
function preserveUsageStats() {
  return {
    name: "vaadin:preserve-usage-stats",
    transform(src, id) {
      if (id.includes("vaadin-usage-statistics")) {
        if (src.includes("vaadin-dev-mode:start")) {
          const newSrc = src.replace(DEV_MODE_START_REGEXP, "/*! vaadin-dev-mode:start");
          if (newSrc === src) {
            console.error("Comment replacement failed to change anything");
          } else if (!newSrc.match(DEV_MODE_CODE_REGEXP)) {
            console.error("New comment fails to match original regexp");
          } else {
            return { code: newSrc };
          }
        }
      }
      return { code: src };
    }
  };
}
var vaadinConfig = (env) => {
  const devMode = env.mode === "development";
  const productionMode = !devMode && !devBundle;
  if (devMode && process.env.watchDogPort) {
    runWatchDog(parseInt(process.env.watchDogPort), process.env.watchDogHost);
  }
  return {
    root: frontendFolder,
    base: "",
    publicDir: false,
    resolve: {
      alias: {
        "@vaadin/flow-frontend": jarResourcesFolder,
        Frontend: frontendFolder
      },
      preserveSymlinks: true
    },
    define: {
      OFFLINE_PATH: vaadin_dev_server_settings_default.offlinePath,
      VITE_ENABLED: "true"
    },
    server: {
      host: "127.0.0.1",
      strictPort: true,
      fs: {
        allow: allowedFrontendFolders
      }
    },
    build: {
      minify: productionMode,
      outDir: buildOutputFolder,
      emptyOutDir: devBundle,
      assetsDir: "VAADIN/build",
      rollupOptions: {
        input: {
          indexhtml: projectIndexHtml,
          ...hasExportedWebComponents ? { webcomponenthtml: path.resolve(frontendFolder, "web-component.html") } : {}
        },
        onwarn: (warning, defaultHandler) => {
          const ignoreEvalWarning = [
            "generated/jar-resources/FlowClient.js",
            "generated/jar-resources/vaadin-spreadsheet/spreadsheet-export.js",
            "@vaadin/charts/src/helpers.js"
          ];
          if (warning.code === "EVAL" && warning.id && !!ignoreEvalWarning.find((id) => warning.id?.endsWith(id))) {
            return;
          }
          defaultHandler(warning);
        }
      }
    },
    optimizeDeps: {
      entries: [
        // Pre-scan entrypoints in Vite to avoid reloading on first open
        "generated/vaadin.ts"
      ],
      exclude: [
        "@vaadin/router",
        "@vaadin/vaadin-license-checker",
        "@vaadin/vaadin-usage-statistics",
        "workbox-core",
        "workbox-precaching",
        "workbox-routing",
        "workbox-strategies"
      ]
    },
    plugins: [
      productionMode && brotli(),
      devMode && vaadinBundlesPlugin(),
      devMode && showRecompileReason(),
      vaadin_dev_server_settings_default.offlineEnabled && buildSWPlugin({ devMode }),
      !devMode && statsExtracterPlugin(),
      !productionMode && preserveUsageStats(),
      themePlugin({ devMode }),
      postcssLit({
        include: ["**/*.css", /.*\/.*\.css\?.*/],
        exclude: [
          `${themeFolder}/**/*.css`,
          new RegExp(`${themeFolder}/.*/.*\\.css\\?.*`),
          `${themeResourceFolder}/**/*.css`,
          new RegExp(`${themeResourceFolder}/.*/.*\\.css\\?.*`),
          new RegExp(".*/.*\\?html-proxy.*")
        ]
      }),
      // The React plugin provides fast refresh and debug source info
      reactPlugin({
        include: "**/*.tsx",
        babel: {
          // We need to use babel to provide the source information for it to be correct
          // (otherwise Babel will slightly rewrite the source file and esbuild generate source info for the modified file)
          presets: [["@babel/preset-react", { runtime: "automatic", development: !productionMode }]],
          // React writes the source location for where components are used, this writes for where they are defined
          plugins: [
            !productionMode && addFunctionComponentSourceLocationBabel(),
            [
              "module:@preact/signals-react-transform",
              {
                mode: "all"
                // Needed to include translations which do not use something.value
              }
            ]
          ].filter(Boolean)
        }
      }),
      {
        name: "vaadin:force-remove-html-middleware",
        configureServer(server) {
          return () => {
            server.middlewares.stack = server.middlewares.stack.filter((mw) => {
              const handleName = `${mw.handle}`;
              return !handleName.includes("viteHtmlFallbackMiddleware");
            });
          };
        }
      },
      hasExportedWebComponents && {
        name: "vaadin:inject-entrypoints-to-web-component-html",
        transformIndexHtml: {
          order: "pre",
          handler(_html, { path: path2, server }) {
            if (path2 !== "/web-component.html") {
              return;
            }
            return [
              {
                tag: "script",
                attrs: { type: "module", src: `/generated/vaadin-web-component.ts` },
                injectTo: "head"
              }
            ];
          }
        }
      },
      {
        name: "vaadin:inject-entrypoints-to-index-html",
        transformIndexHtml: {
          order: "pre",
          handler(_html, { path: path2, server }) {
            if (path2 !== "/index.html") {
              return;
            }
            const scripts = [];
            if (devMode) {
              scripts.push({
                tag: "script",
                attrs: { type: "module", src: `/generated/vite-devmode.ts`, onerror: "document.location.reload()" },
                injectTo: "head"
              });
            }
            scripts.push({
              tag: "script",
              attrs: { type: "module", src: "/generated/vaadin.ts" },
              injectTo: "head"
            });
            return scripts;
          }
        }
      },
      checker({
        typescript: true
      }),
      productionMode && visualizer({ brotliSize: true, filename: bundleSizeFile })
    ]
  };
};
var overrideVaadinConfig = (customConfig2) => {
  return defineConfig((env) => mergeConfig(vaadinConfig(env), customConfig2(env)));
};
function getVersion(module) {
  const packageJson = path.resolve(nodeModulesFolder, module, "package.json");
  return JSON.parse(readFileSync4(packageJson, { encoding: "utf-8" })).version;
}
function getCvdlName(module) {
  const packageJson = path.resolve(nodeModulesFolder, module, "package.json");
  return JSON.parse(readFileSync4(packageJson, { encoding: "utf-8" })).cvdlName;
}

// vite.config.ts
var customConfig = (env) => ({
  // Here you can add custom Vite parameters
  // https://vitejs.dev/config/
});
var vite_config_default = overrideVaadinConfig(customConfig);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5nZW5lcmF0ZWQudHMiLCAidGFyZ2V0L3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luL3RoZW1lLWhhbmRsZS5qcyIsICJ0YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtZ2VuZXJhdG9yLmpzIiwgInRhcmdldC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpbi90aGVtZS1jb3B5LmpzIiwgInRhcmdldC9wbHVnaW5zL3RoZW1lLWxvYWRlci90aGVtZS1sb2FkZXItdXRpbHMuanMiLCAidGFyZ2V0L3BsdWdpbnMvcmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi5qcyIsICJ0YXJnZXQvdmFhZGluLWRldi1zZXJ2ZXItc2V0dGluZ3MuanNvbiIsICJ0YXJnZXQvcGx1Z2lucy9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LWN1c3RvbS9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LmpzIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdml0ZS5nZW5lcmF0ZWQudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxL3ZpdGUuZ2VuZXJhdGVkLnRzXCI7LyoqXG4gKiBOT1RJQ0U6IHRoaXMgaXMgYW4gYXV0by1nZW5lcmF0ZWQgZmlsZVxuICpcbiAqIFRoaXMgZmlsZSBoYXMgYmVlbiBnZW5lcmF0ZWQgYnkgdGhlIGBmbG93OnByZXBhcmUtZnJvbnRlbmRgIG1hdmVuIGdvYWwuXG4gKiBUaGlzIGZpbGUgd2lsbCBiZSBvdmVyd3JpdHRlbiBvbiBldmVyeSBydW4uIEFueSBjdXN0b20gY2hhbmdlcyBzaG91bGQgYmUgbWFkZSB0byB2aXRlLmNvbmZpZy50c1xuICovXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4aXN0c1N5bmMsIG1rZGlyU3luYywgcmVhZGRpclN5bmMsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYywgU3RhdHMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyBjcmVhdGVIYXNoIH0gZnJvbSAnY3J5cHRvJztcbmltcG9ydCAqIGFzIG5ldCBmcm9tICduZXQnO1xuXG5pbXBvcnQgeyBwcm9jZXNzVGhlbWVSZXNvdXJjZXMgfSBmcm9tICcuL3RhcmdldC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpbi90aGVtZS1oYW5kbGUuanMnO1xuaW1wb3J0IHsgcmV3cml0ZUNzc1VybHMgfSBmcm9tICcuL3RhcmdldC9wbHVnaW5zL3RoZW1lLWxvYWRlci90aGVtZS1sb2FkZXItdXRpbHMuanMnO1xuaW1wb3J0IHsgYWRkRnVuY3Rpb25Db21wb25lbnRTb3VyY2VMb2NhdGlvbkJhYmVsIH0gZnJvbSAnLi90YXJnZXQvcGx1Z2lucy9yZWFjdC1mdW5jdGlvbi1sb2NhdGlvbi1wbHVnaW4vcmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luLmpzJztcbmltcG9ydCBzZXR0aW5ncyBmcm9tICcuL3RhcmdldC92YWFkaW4tZGV2LXNlcnZlci1zZXR0aW5ncy5qc29uJztcbmltcG9ydCB7XG4gIEFzc2V0SW5mbyxcbiAgQ2h1bmtJbmZvLFxuICBkZWZpbmVDb25maWcsXG4gIG1lcmdlQ29uZmlnLFxuICBPdXRwdXRPcHRpb25zLFxuICBQbHVnaW5PcHRpb24sXG4gIFJlc29sdmVkQ29uZmlnLFxuICBVc2VyQ29uZmlnRm5cbn0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBnZXRNYW5pZmVzdCwgdHlwZSBNYW5pZmVzdFRyYW5zZm9ybSB9IGZyb20gJ3dvcmtib3gtYnVpbGQnO1xuXG5pbXBvcnQgKiBhcyByb2xsdXAgZnJvbSAncm9sbHVwJztcbmltcG9ydCBicm90bGkgZnJvbSAncm9sbHVwLXBsdWdpbi1icm90bGknO1xuaW1wb3J0IHJlcGxhY2UgZnJvbSAnQHJvbGx1cC9wbHVnaW4tcmVwbGFjZSc7XG5pbXBvcnQgY2hlY2tlciBmcm9tICd2aXRlLXBsdWdpbi1jaGVja2VyJztcbmltcG9ydCBwb3N0Y3NzTGl0IGZyb20gJy4vdGFyZ2V0L3BsdWdpbnMvcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC1jdXN0b20vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC5qcyc7XG5cbmltcG9ydCB7IGNyZWF0ZVJlcXVpcmUgfSBmcm9tICdtb2R1bGUnO1xuXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcbmltcG9ydCByZWFjdFBsdWdpbiBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cblxuXG4vLyBNYWtlIGByZXF1aXJlYCBjb21wYXRpYmxlIHdpdGggRVMgbW9kdWxlc1xuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKTtcblxuY29uc3QgYXBwU2hlbGxVcmwgPSAnLic7XG5cbmNvbnN0IGZyb250ZW5kRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuZnJvbnRlbmRGb2xkZXIpO1xuY29uc3QgdGhlbWVGb2xkZXIgPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIHNldHRpbmdzLnRoZW1lRm9sZGVyKTtcbmNvbnN0IGZyb250ZW5kQnVuZGxlRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuZnJvbnRlbmRCdW5kbGVPdXRwdXQpO1xuY29uc3QgZGV2QnVuZGxlRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuZGV2QnVuZGxlT3V0cHV0KTtcbmNvbnN0IGRldkJ1bmRsZSA9ICEhcHJvY2Vzcy5lbnYuZGV2QnVuZGxlO1xuY29uc3QgamFyUmVzb3VyY2VzRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuamFyUmVzb3VyY2VzRm9sZGVyKTtcbmNvbnN0IHRoZW1lUmVzb3VyY2VGb2xkZXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBzZXR0aW5ncy50aGVtZVJlc291cmNlRm9sZGVyKTtcbmNvbnN0IHByb2plY3RQYWNrYWdlSnNvbkZpbGUgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncGFja2FnZS5qc29uJyk7XG5cbmNvbnN0IGJ1aWxkT3V0cHV0Rm9sZGVyID0gZGV2QnVuZGxlID8gZGV2QnVuZGxlRm9sZGVyIDogZnJvbnRlbmRCdW5kbGVGb2xkZXI7XG5jb25zdCBzdGF0c0ZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGRldkJ1bmRsZSA/IHNldHRpbmdzLmRldkJ1bmRsZVN0YXRzT3V0cHV0IDogc2V0dGluZ3Muc3RhdHNPdXRwdXQpO1xuY29uc3Qgc3RhdHNGaWxlID0gcGF0aC5yZXNvbHZlKHN0YXRzRm9sZGVyLCAnc3RhdHMuanNvbicpO1xuY29uc3QgYnVuZGxlU2l6ZUZpbGUgPSBwYXRoLnJlc29sdmUoc3RhdHNGb2xkZXIsICdidW5kbGUtc2l6ZS5odG1sJyk7XG5jb25zdCBub2RlTW9kdWxlc0ZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMnKTtcbmNvbnN0IHdlYkNvbXBvbmVudFRhZ3MgPSAnJztcblxuY29uc3QgcHJvamVjdEluZGV4SHRtbCA9IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ2luZGV4Lmh0bWwnKTtcblxuY29uc3QgcHJvamVjdFN0YXRpY0Fzc2V0c0ZvbGRlcnMgPSBbXG4gIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCAnbWFpbicsICdyZXNvdXJjZXMnLCAnTUVUQS1JTkYnLCAncmVzb3VyY2VzJyksXG4gIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCAnbWFpbicsICdyZXNvdXJjZXMnLCAnc3RhdGljJyksXG4gIGZyb250ZW5kRm9sZGVyXG5dO1xuXG4vLyBGb2xkZXJzIGluIHRoZSBwcm9qZWN0IHdoaWNoIGNhbiBjb250YWluIGFwcGxpY2F0aW9uIHRoZW1lc1xuY29uc3QgdGhlbWVQcm9qZWN0Rm9sZGVycyA9IHByb2plY3RTdGF0aWNBc3NldHNGb2xkZXJzLm1hcCgoZm9sZGVyKSA9PiBwYXRoLnJlc29sdmUoZm9sZGVyLCBzZXR0aW5ncy50aGVtZUZvbGRlcikpO1xuXG5jb25zdCB0aGVtZU9wdGlvbnMgPSB7XG4gIGRldk1vZGU6IGZhbHNlLFxuICB1c2VEZXZCdW5kbGU6IGRldkJ1bmRsZSxcbiAgLy8gVGhlIGZvbGxvd2luZyBtYXRjaGVzIGZvbGRlciAnZnJvbnRlbmQvZ2VuZXJhdGVkL3RoZW1lcy8nXG4gIC8vIChub3QgJ2Zyb250ZW5kL3RoZW1lcycpIGZvciB0aGVtZSBpbiBKQVIgdGhhdCBpcyBjb3BpZWQgdGhlcmVcbiAgdGhlbWVSZXNvdXJjZUZvbGRlcjogcGF0aC5yZXNvbHZlKHRoZW1lUmVzb3VyY2VGb2xkZXIsIHNldHRpbmdzLnRoZW1lRm9sZGVyKSxcbiAgdGhlbWVQcm9qZWN0Rm9sZGVyczogdGhlbWVQcm9qZWN0Rm9sZGVycyxcbiAgcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlcjogZGV2QnVuZGxlXG4gICAgPyBwYXRoLnJlc29sdmUoZGV2QnVuZGxlRm9sZGVyLCAnLi4vYXNzZXRzJylcbiAgICA6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLnN0YXRpY091dHB1dCksXG4gIGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyOiBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIHNldHRpbmdzLmdlbmVyYXRlZEZvbGRlcilcbn07XG5cbmNvbnN0IGhhc0V4cG9ydGVkV2ViQ29tcG9uZW50cyA9IGV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCAnd2ViLWNvbXBvbmVudC5odG1sJykpO1xuXG4vLyBCbG9jayBkZWJ1ZyBhbmQgdHJhY2UgbG9ncy5cbmNvbnNvbGUudHJhY2UgPSAoKSA9PiB7fTtcbmNvbnNvbGUuZGVidWcgPSAoKSA9PiB7fTtcblxuZnVuY3Rpb24gaW5qZWN0TWFuaWZlc3RUb1NXUGx1Z2luKCk6IHJvbGx1cC5QbHVnaW4ge1xuICBjb25zdCByZXdyaXRlTWFuaWZlc3RJbmRleEh0bWxVcmw6IE1hbmlmZXN0VHJhbnNmb3JtID0gKG1hbmlmZXN0KSA9PiB7XG4gICAgY29uc3QgaW5kZXhFbnRyeSA9IG1hbmlmZXN0LmZpbmQoKGVudHJ5KSA9PiBlbnRyeS51cmwgPT09ICdpbmRleC5odG1sJyk7XG4gICAgaWYgKGluZGV4RW50cnkpIHtcbiAgICAgIGluZGV4RW50cnkudXJsID0gYXBwU2hlbGxVcmw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbWFuaWZlc3QsIHdhcm5pbmdzOiBbXSB9O1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjppbmplY3QtbWFuaWZlc3QtdG8tc3cnLFxuICAgIGFzeW5jIHRyYW5zZm9ybShjb2RlLCBpZCkge1xuICAgICAgaWYgKC9zd1xcLih0c3xqcykkLy50ZXN0KGlkKSkge1xuICAgICAgICBjb25zdCB7IG1hbmlmZXN0RW50cmllcyB9ID0gYXdhaXQgZ2V0TWFuaWZlc3Qoe1xuICAgICAgICAgIGdsb2JEaXJlY3Rvcnk6IGJ1aWxkT3V0cHV0Rm9sZGVyLFxuICAgICAgICAgIGdsb2JQYXR0ZXJuczogWycqKi8qJ10sXG4gICAgICAgICAgZ2xvYklnbm9yZXM6IFsnKiovKi5iciddLFxuICAgICAgICAgIG1hbmlmZXN0VHJhbnNmb3JtczogW3Jld3JpdGVNYW5pZmVzdEluZGV4SHRtbFVybF0sXG4gICAgICAgICAgbWF4aW11bUZpbGVTaXplVG9DYWNoZUluQnl0ZXM6IDEwMCAqIDEwMjQgKiAxMDI0IC8vIDEwMG1iLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gY29kZS5yZXBsYWNlKCdzZWxmLl9fV0JfTUFOSUZFU1QnLCBKU09OLnN0cmluZ2lmeShtYW5pZmVzdEVudHJpZXMpKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU1dQbHVnaW4ob3B0czogeyBkZXZNb2RlOiBib29sZWFuIH0pOiBQbHVnaW5PcHRpb24ge1xuICBsZXQgY29uZmlnOiBSZXNvbHZlZENvbmZpZztcbiAgY29uc3QgZGV2TW9kZSA9IG9wdHMuZGV2TW9kZTtcblxuICBjb25zdCBzd09iajogeyBjb2RlPzogc3RyaW5nLCBtYXA/OiByb2xsdXAuU291cmNlTWFwIHwgbnVsbCB9ID0ge307XG5cbiAgYXN5bmMgZnVuY3Rpb24gYnVpbGQoYWN0aW9uOiAnZ2VuZXJhdGUnIHwgJ3dyaXRlJywgYWRkaXRpb25hbFBsdWdpbnM6IHJvbGx1cC5QbHVnaW5bXSA9IFtdKSB7XG4gICAgY29uc3QgaW5jbHVkZWRQbHVnaW5OYW1lcyA9IFtcbiAgICAgICd2aXRlOmVzYnVpbGQnLFxuICAgICAgJ3JvbGx1cC1wbHVnaW4tZHluYW1pYy1pbXBvcnQtdmFyaWFibGVzJyxcbiAgICAgICd2aXRlOmVzYnVpbGQtdHJhbnNwaWxlJyxcbiAgICAgICd2aXRlOnRlcnNlcidcbiAgICBdO1xuICAgIGNvbnN0IHBsdWdpbnM6IHJvbGx1cC5QbHVnaW5bXSA9IGNvbmZpZy5wbHVnaW5zLmZpbHRlcigocCkgPT4ge1xuICAgICAgcmV0dXJuIGluY2x1ZGVkUGx1Z2luTmFtZXMuaW5jbHVkZXMocC5uYW1lKTtcbiAgICB9KTtcbiAgICBjb25zdCByZXNvbHZlciA9IGNvbmZpZy5jcmVhdGVSZXNvbHZlcigpO1xuICAgIGNvbnN0IHJlc29sdmVQbHVnaW46IHJvbGx1cC5QbHVnaW4gPSB7XG4gICAgICBuYW1lOiAncmVzb2x2ZXInLFxuICAgICAgcmVzb2x2ZUlkKHNvdXJjZSwgaW1wb3J0ZXIsIF9vcHRpb25zKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlcihzb3VyY2UsIGltcG9ydGVyKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHBsdWdpbnMudW5zaGlmdChyZXNvbHZlUGx1Z2luKTsgLy8gUHV0IHJlc29sdmUgZmlyc3RcbiAgICBwbHVnaW5zLnB1c2goXG4gICAgICByZXBsYWNlKHtcbiAgICAgICAgdmFsdWVzOiB7XG4gICAgICAgICAgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogSlNPTi5zdHJpbmdpZnkoY29uZmlnLm1vZGUpLFxuICAgICAgICAgIC4uLmNvbmZpZy5kZWZpbmVcbiAgICAgICAgfSxcbiAgICAgICAgcHJldmVudEFzc2lnbm1lbnQ6IHRydWVcbiAgICAgIH0pXG4gICAgKTtcbiAgICBpZiAoYWRkaXRpb25hbFBsdWdpbnMpIHtcbiAgICAgIHBsdWdpbnMucHVzaCguLi5hZGRpdGlvbmFsUGx1Z2lucyk7XG4gICAgfVxuICAgIGNvbnN0IGJ1bmRsZSA9IGF3YWl0IHJvbGx1cC5yb2xsdXAoe1xuICAgICAgaW5wdXQ6IHBhdGgucmVzb2x2ZShzZXR0aW5ncy5jbGllbnRTZXJ2aWNlV29ya2VyU291cmNlKSxcbiAgICAgIHBsdWdpbnNcbiAgICB9KTtcblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgYnVuZGxlW2FjdGlvbl0oe1xuICAgICAgICBmaWxlOiBwYXRoLnJlc29sdmUoYnVpbGRPdXRwdXRGb2xkZXIsICdzdy5qcycpLFxuICAgICAgICBmb3JtYXQ6ICdlcycsXG4gICAgICAgIGV4cG9ydHM6ICdub25lJyxcbiAgICAgICAgc291cmNlbWFwOiBjb25maWcuY29tbWFuZCA9PT0gJ3NlcnZlJyB8fCBjb25maWcuYnVpbGQuc291cmNlbWFwLFxuICAgICAgICBpbmxpbmVEeW5hbWljSW1wb3J0czogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGF3YWl0IGJ1bmRsZS5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjpidWlsZC1zdycsXG4gICAgZW5mb3JjZTogJ3Bvc3QnLFxuICAgIGFzeW5jIGNvbmZpZ1Jlc29sdmVkKHJlc29sdmVkQ29uZmlnKSB7XG4gICAgICBjb25maWcgPSByZXNvbHZlZENvbmZpZztcbiAgICB9LFxuICAgIGFzeW5jIGJ1aWxkU3RhcnQoKSB7XG4gICAgICBpZiAoZGV2TW9kZSkge1xuICAgICAgICBjb25zdCB7IG91dHB1dCB9ID0gYXdhaXQgYnVpbGQoJ2dlbmVyYXRlJyk7XG4gICAgICAgIHN3T2JqLmNvZGUgPSBvdXRwdXRbMF0uY29kZTtcbiAgICAgICAgc3dPYmoubWFwID0gb3V0cHV0WzBdLm1hcDtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jIGxvYWQoaWQpIHtcbiAgICAgIGlmIChpZC5lbmRzV2l0aCgnc3cuanMnKSkge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyB0cmFuc2Zvcm0oX2NvZGUsIGlkKSB7XG4gICAgICBpZiAoaWQuZW5kc1dpdGgoJ3N3LmpzJykpIHtcbiAgICAgICAgcmV0dXJuIHN3T2JqO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgY2xvc2VCdW5kbGUoKSB7XG4gICAgICBpZiAoIWRldk1vZGUpIHtcbiAgICAgICAgYXdhaXQgYnVpbGQoJ3dyaXRlJywgW2luamVjdE1hbmlmZXN0VG9TV1BsdWdpbigpLCBicm90bGkoKV0pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gc3RhdHNFeHRyYWN0ZXJQbHVnaW4oKTogUGx1Z2luT3B0aW9uIHtcbiAgZnVuY3Rpb24gY29sbGVjdFRoZW1lSnNvbnNJbkZyb250ZW5kKHRoZW1lSnNvbkNvbnRlbnRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCB0aGVtZU5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHRoZW1lSnNvbiA9IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgc2V0dGluZ3MudGhlbWVGb2xkZXIsIHRoZW1lTmFtZSwgJ3RoZW1lLmpzb24nKTtcbiAgICBpZiAoZXhpc3RzU3luYyh0aGVtZUpzb24pKSB7XG4gICAgICBjb25zdCB0aGVtZUpzb25Db250ZW50ID0gcmVhZEZpbGVTeW5jKHRoZW1lSnNvbiwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KS5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpO1xuICAgICAgdGhlbWVKc29uQ29udGVudHNbdGhlbWVOYW1lXSA9IHRoZW1lSnNvbkNvbnRlbnQ7XG4gICAgICBjb25zdCB0aGVtZUpzb25PYmplY3QgPSBKU09OLnBhcnNlKHRoZW1lSnNvbkNvbnRlbnQpO1xuICAgICAgaWYgKHRoZW1lSnNvbk9iamVjdC5wYXJlbnQpIHtcbiAgICAgICAgY29sbGVjdFRoZW1lSnNvbnNJbkZyb250ZW5kKHRoZW1lSnNvbkNvbnRlbnRzLCB0aGVtZUpzb25PYmplY3QucGFyZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2YWFkaW46c3RhdHMnLFxuICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICBhc3luYyB3cml0ZUJ1bmRsZShvcHRpb25zOiBPdXRwdXRPcHRpb25zLCBidW5kbGU6IHsgW2ZpbGVOYW1lOiBzdHJpbmddOiBBc3NldEluZm8gfCBDaHVua0luZm8gfSkge1xuICAgICAgY29uc3QgbW9kdWxlcyA9IE9iamVjdC52YWx1ZXMoYnVuZGxlKS5mbGF0TWFwKChiKSA9PiAoYi5tb2R1bGVzID8gT2JqZWN0LmtleXMoYi5tb2R1bGVzKSA6IFtdKSk7XG4gICAgICBjb25zdCBub2RlTW9kdWxlc0ZvbGRlcnMgPSBtb2R1bGVzXG4gICAgICAgIC5tYXAoKGlkKSA9PiBpZC5yZXBsYWNlKC9cXFxcL2csICcvJykpXG4gICAgICAgIC5maWx0ZXIoKGlkKSA9PiBpZC5zdGFydHNXaXRoKG5vZGVNb2R1bGVzRm9sZGVyLnJlcGxhY2UoL1xcXFwvZywgJy8nKSkpXG4gICAgICAgIC5tYXAoKGlkKSA9PiBpZC5zdWJzdHJpbmcobm9kZU1vZHVsZXNGb2xkZXIubGVuZ3RoICsgMSkpO1xuICAgICAgY29uc3QgbnBtTW9kdWxlcyA9IG5vZGVNb2R1bGVzRm9sZGVyc1xuICAgICAgICAubWFwKChpZCkgPT4gaWQucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAubWFwKChpZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy8nKTtcbiAgICAgICAgICBpZiAoaWQuc3RhcnRzV2l0aCgnQCcpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFydHNbMF0gKyAnLycgKyBwYXJ0c1sxXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzWzBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnNvcnQoKVxuICAgICAgICAuZmlsdGVyKCh2YWx1ZSwgaW5kZXgsIHNlbGYpID0+IHNlbGYuaW5kZXhPZih2YWx1ZSkgPT09IGluZGV4KTtcbiAgICAgIGNvbnN0IG5wbU1vZHVsZUFuZFZlcnNpb24gPSBPYmplY3QuZnJvbUVudHJpZXMobnBtTW9kdWxlcy5tYXAoKG1vZHVsZSkgPT4gW21vZHVsZSwgZ2V0VmVyc2lvbihtb2R1bGUpXSkpO1xuICAgICAgY29uc3QgY3ZkbHMgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgIG5wbU1vZHVsZXNcbiAgICAgICAgICAuZmlsdGVyKChtb2R1bGUpID0+IGdldEN2ZGxOYW1lKG1vZHVsZSkgIT0gbnVsbClcbiAgICAgICAgICAubWFwKChtb2R1bGUpID0+IFttb2R1bGUsIHsgbmFtZTogZ2V0Q3ZkbE5hbWUobW9kdWxlKSwgdmVyc2lvbjogZ2V0VmVyc2lvbihtb2R1bGUpIH1dKVxuICAgICAgKTtcblxuICAgICAgbWtkaXJTeW5jKHBhdGguZGlybmFtZShzdGF0c0ZpbGUpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgIGNvbnN0IHByb2plY3RQYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHByb2plY3RQYWNrYWdlSnNvbkZpbGUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpO1xuXG4gICAgICBjb25zdCBlbnRyeVNjcmlwdHMgPSBPYmplY3QudmFsdWVzKGJ1bmRsZSlcbiAgICAgICAgLmZpbHRlcigoYnVuZGxlKSA9PiBidW5kbGUuaXNFbnRyeSlcbiAgICAgICAgLm1hcCgoYnVuZGxlKSA9PiBidW5kbGUuZmlsZU5hbWUpO1xuXG4gICAgICBjb25zdCBnZW5lcmF0ZWRJbmRleEh0bWwgPSBwYXRoLnJlc29sdmUoYnVpbGRPdXRwdXRGb2xkZXIsICdpbmRleC5odG1sJyk7XG4gICAgICBjb25zdCBjdXN0b21JbmRleERhdGE6IHN0cmluZyA9IHJlYWRGaWxlU3luYyhwcm9qZWN0SW5kZXhIdG1sLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkSW5kZXhEYXRhOiBzdHJpbmcgPSByZWFkRmlsZVN5bmMoZ2VuZXJhdGVkSW5kZXhIdG1sLCB7XG4gICAgICAgIGVuY29kaW5nOiAndXRmLTgnXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgY3VzdG9tSW5kZXhSb3dzID0gbmV3IFNldChjdXN0b21JbmRleERhdGEuc3BsaXQoL1tcXHJcXG5dLykuZmlsdGVyKChyb3cpID0+IHJvdy50cmltKCkgIT09ICcnKSk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRJbmRleFJvd3MgPSBnZW5lcmF0ZWRJbmRleERhdGEuc3BsaXQoL1tcXHJcXG5dLykuZmlsdGVyKChyb3cpID0+IHJvdy50cmltKCkgIT09ICcnKTtcblxuICAgICAgY29uc3Qgcm93c0dlbmVyYXRlZDogc3RyaW5nW10gPSBbXTtcbiAgICAgIGdlbmVyYXRlZEluZGV4Um93cy5mb3JFYWNoKChyb3cpID0+IHtcbiAgICAgICAgaWYgKCFjdXN0b21JbmRleFJvd3MuaGFzKHJvdykpIHtcbiAgICAgICAgICByb3dzR2VuZXJhdGVkLnB1c2gocm93KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vQWZ0ZXIgZGV2LWJ1bmRsZSBidWlsZCBhZGQgdXNlZCBGbG93IGZyb250ZW5kIGltcG9ydHMgSnNNb2R1bGUvSmF2YVNjcmlwdC9Dc3NJbXBvcnRcblxuICAgICAgY29uc3QgcGFyc2VJbXBvcnRzID0gKGZpbGVuYW1lOiBzdHJpbmcsIHJlc3VsdDogU2V0PHN0cmluZz4pOiB2b2lkID0+IHtcbiAgICAgICAgY29uc3QgY29udGVudDogc3RyaW5nID0gcmVhZEZpbGVTeW5jKGZpbGVuYW1lLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICAgICAgICBjb25zdCBsaW5lcyA9IGNvbnRlbnQuc3BsaXQoJ1xcbicpO1xuICAgICAgICBjb25zdCBzdGF0aWNJbXBvcnRzID0gbGluZXNcbiAgICAgICAgICAuZmlsdGVyKChsaW5lKSA9PiBsaW5lLnN0YXJ0c1dpdGgoJ2ltcG9ydCAnKSlcbiAgICAgICAgICAubWFwKChsaW5lKSA9PiBsaW5lLnN1YnN0cmluZyhsaW5lLmluZGV4T2YoXCInXCIpICsgMSwgbGluZS5sYXN0SW5kZXhPZihcIidcIikpKVxuICAgICAgICAgIC5tYXAoKGxpbmUpID0+IChsaW5lLmluY2x1ZGVzKCc/JykgPyBsaW5lLnN1YnN0cmluZygwLCBsaW5lLmxhc3RJbmRleE9mKCc/JykpIDogbGluZSkpO1xuICAgICAgICBjb25zdCBkeW5hbWljSW1wb3J0cyA9IGxpbmVzXG4gICAgICAgICAgLmZpbHRlcigobGluZSkgPT4gbGluZS5pbmNsdWRlcygnaW1wb3J0KCcpKVxuICAgICAgICAgIC5tYXAoKGxpbmUpID0+IGxpbmUucmVwbGFjZSgvLippbXBvcnRcXCgvLCAnJykpXG4gICAgICAgICAgLm1hcCgobGluZSkgPT4gbGluZS5zcGxpdCgvJy8pWzFdKVxuICAgICAgICAgIC5tYXAoKGxpbmUpID0+IChsaW5lLmluY2x1ZGVzKCc/JykgPyBsaW5lLnN1YnN0cmluZygwLCBsaW5lLmxhc3RJbmRleE9mKCc/JykpIDogbGluZSkpO1xuXG4gICAgICAgIHN0YXRpY0ltcG9ydHMuZm9yRWFjaCgoc3RhdGljSW1wb3J0KSA9PiByZXN1bHQuYWRkKHN0YXRpY0ltcG9ydCkpO1xuXG4gICAgICAgIGR5bmFtaWNJbXBvcnRzLm1hcCgoZHluYW1pY0ltcG9ydCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGltcG9ydGVkRmlsZSA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoZmlsZW5hbWUpLCBkeW5hbWljSW1wb3J0KTtcbiAgICAgICAgICBwYXJzZUltcG9ydHMoaW1wb3J0ZWRGaWxlLCByZXN1bHQpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGdlbmVyYXRlZEltcG9ydHNTZXQgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgIHBhcnNlSW1wb3J0cyhcbiAgICAgICAgcGF0aC5yZXNvbHZlKHRoZW1lT3B0aW9ucy5mcm9udGVuZEdlbmVyYXRlZEZvbGRlciwgJ2Zsb3cnLCAnZ2VuZXJhdGVkLWZsb3ctaW1wb3J0cy5qcycpLFxuICAgICAgICBnZW5lcmF0ZWRJbXBvcnRzU2V0XG4gICAgICApO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkSW1wb3J0cyA9IEFycmF5LmZyb20oZ2VuZXJhdGVkSW1wb3J0c1NldCkuc29ydCgpO1xuXG4gICAgICBjb25zdCBmcm9udGVuZEZpbGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5cbiAgICAgIGNvbnN0IHByb2plY3RGaWxlRXh0ZW5zaW9ucyA9IFsnLmpzJywgJy5qcy5tYXAnLCAnLnRzJywgJy50cy5tYXAnLCAnLnRzeCcsICcudHN4Lm1hcCcsICcuY3NzJywgJy5jc3MubWFwJ107XG5cbiAgICAgIGNvbnN0IGlzVGhlbWVDb21wb25lbnRzUmVzb3VyY2UgPSAoaWQ6IHN0cmluZykgPT5cbiAgICAgICAgICBpZC5zdGFydHNXaXRoKHRoZW1lT3B0aW9ucy5mcm9udGVuZEdlbmVyYXRlZEZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJykpXG4gICAgICAgICAgICAgICYmIGlkLm1hdGNoKC8uKlxcL2phci1yZXNvdXJjZXNcXC90aGVtZXNcXC9bXlxcL10rXFwvY29tcG9uZW50c1xcLy8pO1xuXG4gICAgICBjb25zdCBpc0dlbmVyYXRlZFdlYkNvbXBvbmVudFJlc291cmNlID0gKGlkOiBzdHJpbmcpID0+XG4gICAgICAgICAgaWQuc3RhcnRzV2l0aCh0aGVtZU9wdGlvbnMuZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAgICAgICAmJiBpZC5tYXRjaCgvLipcXC9mbG93XFwvd2ViLWNvbXBvbmVudHNcXC8vKTtcblxuICAgICAgY29uc3QgaXNGcm9udGVuZFJlc291cmNlQ29sbGVjdGVkID0gKGlkOiBzdHJpbmcpID0+XG4gICAgICAgICAgIWlkLnN0YXJ0c1dpdGgodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgICB8fCBpc1RoZW1lQ29tcG9uZW50c1Jlc291cmNlKGlkKVxuICAgICAgICAgIHx8IGlzR2VuZXJhdGVkV2ViQ29tcG9uZW50UmVzb3VyY2UoaWQpO1xuXG4gICAgICAvLyBjb2xsZWN0cyBwcm9qZWN0J3MgZnJvbnRlbmQgcmVzb3VyY2VzIGluIGZyb250ZW5kIGZvbGRlciwgZXhjbHVkaW5nXG4gICAgICAvLyAnZ2VuZXJhdGVkJyBzdWItZm9sZGVyLCBleGNlcHQgZm9yIGxlZ2FjeSBzaGFkb3cgRE9NIHN0eWxlc2hlZXRzXG4gICAgICAvLyBwYWNrYWdlZCBpbiBgdGhlbWUvY29tcG9uZW50cy9gIGZvbGRlclxuICAgICAgLy8gYW5kIGdlbmVyYXRlZCB3ZWIgY29tcG9uZW50IHJlc291cmNlcyBpbiBgZmxvdy93ZWItY29tcG9uZW50c2AgZm9sZGVyLlxuICAgICAgbW9kdWxlc1xuICAgICAgICAubWFwKChpZCkgPT4gaWQucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAuZmlsdGVyKChpZCkgPT4gaWQuc3RhcnRzV2l0aChmcm9udGVuZEZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJykpKVxuICAgICAgICAuZmlsdGVyKGlzRnJvbnRlbmRSZXNvdXJjZUNvbGxlY3RlZClcbiAgICAgICAgLm1hcCgoaWQpID0+IGlkLnN1YnN0cmluZyhmcm9udGVuZEZvbGRlci5sZW5ndGggKyAxKSlcbiAgICAgICAgLm1hcCgobGluZTogc3RyaW5nKSA9PiAobGluZS5pbmNsdWRlcygnPycpID8gbGluZS5zdWJzdHJpbmcoMCwgbGluZS5sYXN0SW5kZXhPZignPycpKSA6IGxpbmUpKVxuICAgICAgICAuZm9yRWFjaCgobGluZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgLy8gXFxyXFxuIGZyb20gd2luZG93cyBtYWRlIGZpbGVzIG1heSBiZSB1c2VkIHNvIGNoYW5nZSB0byBcXG5cbiAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgbGluZSk7XG4gICAgICAgICAgaWYgKHByb2plY3RGaWxlRXh0ZW5zaW9ucy5pbmNsdWRlcyhwYXRoLmV4dG5hbWUoZmlsZVBhdGgpKSkge1xuICAgICAgICAgICAgY29uc3QgZmlsZUJ1ZmZlciA9IHJlYWRGaWxlU3luYyhmaWxlUGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KS5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpO1xuICAgICAgICAgICAgZnJvbnRlbmRGaWxlc1tsaW5lXSA9IGNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShmaWxlQnVmZmVyLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgLy8gY29sbGVjdHMgZnJvbnRlbmQgcmVzb3VyY2VzIGZyb20gdGhlIEpBUnNcbiAgICAgIGdlbmVyYXRlZEltcG9ydHNcbiAgICAgICAgLmZpbHRlcigobGluZTogc3RyaW5nKSA9PiBsaW5lLmluY2x1ZGVzKCdnZW5lcmF0ZWQvamFyLXJlc291cmNlcycpKVxuICAgICAgICAuZm9yRWFjaCgobGluZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgbGV0IGZpbGVuYW1lID0gbGluZS5zdWJzdHJpbmcobGluZS5pbmRleE9mKCdnZW5lcmF0ZWQnKSk7XG4gICAgICAgICAgLy8gXFxyXFxuIGZyb20gd2luZG93cyBtYWRlIGZpbGVzIG1heSBiZSB1c2VkIHJvIHJlbW92ZSB0byBiZSBvbmx5IFxcblxuICAgICAgICAgIGNvbnN0IGZpbGVCdWZmZXIgPSByZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCBmaWxlbmFtZSksIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZShcbiAgICAgICAgICAgIC9cXHJcXG4vZyxcbiAgICAgICAgICAgICdcXG4nXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBoYXNoID0gY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKGZpbGVCdWZmZXIsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcblxuICAgICAgICAgIGNvbnN0IGZpbGVLZXkgPSBsaW5lLnN1YnN0cmluZyhsaW5lLmluZGV4T2YoJ2phci1yZXNvdXJjZXMvJykgKyAxNCk7XG4gICAgICAgICAgZnJvbnRlbmRGaWxlc1tmaWxlS2V5XSA9IGhhc2g7XG4gICAgICAgIH0pO1xuICAgICAgLy8gY29sbGVjdHMgYW5kIGhhc2ggcmVzdCBvZiB0aGUgRnJvbnRlbmQgcmVzb3VyY2VzIGV4Y2x1ZGluZyBmaWxlcyBpbiAvZ2VuZXJhdGVkLyBhbmQgL3RoZW1lcy9cbiAgICAgIC8vIGFuZCBmaWxlcyBhbHJlYWR5IGluIGZyb250ZW5kRmlsZXMuXG4gICAgICBsZXQgZnJvbnRlbmRGb2xkZXJBbGlhcyA9IFwiRnJvbnRlbmRcIjtcbiAgICAgIGdlbmVyYXRlZEltcG9ydHNcbiAgICAgICAgLmZpbHRlcigobGluZTogc3RyaW5nKSA9PiBsaW5lLnN0YXJ0c1dpdGgoZnJvbnRlbmRGb2xkZXJBbGlhcyArICcvJykpXG4gICAgICAgIC5maWx0ZXIoKGxpbmU6IHN0cmluZykgPT4gIWxpbmUuc3RhcnRzV2l0aChmcm9udGVuZEZvbGRlckFsaWFzICsgJy9nZW5lcmF0ZWQvJykpXG4gICAgICAgIC5maWx0ZXIoKGxpbmU6IHN0cmluZykgPT4gIWxpbmUuc3RhcnRzV2l0aChmcm9udGVuZEZvbGRlckFsaWFzICsgJy90aGVtZXMvJykpXG4gICAgICAgIC5tYXAoKGxpbmUpID0+IGxpbmUuc3Vic3RyaW5nKGZyb250ZW5kRm9sZGVyQWxpYXMubGVuZ3RoICsgMSkpXG4gICAgICAgIC5maWx0ZXIoKGxpbmU6IHN0cmluZykgPT4gIWZyb250ZW5kRmlsZXNbbGluZV0pXG4gICAgICAgIC5mb3JFYWNoKChsaW5lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgbGluZSk7XG4gICAgICAgICAgaWYgKHByb2plY3RGaWxlRXh0ZW5zaW9ucy5pbmNsdWRlcyhwYXRoLmV4dG5hbWUoZmlsZVBhdGgpKSAmJiBleGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgICAgICAgY29uc3QgZmlsZUJ1ZmZlciA9IHJlYWRGaWxlU3luYyhmaWxlUGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KS5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpO1xuICAgICAgICAgICAgZnJvbnRlbmRGaWxlc1tsaW5lXSA9IGNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShmaWxlQnVmZmVyLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIC8vIElmIGEgaW5kZXgudHMgZXhpc3RzIGhhc2ggaXQgdG8gYmUgYWJsZSB0byBzZWUgaWYgaXQgY2hhbmdlcy5cbiAgICAgIGlmIChleGlzdHNTeW5jKHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ2luZGV4LnRzJykpKSB7XG4gICAgICAgIGNvbnN0IGZpbGVCdWZmZXIgPSByZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCAnaW5kZXgudHMnKSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KS5yZXBsYWNlKFxuICAgICAgICAgIC9cXHJcXG4vZyxcbiAgICAgICAgICAnXFxuJ1xuICAgICAgICApO1xuICAgICAgICBmcm9udGVuZEZpbGVzW2BpbmRleC50c2BdID0gY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKGZpbGVCdWZmZXIsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGhlbWVKc29uQ29udGVudHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICAgIGNvbnN0IHRoZW1lc0ZvbGRlciA9IHBhdGgucmVzb2x2ZShqYXJSZXNvdXJjZXNGb2xkZXIsICd0aGVtZXMnKTtcbiAgICAgIGlmIChleGlzdHNTeW5jKHRoZW1lc0ZvbGRlcikpIHtcbiAgICAgICAgcmVhZGRpclN5bmModGhlbWVzRm9sZGVyKS5mb3JFYWNoKCh0aGVtZUZvbGRlcikgPT4ge1xuICAgICAgICAgIGNvbnN0IHRoZW1lSnNvbiA9IHBhdGgucmVzb2x2ZSh0aGVtZXNGb2xkZXIsIHRoZW1lRm9sZGVyLCAndGhlbWUuanNvbicpO1xuICAgICAgICAgIGlmIChleGlzdHNTeW5jKHRoZW1lSnNvbikpIHtcbiAgICAgICAgICAgIHRoZW1lSnNvbkNvbnRlbnRzW3BhdGguYmFzZW5hbWUodGhlbWVGb2xkZXIpXSA9IHJlYWRGaWxlU3luYyh0aGVtZUpzb24sIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZShcbiAgICAgICAgICAgICAgL1xcclxcbi9nLFxuICAgICAgICAgICAgICAnXFxuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb2xsZWN0VGhlbWVKc29uc0luRnJvbnRlbmQodGhlbWVKc29uQ29udGVudHMsIHNldHRpbmdzLnRoZW1lTmFtZSk7XG5cbiAgICAgIGxldCB3ZWJDb21wb25lbnRzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgaWYgKHdlYkNvbXBvbmVudFRhZ3MpIHtcbiAgICAgICAgd2ViQ29tcG9uZW50cyA9IHdlYkNvbXBvbmVudFRhZ3Muc3BsaXQoJzsnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RhdHMgPSB7XG4gICAgICAgIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzOiBwcm9qZWN0UGFja2FnZUpzb24uZGVwZW5kZW5jaWVzLFxuICAgICAgICBucG1Nb2R1bGVzOiBucG1Nb2R1bGVBbmRWZXJzaW9uLFxuICAgICAgICBidW5kbGVJbXBvcnRzOiBnZW5lcmF0ZWRJbXBvcnRzLFxuICAgICAgICBmcm9udGVuZEhhc2hlczogZnJvbnRlbmRGaWxlcyxcbiAgICAgICAgdGhlbWVKc29uQ29udGVudHM6IHRoZW1lSnNvbkNvbnRlbnRzLFxuICAgICAgICBlbnRyeVNjcmlwdHMsXG4gICAgICAgIHdlYkNvbXBvbmVudHMsXG4gICAgICAgIGN2ZGxNb2R1bGVzOiBjdmRscyxcbiAgICAgICAgcGFja2FnZUpzb25IYXNoOiBwcm9qZWN0UGFja2FnZUpzb24/LnZhYWRpbj8uaGFzaCxcbiAgICAgICAgaW5kZXhIdG1sR2VuZXJhdGVkOiByb3dzR2VuZXJhdGVkXG4gICAgICB9O1xuICAgICAgd3JpdGVGaWxlU3luYyhzdGF0c0ZpbGUsIEpTT04uc3RyaW5naWZ5KHN0YXRzLCBudWxsLCAxKSk7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gdmFhZGluQnVuZGxlc1BsdWdpbigpOiBQbHVnaW5PcHRpb24ge1xuICB0eXBlIEV4cG9ydEluZm8gPVxuICAgIHwgc3RyaW5nXG4gICAgfCB7XG4gICAgICAgIG5hbWVzcGFjZT86IHN0cmluZztcbiAgICAgICAgc291cmNlOiBzdHJpbmc7XG4gICAgICB9O1xuXG4gIHR5cGUgRXhwb3NlSW5mbyA9IHtcbiAgICBleHBvcnRzOiBFeHBvcnRJbmZvW107XG4gIH07XG5cbiAgdHlwZSBQYWNrYWdlSW5mbyA9IHtcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XG4gICAgZXhwb3NlczogUmVjb3JkPHN0cmluZywgRXhwb3NlSW5mbz47XG4gIH07XG5cbiAgdHlwZSBCdW5kbGVKc29uID0ge1xuICAgIHBhY2thZ2VzOiBSZWNvcmQ8c3RyaW5nLCBQYWNrYWdlSW5mbz47XG4gIH07XG5cbiAgY29uc3QgZGlzYWJsZWRNZXNzYWdlID0gJ1ZhYWRpbiBjb21wb25lbnQgZGVwZW5kZW5jeSBidW5kbGVzIGFyZSBkaXNhYmxlZC4nO1xuXG4gIGNvbnN0IG1vZHVsZXNEaXJlY3RvcnkgPSBub2RlTW9kdWxlc0ZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cbiAgbGV0IHZhYWRpbkJ1bmRsZUpzb246IEJ1bmRsZUpzb247XG5cbiAgZnVuY3Rpb24gcGFyc2VNb2R1bGVJZChpZDogc3RyaW5nKTogeyBwYWNrYWdlTmFtZTogc3RyaW5nOyBtb2R1bGVQYXRoOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgW3Njb3BlLCBzY29wZWRQYWNrYWdlTmFtZV0gPSBpZC5zcGxpdCgnLycsIDMpO1xuICAgIGNvbnN0IHBhY2thZ2VOYW1lID0gc2NvcGUuc3RhcnRzV2l0aCgnQCcpID8gYCR7c2NvcGV9LyR7c2NvcGVkUGFja2FnZU5hbWV9YCA6IHNjb3BlO1xuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBgLiR7aWQuc3Vic3RyaW5nKHBhY2thZ2VOYW1lLmxlbmd0aCl9YDtcbiAgICByZXR1cm4ge1xuICAgICAgcGFja2FnZU5hbWUsXG4gICAgICBtb2R1bGVQYXRoXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEV4cG9ydHMoaWQ6IHN0cmluZyk6IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCB7IHBhY2thZ2VOYW1lLCBtb2R1bGVQYXRoIH0gPSBwYXJzZU1vZHVsZUlkKGlkKTtcbiAgICBjb25zdCBwYWNrYWdlSW5mbyA9IHZhYWRpbkJ1bmRsZUpzb24ucGFja2FnZXNbcGFja2FnZU5hbWVdO1xuXG4gICAgaWYgKCFwYWNrYWdlSW5mbykgcmV0dXJuO1xuXG4gICAgY29uc3QgZXhwb3NlSW5mbzogRXhwb3NlSW5mbyA9IHBhY2thZ2VJbmZvLmV4cG9zZXNbbW9kdWxlUGF0aF07XG4gICAgaWYgKCFleHBvc2VJbmZvKSByZXR1cm47XG5cbiAgICBjb25zdCBleHBvcnRzU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBlIG9mIGV4cG9zZUluZm8uZXhwb3J0cykge1xuICAgICAgaWYgKHR5cGVvZiBlID09PSAnc3RyaW5nJykge1xuICAgICAgICBleHBvcnRzU2V0LmFkZChlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHsgbmFtZXNwYWNlLCBzb3VyY2UgfSA9IGU7XG4gICAgICAgIGlmIChuYW1lc3BhY2UpIHtcbiAgICAgICAgICBleHBvcnRzU2V0LmFkZChuYW1lc3BhY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZUV4cG9ydHMgPSBnZXRFeHBvcnRzKHNvdXJjZSk7XG4gICAgICAgICAgaWYgKHNvdXJjZUV4cG9ydHMpIHtcbiAgICAgICAgICAgIHNvdXJjZUV4cG9ydHMuZm9yRWFjaCgoZSkgPT4gZXhwb3J0c1NldC5hZGQoZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuZnJvbShleHBvcnRzU2V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEV4cG9ydEJpbmRpbmcoYmluZGluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGJpbmRpbmcgPT09ICdkZWZhdWx0JyA/ICdfZGVmYXVsdCBhcyBkZWZhdWx0JyA6IGJpbmRpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJbXBvcnRBc3NpZ21lbnQoYmluZGluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGJpbmRpbmcgPT09ICdkZWZhdWx0JyA/ICdkZWZhdWx0OiBfZGVmYXVsdCcgOiBiaW5kaW5nO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOmJ1bmRsZXMnLFxuICAgIGVuZm9yY2U6ICdwcmUnLFxuICAgIGFwcGx5KGNvbmZpZywgeyBjb21tYW5kIH0pIHtcbiAgICAgIGlmIChjb21tYW5kICE9PSAnc2VydmUnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhYWRpbkJ1bmRsZUpzb25QYXRoID0gcmVxdWlyZS5yZXNvbHZlKCdAdmFhZGluL2J1bmRsZXMvdmFhZGluLWJ1bmRsZS5qc29uJyk7XG4gICAgICAgIHZhYWRpbkJ1bmRsZUpzb24gPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyh2YWFkaW5CdW5kbGVKc29uUGF0aCwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pKTtcbiAgICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlID09PSAnb2JqZWN0JyAmJiAoZSBhcyB7IGNvZGU6IHN0cmluZyB9KS5jb2RlID09PSAnTU9EVUxFX05PVF9GT1VORCcpIHtcbiAgICAgICAgICB2YWFkaW5CdW5kbGVKc29uID0geyBwYWNrYWdlczoge30gfTtcbiAgICAgICAgICBjb25zb2xlLmluZm8oYEB2YWFkaW4vYnVuZGxlcyBucG0gcGFja2FnZSBpcyBub3QgZm91bmQsICR7ZGlzYWJsZWRNZXNzYWdlfWApO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZlcnNpb25NaXNtYXRjaGVzOiBBcnJheTx7IG5hbWU6IHN0cmluZzsgYnVuZGxlZFZlcnNpb246IHN0cmluZzsgaW5zdGFsbGVkVmVyc2lvbjogc3RyaW5nIH0+ID0gW107XG4gICAgICBmb3IgKGNvbnN0IFtuYW1lLCBwYWNrYWdlSW5mb10gb2YgT2JqZWN0LmVudHJpZXModmFhZGluQnVuZGxlSnNvbi5wYWNrYWdlcykpIHtcbiAgICAgICAgbGV0IGluc3RhbGxlZFZlcnNpb246IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCB7IHZlcnNpb246IGJ1bmRsZWRWZXJzaW9uIH0gPSBwYWNrYWdlSW5mbztcbiAgICAgICAgICBjb25zdCBpbnN0YWxsZWRQYWNrYWdlSnNvbkZpbGUgPSBwYXRoLnJlc29sdmUobW9kdWxlc0RpcmVjdG9yeSwgbmFtZSwgJ3BhY2thZ2UuanNvbicpO1xuICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMoaW5zdGFsbGVkUGFja2FnZUpzb25GaWxlLCB7IGVuY29kaW5nOiAndXRmOCcgfSkpO1xuICAgICAgICAgIGluc3RhbGxlZFZlcnNpb24gPSBwYWNrYWdlSnNvbi52ZXJzaW9uO1xuICAgICAgICAgIGlmIChpbnN0YWxsZWRWZXJzaW9uICYmIGluc3RhbGxlZFZlcnNpb24gIT09IGJ1bmRsZWRWZXJzaW9uKSB7XG4gICAgICAgICAgICB2ZXJzaW9uTWlzbWF0Y2hlcy5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgYnVuZGxlZFZlcnNpb24sXG4gICAgICAgICAgICAgIGluc3RhbGxlZFZlcnNpb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIC8vIGlnbm9yZSBwYWNrYWdlIG5vdCBmb3VuZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmVyc2lvbk1pc21hdGNoZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgQHZhYWRpbi9idW5kbGVzIGhhcyB2ZXJzaW9uIG1pc21hdGNoZXMgd2l0aCBpbnN0YWxsZWQgcGFja2FnZXMsICR7ZGlzYWJsZWRNZXNzYWdlfWApO1xuICAgICAgICBjb25zb2xlLmluZm8oYFBhY2thZ2VzIHdpdGggdmVyc2lvbiBtaXNtYXRjaGVzOiAke0pTT04uc3RyaW5naWZ5KHZlcnNpb25NaXNtYXRjaGVzLCB1bmRlZmluZWQsIDIpfWApO1xuICAgICAgICB2YWFkaW5CdW5kbGVKc29uID0geyBwYWNrYWdlczoge30gfTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGFzeW5jIGNvbmZpZyhjb25maWcpIHtcbiAgICAgIHJldHVybiBtZXJnZUNvbmZpZyhcbiAgICAgICAge1xuICAgICAgICAgIG9wdGltaXplRGVwczoge1xuICAgICAgICAgICAgZXhjbHVkZTogW1xuICAgICAgICAgICAgICAvLyBWYWFkaW4gYnVuZGxlXG4gICAgICAgICAgICAgICdAdmFhZGluL2J1bmRsZXMnLFxuICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyh2YWFkaW5CdW5kbGVKc29uLnBhY2thZ2VzKSxcbiAgICAgICAgICAgICAgJ0B2YWFkaW4vdmFhZGluLW1hdGVyaWFsLXN0eWxlcydcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ1xuICAgICAgKTtcbiAgICB9LFxuICAgIGxvYWQocmF3SWQpIHtcbiAgICAgIGNvbnN0IFtwYXRoLCBwYXJhbXNdID0gcmF3SWQuc3BsaXQoJz8nKTtcbiAgICAgIGlmICghcGF0aC5zdGFydHNXaXRoKG1vZHVsZXNEaXJlY3RvcnkpKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGlkID0gcGF0aC5zdWJzdHJpbmcobW9kdWxlc0RpcmVjdG9yeS5sZW5ndGggKyAxKTtcbiAgICAgIGNvbnN0IGJpbmRpbmdzID0gZ2V0RXhwb3J0cyhpZCk7XG4gICAgICBpZiAoYmluZGluZ3MgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBjYWNoZVN1ZmZpeCA9IHBhcmFtcyA/IGA/JHtwYXJhbXN9YCA6ICcnO1xuICAgICAgY29uc3QgYnVuZGxlUGF0aCA9IGBAdmFhZGluL2J1bmRsZXMvdmFhZGluLmpzJHtjYWNoZVN1ZmZpeH1gO1xuXG4gICAgICByZXR1cm4gYGltcG9ydCB7IGluaXQgYXMgVmFhZGluQnVuZGxlSW5pdCwgZ2V0IGFzIFZhYWRpbkJ1bmRsZUdldCB9IGZyb20gJyR7YnVuZGxlUGF0aH0nO1xuYXdhaXQgVmFhZGluQnVuZGxlSW5pdCgnZGVmYXVsdCcpO1xuY29uc3QgeyAke2JpbmRpbmdzLm1hcChnZXRJbXBvcnRBc3NpZ21lbnQpLmpvaW4oJywgJyl9IH0gPSAoYXdhaXQgVmFhZGluQnVuZGxlR2V0KCcuL25vZGVfbW9kdWxlcy8ke2lkfScpKSgpO1xuZXhwb3J0IHsgJHtiaW5kaW5ncy5tYXAoZ2V0RXhwb3J0QmluZGluZykuam9pbignLCAnKX0gfTtgO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gdGhlbWVQbHVnaW4ob3B0czogeyBkZXZNb2RlOiBib29sZWFuIH0pOiBQbHVnaW5PcHRpb24ge1xuICBjb25zdCBmdWxsVGhlbWVPcHRpb25zID0geyAuLi50aGVtZU9wdGlvbnMsIGRldk1vZGU6IG9wdHMuZGV2TW9kZSB9O1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2YWFkaW46dGhlbWUnLFxuICAgIGNvbmZpZygpIHtcbiAgICAgIHByb2Nlc3NUaGVtZVJlc291cmNlcyhmdWxsVGhlbWVPcHRpb25zLCBjb25zb2xlKTtcbiAgICB9LFxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIGZ1bmN0aW9uIGhhbmRsZVRoZW1lRmlsZUNyZWF0ZURlbGV0ZSh0aGVtZUZpbGU6IHN0cmluZywgc3RhdHM/OiBTdGF0cykge1xuICAgICAgICBpZiAodGhlbWVGaWxlLnN0YXJ0c1dpdGgodGhlbWVGb2xkZXIpKSB7XG4gICAgICAgICAgY29uc3QgY2hhbmdlZCA9IHBhdGgucmVsYXRpdmUodGhlbWVGb2xkZXIsIHRoZW1lRmlsZSk7XG4gICAgICAgICAgY29uc29sZS5kZWJ1ZygnVGhlbWUgZmlsZSAnICsgKCEhc3RhdHMgPyAnY3JlYXRlZCcgOiAnZGVsZXRlZCcpLCBjaGFuZ2VkKTtcbiAgICAgICAgICBwcm9jZXNzVGhlbWVSZXNvdXJjZXMoZnVsbFRoZW1lT3B0aW9ucywgY29uc29sZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNlcnZlci53YXRjaGVyLm9uKCdhZGQnLCBoYW5kbGVUaGVtZUZpbGVDcmVhdGVEZWxldGUpO1xuICAgICAgc2VydmVyLndhdGNoZXIub24oJ3VubGluaycsIGhhbmRsZVRoZW1lRmlsZUNyZWF0ZURlbGV0ZSk7XG4gICAgfSxcbiAgICBoYW5kbGVIb3RVcGRhdGUoY29udGV4dCkge1xuICAgICAgY29uc3QgY29udGV4dFBhdGggPSBwYXRoLnJlc29sdmUoY29udGV4dC5maWxlKTtcbiAgICAgIGNvbnN0IHRoZW1lUGF0aCA9IHBhdGgucmVzb2x2ZSh0aGVtZUZvbGRlcik7XG4gICAgICBpZiAoY29udGV4dFBhdGguc3RhcnRzV2l0aCh0aGVtZVBhdGgpKSB7XG4gICAgICAgIGNvbnN0IGNoYW5nZWQgPSBwYXRoLnJlbGF0aXZlKHRoZW1lUGF0aCwgY29udGV4dFBhdGgpO1xuXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ1RoZW1lIGZpbGUgY2hhbmdlZCcsIGNoYW5nZWQpO1xuXG4gICAgICAgIGlmIChjaGFuZ2VkLnN0YXJ0c1dpdGgoc2V0dGluZ3MudGhlbWVOYW1lKSkge1xuICAgICAgICAgIHByb2Nlc3NUaGVtZVJlc291cmNlcyhmdWxsVGhlbWVPcHRpb25zLCBjb25zb2xlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgcmVzb2x2ZUlkKGlkLCBpbXBvcnRlcikge1xuICAgICAgLy8gZm9yY2UgdGhlbWUgZ2VuZXJhdGlvbiBpZiBnZW5lcmF0ZWQgdGhlbWUgc291cmNlcyBkb2VzIG5vdCB5ZXQgZXhpc3RcbiAgICAgIC8vIHRoaXMgbWF5IGhhcHBlbiBmb3IgZXhhbXBsZSBkdXJpbmcgSmF2YSBob3QgcmVsb2FkIHdoZW4gdXBkYXRpbmdcbiAgICAgIC8vIEBUaGVtZSBhbm5vdGF0aW9uIHZhbHVlXG4gICAgICBpZiAoXG4gICAgICAgIHBhdGgucmVzb2x2ZSh0aGVtZU9wdGlvbnMuZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIsICd0aGVtZS5qcycpID09PSBpbXBvcnRlciAmJlxuICAgICAgICAhZXhpc3RzU3luYyhwYXRoLnJlc29sdmUodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCBpZCkpXG4gICAgICApIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnR2VuZXJhdGUgdGhlbWUgZmlsZSAnICsgaWQgKyAnIG5vdCBleGlzdGluZy4gUHJvY2Vzc2luZyB0aGVtZSByZXNvdXJjZScpO1xuICAgICAgICBwcm9jZXNzVGhlbWVSZXNvdXJjZXMoZnVsbFRoZW1lT3B0aW9ucywgY29uc29sZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghaWQuc3RhcnRzV2l0aChzZXR0aW5ncy50aGVtZUZvbGRlcikpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBsb2NhdGlvbiBvZiBbdGhlbWVSZXNvdXJjZUZvbGRlciwgZnJvbnRlbmRGb2xkZXJdKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucmVzb2x2ZShwYXRoLnJlc29sdmUobG9jYXRpb24sIGlkKSk7XG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyB0cmFuc2Zvcm0ocmF3LCBpZCwgb3B0aW9ucykge1xuICAgICAgLy8gcmV3cml0ZSB1cmxzIGZvciB0aGUgYXBwbGljYXRpb24gdGhlbWUgY3NzIGZpbGVzXG4gICAgICBjb25zdCBbYmFyZUlkLCBxdWVyeV0gPSBpZC5zcGxpdCgnPycpO1xuICAgICAgaWYgKFxuICAgICAgICAoIWJhcmVJZD8uc3RhcnRzV2l0aCh0aGVtZUZvbGRlcikgJiYgIWJhcmVJZD8uc3RhcnRzV2l0aCh0aGVtZU9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlcikpIHx8XG4gICAgICAgICFiYXJlSWQ/LmVuZHNXaXRoKCcuY3NzJylcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByZXNvdXJjZVRoZW1lRm9sZGVyID0gYmFyZUlkLnN0YXJ0c1dpdGgodGhlbWVGb2xkZXIpID8gdGhlbWVGb2xkZXIgOiB0aGVtZU9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlcjtcbiAgICAgIGNvbnN0IFt0aGVtZU5hbWVdID0gIGJhcmVJZC5zdWJzdHJpbmcocmVzb3VyY2VUaGVtZUZvbGRlci5sZW5ndGggKyAxKS5zcGxpdCgnLycpO1xuICAgICAgcmV0dXJuIHJld3JpdGVDc3NVcmxzKHJhdywgcGF0aC5kaXJuYW1lKGJhcmVJZCksIHBhdGgucmVzb2x2ZShyZXNvdXJjZVRoZW1lRm9sZGVyLCB0aGVtZU5hbWUpLCBjb25zb2xlLCBvcHRzKTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHJ1bldhdGNoRG9nKHdhdGNoRG9nUG9ydDogbnVtYmVyLCB3YXRjaERvZ0hvc3Q6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuICBjb25zdCBjbGllbnQgPSBuZXcgbmV0LlNvY2tldCgpO1xuICBjbGllbnQuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgY2xpZW50Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBjb25zb2xlLmxvZygnV2F0Y2hkb2cgY29ubmVjdGlvbiBlcnJvci4gVGVybWluYXRpbmcgdml0ZSBwcm9jZXNzLi4uJywgZXJyKTtcbiAgICBjbGllbnQuZGVzdHJveSgpO1xuICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgfSk7XG4gIGNsaWVudC5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICBydW5XYXRjaERvZyh3YXRjaERvZ1BvcnQsIHdhdGNoRG9nSG9zdCk7XG4gIH0pO1xuXG4gIGNsaWVudC5jb25uZWN0KHdhdGNoRG9nUG9ydCwgd2F0Y2hEb2dIb3N0IHx8ICdsb2NhbGhvc3QnKTtcbn1cblxuY29uc3QgYWxsb3dlZEZyb250ZW5kRm9sZGVycyA9IFtmcm9udGVuZEZvbGRlciwgbm9kZU1vZHVsZXNGb2xkZXJdO1xuXG5mdW5jdGlvbiBzaG93UmVjb21waWxlUmVhc29uKCk6IFBsdWdpbk9wdGlvbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjp3aHkteW91LWNvbXBpbGUnLFxuICAgIGhhbmRsZUhvdFVwZGF0ZShjb250ZXh0KSB7XG4gICAgICBjb25zb2xlLmxvZygnUmVjb21waWxpbmcgYmVjYXVzZScsIGNvbnRleHQuZmlsZSwgJ2NoYW5nZWQnKTtcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IERFVl9NT0RFX1NUQVJUX1JFR0VYUCA9IC9cXC9cXCpbXFwqIV1cXHMrdmFhZGluLWRldi1tb2RlOnN0YXJ0LztcbmNvbnN0IERFVl9NT0RFX0NPREVfUkVHRVhQID0gL1xcL1xcKltcXCohXVxccyt2YWFkaW4tZGV2LW1vZGU6c3RhcnQoW1xcc1xcU10qKXZhYWRpbi1kZXYtbW9kZTplbmRcXHMrXFwqXFwqXFwvL2k7XG5cbmZ1bmN0aW9uIHByZXNlcnZlVXNhZ2VTdGF0cygpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOnByZXNlcnZlLXVzYWdlLXN0YXRzJyxcblxuICAgIHRyYW5zZm9ybShzcmM6IHN0cmluZywgaWQ6IHN0cmluZykge1xuICAgICAgaWYgKGlkLmluY2x1ZGVzKCd2YWFkaW4tdXNhZ2Utc3RhdGlzdGljcycpKSB7XG4gICAgICAgIGlmIChzcmMuaW5jbHVkZXMoJ3ZhYWRpbi1kZXYtbW9kZTpzdGFydCcpKSB7XG4gICAgICAgICAgY29uc3QgbmV3U3JjID0gc3JjLnJlcGxhY2UoREVWX01PREVfU1RBUlRfUkVHRVhQLCAnLyohIHZhYWRpbi1kZXYtbW9kZTpzdGFydCcpO1xuICAgICAgICAgIGlmIChuZXdTcmMgPT09IHNyYykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tbWVudCByZXBsYWNlbWVudCBmYWlsZWQgdG8gY2hhbmdlIGFueXRoaW5nJyk7XG4gICAgICAgICAgfSBlbHNlIGlmICghbmV3U3JjLm1hdGNoKERFVl9NT0RFX0NPREVfUkVHRVhQKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignTmV3IGNvbW1lbnQgZmFpbHMgdG8gbWF0Y2ggb3JpZ2luYWwgcmVnZXhwJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7IGNvZGU6IG5ld1NyYyB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4geyBjb2RlOiBzcmMgfTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCB2YWFkaW5Db25maWc6IFVzZXJDb25maWdGbiA9IChlbnYpID0+IHtcbiAgY29uc3QgZGV2TW9kZSA9IGVudi5tb2RlID09PSAnZGV2ZWxvcG1lbnQnO1xuICBjb25zdCBwcm9kdWN0aW9uTW9kZSA9ICFkZXZNb2RlICYmICFkZXZCdW5kbGVcblxuICBpZiAoZGV2TW9kZSAmJiBwcm9jZXNzLmVudi53YXRjaERvZ1BvcnQpIHtcbiAgICAvLyBPcGVuIGEgY29ubmVjdGlvbiB3aXRoIHRoZSBKYXZhIGRldi1tb2RlIGhhbmRsZXIgaW4gb3JkZXIgdG8gZmluaXNoXG4gICAgLy8gdml0ZSB3aGVuIGl0IGV4aXRzIG9yIGNyYXNoZXMuXG4gICAgcnVuV2F0Y2hEb2cocGFyc2VJbnQocHJvY2Vzcy5lbnYud2F0Y2hEb2dQb3J0KSwgcHJvY2Vzcy5lbnYud2F0Y2hEb2dIb3N0KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcm9vdDogZnJvbnRlbmRGb2xkZXIsXG4gICAgYmFzZTogJycsXG4gICAgcHVibGljRGlyOiBmYWxzZSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQHZhYWRpbi9mbG93LWZyb250ZW5kJzogamFyUmVzb3VyY2VzRm9sZGVyLFxuICAgICAgICBGcm9udGVuZDogZnJvbnRlbmRGb2xkZXJcbiAgICAgIH0sXG4gICAgICBwcmVzZXJ2ZVN5bWxpbmtzOiB0cnVlXG4gICAgfSxcbiAgICBkZWZpbmU6IHtcbiAgICAgIE9GRkxJTkVfUEFUSDogc2V0dGluZ3Mub2ZmbGluZVBhdGgsXG4gICAgICBWSVRFX0VOQUJMRUQ6ICd0cnVlJ1xuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0OiAnMTI3LjAuMC4xJyxcbiAgICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gICAgICBmczoge1xuICAgICAgICBhbGxvdzogYWxsb3dlZEZyb250ZW5kRm9sZGVyc1xuICAgICAgfVxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIG1pbmlmeTogcHJvZHVjdGlvbk1vZGUsXG4gICAgICBvdXREaXI6IGJ1aWxkT3V0cHV0Rm9sZGVyLFxuICAgICAgZW1wdHlPdXREaXI6IGRldkJ1bmRsZSxcbiAgICAgIGFzc2V0c0RpcjogJ1ZBQURJTi9idWlsZCcsXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgaW5kZXhodG1sOiBwcm9qZWN0SW5kZXhIdG1sLFxuXG4gICAgICAgICAgLi4uKGhhc0V4cG9ydGVkV2ViQ29tcG9uZW50cyA/IHsgd2ViY29tcG9uZW50aHRtbDogcGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCAnd2ViLWNvbXBvbmVudC5odG1sJykgfSA6IHt9KVxuICAgICAgICB9LFxuICAgICAgICBvbndhcm46ICh3YXJuaW5nOiByb2xsdXAuUm9sbHVwTG9nLCBkZWZhdWx0SGFuZGxlcjogcm9sbHVwLkxvZ2dpbmdGdW5jdGlvbikgPT4ge1xuICAgICAgICAgIGNvbnN0IGlnbm9yZUV2YWxXYXJuaW5nID0gW1xuICAgICAgICAgICAgJ2dlbmVyYXRlZC9qYXItcmVzb3VyY2VzL0Zsb3dDbGllbnQuanMnLFxuICAgICAgICAgICAgJ2dlbmVyYXRlZC9qYXItcmVzb3VyY2VzL3ZhYWRpbi1zcHJlYWRzaGVldC9zcHJlYWRzaGVldC1leHBvcnQuanMnLFxuICAgICAgICAgICAgJ0B2YWFkaW4vY2hhcnRzL3NyYy9oZWxwZXJzLmpzJ1xuICAgICAgICAgIF07XG4gICAgICAgICAgaWYgKHdhcm5pbmcuY29kZSA9PT0gJ0VWQUwnICYmIHdhcm5pbmcuaWQgJiYgISFpZ25vcmVFdmFsV2FybmluZy5maW5kKChpZCkgPT4gd2FybmluZy5pZD8uZW5kc1dpdGgoaWQpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWZhdWx0SGFuZGxlcih3YXJuaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBlbnRyaWVzOiBbXG4gICAgICAgIC8vIFByZS1zY2FuIGVudHJ5cG9pbnRzIGluIFZpdGUgdG8gYXZvaWQgcmVsb2FkaW5nIG9uIGZpcnN0IG9wZW5cbiAgICAgICAgJ2dlbmVyYXRlZC92YWFkaW4udHMnXG4gICAgICBdLFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnQHZhYWRpbi9yb3V0ZXInLFxuICAgICAgICAnQHZhYWRpbi92YWFkaW4tbGljZW5zZS1jaGVja2VyJyxcbiAgICAgICAgJ0B2YWFkaW4vdmFhZGluLXVzYWdlLXN0YXRpc3RpY3MnLFxuICAgICAgICAnd29ya2JveC1jb3JlJyxcbiAgICAgICAgJ3dvcmtib3gtcHJlY2FjaGluZycsXG4gICAgICAgICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAnd29ya2JveC1zdHJhdGVnaWVzJ1xuICAgICAgXVxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcHJvZHVjdGlvbk1vZGUgJiYgYnJvdGxpKCksXG4gICAgICBkZXZNb2RlICYmIHZhYWRpbkJ1bmRsZXNQbHVnaW4oKSxcbiAgICAgIGRldk1vZGUgJiYgc2hvd1JlY29tcGlsZVJlYXNvbigpLFxuICAgICAgc2V0dGluZ3Mub2ZmbGluZUVuYWJsZWQgJiYgYnVpbGRTV1BsdWdpbih7IGRldk1vZGUgfSksXG4gICAgICAhZGV2TW9kZSAmJiBzdGF0c0V4dHJhY3RlclBsdWdpbigpLFxuICAgICAgIXByb2R1Y3Rpb25Nb2RlICYmIHByZXNlcnZlVXNhZ2VTdGF0cygpLFxuICAgICAgdGhlbWVQbHVnaW4oeyBkZXZNb2RlIH0pLFxuICAgICAgcG9zdGNzc0xpdCh7XG4gICAgICAgIGluY2x1ZGU6IFsnKiovKi5jc3MnLCAvLipcXC8uKlxcLmNzc1xcPy4qL10sXG4gICAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgICBgJHt0aGVtZUZvbGRlcn0vKiovKi5jc3NgLFxuICAgICAgICAgIG5ldyBSZWdFeHAoYCR7dGhlbWVGb2xkZXJ9Ly4qLy4qXFxcXC5jc3NcXFxcPy4qYCksXG4gICAgICAgICAgYCR7dGhlbWVSZXNvdXJjZUZvbGRlcn0vKiovKi5jc3NgLFxuICAgICAgICAgIG5ldyBSZWdFeHAoYCR7dGhlbWVSZXNvdXJjZUZvbGRlcn0vLiovLipcXFxcLmNzc1xcXFw/LipgKSxcbiAgICAgICAgICBuZXcgUmVnRXhwKCcuKi8uKlxcXFw/aHRtbC1wcm94eS4qJylcbiAgICAgICAgXVxuICAgICAgfSksXG4gICAgICAvLyBUaGUgUmVhY3QgcGx1Z2luIHByb3ZpZGVzIGZhc3QgcmVmcmVzaCBhbmQgZGVidWcgc291cmNlIGluZm9cbiAgICAgIHJlYWN0UGx1Z2luKHtcbiAgICAgICAgaW5jbHVkZTogJyoqLyoudHN4JyxcbiAgICAgICAgYmFiZWw6IHtcbiAgICAgICAgICAvLyBXZSBuZWVkIHRvIHVzZSBiYWJlbCB0byBwcm92aWRlIHRoZSBzb3VyY2UgaW5mb3JtYXRpb24gZm9yIGl0IHRvIGJlIGNvcnJlY3RcbiAgICAgICAgICAvLyAob3RoZXJ3aXNlIEJhYmVsIHdpbGwgc2xpZ2h0bHkgcmV3cml0ZSB0aGUgc291cmNlIGZpbGUgYW5kIGVzYnVpbGQgZ2VuZXJhdGUgc291cmNlIGluZm8gZm9yIHRoZSBtb2RpZmllZCBmaWxlKVxuICAgICAgICAgIHByZXNldHM6IFtbJ0BiYWJlbC9wcmVzZXQtcmVhY3QnLCB7IHJ1bnRpbWU6ICdhdXRvbWF0aWMnLCBkZXZlbG9wbWVudDogIXByb2R1Y3Rpb25Nb2RlIH1dXSxcbiAgICAgICAgICAvLyBSZWFjdCB3cml0ZXMgdGhlIHNvdXJjZSBsb2NhdGlvbiBmb3Igd2hlcmUgY29tcG9uZW50cyBhcmUgdXNlZCwgdGhpcyB3cml0ZXMgZm9yIHdoZXJlIHRoZXkgYXJlIGRlZmluZWRcbiAgICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgICAhcHJvZHVjdGlvbk1vZGUgJiYgYWRkRnVuY3Rpb25Db21wb25lbnRTb3VyY2VMb2NhdGlvbkJhYmVsKCksXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdtb2R1bGU6QHByZWFjdC9zaWduYWxzLXJlYWN0LXRyYW5zZm9ybScsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtb2RlOiAnYWxsJyAvLyBOZWVkZWQgdG8gaW5jbHVkZSB0cmFuc2xhdGlvbnMgd2hpY2ggZG8gbm90IHVzZSBzb21ldGhpbmcudmFsdWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF0uZmlsdGVyKEJvb2xlYW4pXG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAge1xuICAgICAgICBuYW1lOiAndmFhZGluOmZvcmNlLXJlbW92ZS1odG1sLW1pZGRsZXdhcmUnLFxuICAgICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy5zdGFjayA9IHNlcnZlci5taWRkbGV3YXJlcy5zdGFjay5maWx0ZXIoKG13KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGhhbmRsZU5hbWUgPSBgJHttdy5oYW5kbGV9YDtcbiAgICAgICAgICAgICAgcmV0dXJuICFoYW5kbGVOYW1lLmluY2x1ZGVzKCd2aXRlSHRtbEZhbGxiYWNrTWlkZGxld2FyZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBoYXNFeHBvcnRlZFdlYkNvbXBvbmVudHMgJiYge1xuICAgICAgICBuYW1lOiAndmFhZGluOmluamVjdC1lbnRyeXBvaW50cy10by13ZWItY29tcG9uZW50LWh0bWwnLFxuICAgICAgICB0cmFuc2Zvcm1JbmRleEh0bWw6IHtcbiAgICAgICAgICBvcmRlcjogJ3ByZScsXG4gICAgICAgICAgaGFuZGxlcihfaHRtbCwgeyBwYXRoLCBzZXJ2ZXIgfSkge1xuICAgICAgICAgICAgaWYgKHBhdGggIT09ICcvd2ViLWNvbXBvbmVudC5odG1sJykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0YWc6ICdzY3JpcHQnLFxuICAgICAgICAgICAgICAgIGF0dHJzOiB7IHR5cGU6ICdtb2R1bGUnLCBzcmM6IGAvZ2VuZXJhdGVkL3ZhYWRpbi13ZWItY29tcG9uZW50LnRzYCB9LFxuICAgICAgICAgICAgICAgIGluamVjdFRvOiAnaGVhZCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd2YWFkaW46aW5qZWN0LWVudHJ5cG9pbnRzLXRvLWluZGV4LWh0bWwnLFxuICAgICAgICB0cmFuc2Zvcm1JbmRleEh0bWw6IHtcbiAgICAgICAgICBvcmRlcjogJ3ByZScsXG4gICAgICAgICAgaGFuZGxlcihfaHRtbCwgeyBwYXRoLCBzZXJ2ZXIgfSkge1xuICAgICAgICAgICAgaWYgKHBhdGggIT09ICcvaW5kZXguaHRtbCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBzY3JpcHRzID0gW107XG5cbiAgICAgICAgICAgIGlmIChkZXZNb2RlKSB7XG4gICAgICAgICAgICAgIHNjcmlwdHMucHVzaCh7XG4gICAgICAgICAgICAgICAgdGFnOiAnc2NyaXB0JyxcbiAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiAnbW9kdWxlJywgc3JjOiBgL2dlbmVyYXRlZC92aXRlLWRldm1vZGUudHNgLCBvbmVycm9yOiBcImRvY3VtZW50LmxvY2F0aW9uLnJlbG9hZCgpXCIgfSxcbiAgICAgICAgICAgICAgICBpbmplY3RUbzogJ2hlYWQnXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NyaXB0cy5wdXNoKHtcbiAgICAgICAgICAgICAgdGFnOiAnc2NyaXB0JyxcbiAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogJ21vZHVsZScsIHNyYzogJy9nZW5lcmF0ZWQvdmFhZGluLnRzJyB9LFxuICAgICAgICAgICAgICBpbmplY3RUbzogJ2hlYWQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBzY3JpcHRzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNoZWNrZXIoe1xuICAgICAgICB0eXBlc2NyaXB0OiB0cnVlXG4gICAgICB9KSxcbiAgICAgIHByb2R1Y3Rpb25Nb2RlICYmIHZpc3VhbGl6ZXIoeyBicm90bGlTaXplOiB0cnVlLCBmaWxlbmFtZTogYnVuZGxlU2l6ZUZpbGUgfSlcbiAgICAgIFxuICAgIF1cbiAgfTtcbn07XG5cbmV4cG9ydCBjb25zdCBvdmVycmlkZVZhYWRpbkNvbmZpZyA9IChjdXN0b21Db25maWc6IFVzZXJDb25maWdGbikgPT4ge1xuICByZXR1cm4gZGVmaW5lQ29uZmlnKChlbnYpID0+IG1lcmdlQ29uZmlnKHZhYWRpbkNvbmZpZyhlbnYpLCBjdXN0b21Db25maWcoZW52KSkpO1xufTtcbmZ1bmN0aW9uIGdldFZlcnNpb24obW9kdWxlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBwYWNrYWdlSnNvbiA9IHBhdGgucmVzb2x2ZShub2RlTW9kdWxlc0ZvbGRlciwgbW9kdWxlLCAncGFja2FnZS5qc29uJyk7XG4gIHJldHVybiBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhwYWNrYWdlSnNvbiwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSkudmVyc2lvbjtcbn1cbmZ1bmN0aW9uIGdldEN2ZGxOYW1lKG1vZHVsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFja2FnZUpzb24gPSBwYXRoLnJlc29sdmUobm9kZU1vZHVsZXNGb2xkZXIsIG1vZHVsZSwgJ3BhY2thZ2UuanNvbicpO1xuICByZXR1cm4gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGFja2FnZUpzb24sIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpLmN2ZGxOYW1lO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luL3RoZW1lLWhhbmRsZS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luL3RoZW1lLWhhbmRsZS5qc1wiOy8qXG4gKiBDb3B5cmlnaHQgMjAwMC0yMDI0IFZhYWRpbiBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3RcbiAqIHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mXG4gKiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVFxuICogV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlXG4gKiBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlclxuICogdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBUaGlzIGZpbGUgY29udGFpbnMgZnVuY3Rpb25zIGZvciBsb29rIHVwIGFuZCBoYW5kbGUgdGhlIHRoZW1lIHJlc291cmNlc1xuICogZm9yIGFwcGxpY2F0aW9uIHRoZW1lIHBsdWdpbi5cbiAqL1xuaW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgd3JpdGVUaGVtZUZpbGVzIH0gZnJvbSAnLi90aGVtZS1nZW5lcmF0b3IuanMnO1xuaW1wb3J0IHsgY29weVN0YXRpY0Fzc2V0cywgY29weVRoZW1lUmVzb3VyY2VzIH0gZnJvbSAnLi90aGVtZS1jb3B5LmpzJztcblxuLy8gbWF0Y2hlcyB0aGVtZSBuYW1lIGluICcuL3RoZW1lLW15LXRoZW1lLmdlbmVyYXRlZC5qcydcbmNvbnN0IG5hbWVSZWdleCA9IC90aGVtZS0oLiopXFwuZ2VuZXJhdGVkXFwuanMvO1xuXG5sZXQgcHJldlRoZW1lTmFtZSA9IHVuZGVmaW5lZDtcbmxldCBmaXJzdFRoZW1lTmFtZSA9IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBMb29rcyB1cCBmb3IgYSB0aGVtZSByZXNvdXJjZXMgaW4gYSBjdXJyZW50IHByb2plY3QgYW5kIGluIGphciBkZXBlbmRlbmNpZXMsXG4gKiBjb3BpZXMgdGhlIGZvdW5kIHJlc291cmNlcyBhbmQgZ2VuZXJhdGVzL3VwZGF0ZXMgbWV0YSBkYXRhIGZvciB3ZWJwYWNrXG4gKiBjb21waWxhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICpcbiAqIEBwYXJhbSBsb2dnZXIgYXBwbGljYXRpb24gdGhlbWUgcGx1Z2luIGxvZ2dlclxuICovXG5mdW5jdGlvbiBwcm9jZXNzVGhlbWVSZXNvdXJjZXMob3B0aW9ucywgbG9nZ2VyKSB7XG4gIGNvbnN0IHRoZW1lTmFtZSA9IGV4dHJhY3RUaGVtZU5hbWUob3B0aW9ucy5mcm9udGVuZEdlbmVyYXRlZEZvbGRlcik7XG4gIGlmICh0aGVtZU5hbWUpIHtcbiAgICBpZiAoIXByZXZUaGVtZU5hbWUgJiYgIWZpcnN0VGhlbWVOYW1lKSB7XG4gICAgICBmaXJzdFRoZW1lTmFtZSA9IHRoZW1lTmFtZTtcbiAgICB9IGVsc2UgaWYgKFxuICAgICAgKHByZXZUaGVtZU5hbWUgJiYgcHJldlRoZW1lTmFtZSAhPT0gdGhlbWVOYW1lICYmIGZpcnN0VGhlbWVOYW1lICE9PSB0aGVtZU5hbWUpIHx8XG4gICAgICAoIXByZXZUaGVtZU5hbWUgJiYgZmlyc3RUaGVtZU5hbWUgIT09IHRoZW1lTmFtZSlcbiAgICApIHtcbiAgICAgIC8vIFdhcm5pbmcgbWVzc2FnZSBpcyBzaG93biB0byB0aGUgZGV2ZWxvcGVyIHdoZW46XG4gICAgICAvLyAxLiBIZSBpcyBzd2l0Y2hpbmcgdG8gYW55IHRoZW1lLCB3aGljaCBpcyBkaWZmZXIgZnJvbSBvbmUgYmVpbmcgc2V0IHVwXG4gICAgICAvLyBvbiBhcHBsaWNhdGlvbiBzdGFydHVwLCBieSBjaGFuZ2luZyB0aGVtZSBuYW1lIGluIGBAVGhlbWUoKWBcbiAgICAgIC8vIDIuIEhlIHJlbW92ZXMgb3IgY29tbWVudHMgb3V0IGBAVGhlbWUoKWAgdG8gc2VlIGhvdyB0aGUgYXBwXG4gICAgICAvLyBsb29rcyBsaWtlIHdpdGhvdXQgdGhlbWluZywgYW5kIHRoZW4gYWdhaW4gYnJpbmdzIGBAVGhlbWUoKWAgYmFja1xuICAgICAgLy8gd2l0aCBhIHRoZW1lTmFtZSB3aGljaCBpcyBkaWZmZXIgZnJvbSBvbmUgYmVpbmcgc2V0IHVwIG9uIGFwcGxpY2F0aW9uXG4gICAgICAvLyBzdGFydHVwLlxuICAgICAgY29uc3Qgd2FybmluZyA9IGBBdHRlbnRpb246IEFjdGl2ZSB0aGVtZSBpcyBzd2l0Y2hlZCB0byAnJHt0aGVtZU5hbWV9Jy5gO1xuICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBgXG4gICAgICBOb3RlIHRoYXQgYWRkaW5nIG5ldyBzdHlsZSBzaGVldCBmaWxlcyB0byAnL3RoZW1lcy8ke3RoZW1lTmFtZX0vY29tcG9uZW50cycsIFxuICAgICAgbWF5IG5vdCBiZSB0YWtlbiBpbnRvIGVmZmVjdCB1bnRpbCB0aGUgbmV4dCBhcHBsaWNhdGlvbiByZXN0YXJ0LlxuICAgICAgQ2hhbmdlcyB0byBhbHJlYWR5IGV4aXN0aW5nIHN0eWxlIHNoZWV0IGZpbGVzIGFyZSBiZWluZyByZWxvYWRlZCBhcyBiZWZvcmUuYDtcbiAgICAgIGxvZ2dlci53YXJuKCcqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJyk7XG4gICAgICBsb2dnZXIud2Fybih3YXJuaW5nKTtcbiAgICAgIGxvZ2dlci53YXJuKGRlc2NyaXB0aW9uKTtcbiAgICAgIGxvZ2dlci53YXJuKCcqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqJyk7XG4gICAgfVxuICAgIHByZXZUaGVtZU5hbWUgPSB0aGVtZU5hbWU7XG5cbiAgICBmaW5kVGhlbWVGb2xkZXJBbmRIYW5kbGVUaGVtZSh0aGVtZU5hbWUsIG9wdGlvbnMsIGxvZ2dlcik7XG4gIH0gZWxzZSB7XG4gICAgLy8gVGhpcyBpcyBuZWVkZWQgaW4gdGhlIHNpdHVhdGlvbiB0aGF0IHRoZSB1c2VyIGRlY2lkZXMgdG8gY29tbWVudCBvclxuICAgIC8vIHJlbW92ZSB0aGUgQFRoZW1lKC4uLikgY29tcGxldGVseSB0byBzZWUgaG93IHRoZSBhcHBsaWNhdGlvbiBsb29rc1xuICAgIC8vIHdpdGhvdXQgYW55IHRoZW1lLiBUaGVuIHdoZW4gdGhlIHVzZXIgYnJpbmdzIGJhY2sgb25lIG9mIHRoZSB0aGVtZXMsXG4gICAgLy8gdGhlIHByZXZpb3VzIHRoZW1lIHNob3VsZCBiZSB1bmRlZmluZWQgdG8gZW5hYmxlIHVzIHRvIGRldGVjdCB0aGUgY2hhbmdlLlxuICAgIHByZXZUaGVtZU5hbWUgPSB1bmRlZmluZWQ7XG4gICAgbG9nZ2VyLmRlYnVnKCdTa2lwcGluZyBWYWFkaW4gYXBwbGljYXRpb24gdGhlbWUgaGFuZGxpbmcuJyk7XG4gICAgbG9nZ2VyLnRyYWNlKCdNb3N0IGxpa2VseSBubyBAVGhlbWUgYW5ub3RhdGlvbiBmb3IgYXBwbGljYXRpb24gb3Igb25seSB0aGVtZUNsYXNzIHVzZWQuJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBTZWFyY2ggZm9yIHRoZSBnaXZlbiB0aGVtZSBpbiB0aGUgcHJvamVjdCBhbmQgcmVzb3VyY2UgZm9sZGVycy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhlbWVOYW1lIG5hbWUgb2YgdGhlbWUgdG8gZmluZFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgYXBwbGljYXRpb24gdGhlbWUgcGx1Z2luIG1hbmRhdG9yeSBvcHRpb25zLFxuICogQHNlZSB7QGxpbmsgQXBwbGljYXRpb25UaGVtZVBsdWdpbn1cbiAqIEBwYXJhbSBsb2dnZXIgYXBwbGljYXRpb24gdGhlbWUgcGx1Z2luIGxvZ2dlclxuICogQHJldHVybiB0cnVlIG9yIGZhbHNlIGZvciBpZiB0aGVtZSB3YXMgZm91bmRcbiAqL1xuZnVuY3Rpb24gZmluZFRoZW1lRm9sZGVyQW5kSGFuZGxlVGhlbWUodGhlbWVOYW1lLCBvcHRpb25zLCBsb2dnZXIpIHtcbiAgbGV0IHRoZW1lRm91bmQgPSBmYWxzZTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLnRoZW1lUHJvamVjdEZvbGRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCB0aGVtZVByb2plY3RGb2xkZXIgPSBvcHRpb25zLnRoZW1lUHJvamVjdEZvbGRlcnNbaV07XG4gICAgaWYgKGV4aXN0c1N5bmModGhlbWVQcm9qZWN0Rm9sZGVyKSkge1xuICAgICAgbG9nZ2VyLmRlYnVnKFwiU2VhcmNoaW5nIHRoZW1lcyBmb2xkZXIgJ1wiICsgdGhlbWVQcm9qZWN0Rm9sZGVyICsgXCInIGZvciB0aGVtZSAnXCIgKyB0aGVtZU5hbWUgKyBcIidcIik7XG4gICAgICBjb25zdCBoYW5kbGVkID0gaGFuZGxlVGhlbWVzKHRoZW1lTmFtZSwgdGhlbWVQcm9qZWN0Rm9sZGVyLCBvcHRpb25zLCBsb2dnZXIpO1xuICAgICAgaWYgKGhhbmRsZWQpIHtcbiAgICAgICAgaWYgKHRoZW1lRm91bmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBcIkZvdW5kIHRoZW1lIGZpbGVzIGluICdcIiArXG4gICAgICAgICAgICAgIHRoZW1lUHJvamVjdEZvbGRlciArXG4gICAgICAgICAgICAgIFwiJyBhbmQgJ1wiICtcbiAgICAgICAgICAgICAgdGhlbWVGb3VuZCArXG4gICAgICAgICAgICAgIFwiJy4gVGhlbWUgc2hvdWxkIG9ubHkgYmUgYXZhaWxhYmxlIGluIG9uZSBmb2xkZXJcIlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgbG9nZ2VyLmRlYnVnKFwiRm91bmQgdGhlbWUgZmlsZXMgZnJvbSAnXCIgKyB0aGVtZVByb2plY3RGb2xkZXIgKyBcIidcIik7XG4gICAgICAgIHRoZW1lRm91bmQgPSB0aGVtZVByb2plY3RGb2xkZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKGV4aXN0c1N5bmMob3B0aW9ucy50aGVtZVJlc291cmNlRm9sZGVyKSkge1xuICAgIGlmICh0aGVtZUZvdW5kICYmIGV4aXN0c1N5bmMocmVzb2x2ZShvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIsIHRoZW1lTmFtZSkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiVGhlbWUgJ1wiICtcbiAgICAgICAgICB0aGVtZU5hbWUgK1xuICAgICAgICAgIFwiJ3Nob3VsZCBub3QgZXhpc3QgaW5zaWRlIGEgamFyIGFuZCBpbiB0aGUgcHJvamVjdCBhdCB0aGUgc2FtZSB0aW1lXFxuXCIgK1xuICAgICAgICAgICdFeHRlbmRpbmcgYW5vdGhlciB0aGVtZSBpcyBwb3NzaWJsZSBieSBhZGRpbmcgeyBcInBhcmVudFwiOiBcIm15LXBhcmVudC10aGVtZVwiIH0gZW50cnkgdG8gdGhlIHRoZW1lLmpzb24gZmlsZSBpbnNpZGUgeW91ciB0aGVtZSBmb2xkZXIuJ1xuICAgICAgKTtcbiAgICB9XG4gICAgbG9nZ2VyLmRlYnVnKFxuICAgICAgXCJTZWFyY2hpbmcgdGhlbWUgamFyIHJlc291cmNlIGZvbGRlciAnXCIgKyBvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIgKyBcIicgZm9yIHRoZW1lICdcIiArIHRoZW1lTmFtZSArIFwiJ1wiXG4gICAgKTtcbiAgICBoYW5kbGVUaGVtZXModGhlbWVOYW1lLCBvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIsIG9wdGlvbnMsIGxvZ2dlcik7XG4gICAgdGhlbWVGb3VuZCA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHRoZW1lRm91bmQ7XG59XG5cbi8qKlxuICogQ29waWVzIHN0YXRpYyByZXNvdXJjZXMgZm9yIHRoZW1lIGFuZCBnZW5lcmF0ZXMvd3JpdGVzIHRoZVxuICogW3RoZW1lLW5hbWVdLmdlbmVyYXRlZC5qcyBmb3Igd2VicGFjayB0byBoYW5kbGUuXG4gKlxuICogTm90ZSEgSWYgYSBwYXJlbnQgdGhlbWUgaXMgZGVmaW5lZCBpdCB3aWxsIGFsc28gYmUgaGFuZGxlZCBoZXJlIHNvIHRoYXQgdGhlIHBhcmVudCB0aGVtZSBnZW5lcmF0ZWQgZmlsZSBpc1xuICogZ2VuZXJhdGVkIGluIGFkdmFuY2Ugb2YgdGhlIHRoZW1lIGdlbmVyYXRlZCBmaWxlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZU5hbWUgbmFtZSBvZiB0aGVtZSB0byBoYW5kbGVcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZXNGb2xkZXIgZm9sZGVyIGNvbnRhaW5pbmcgYXBwbGljYXRpb24gdGhlbWUgZm9sZGVyc1xuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgYXBwbGljYXRpb24gdGhlbWUgcGx1Z2luIG1hbmRhdG9yeSBvcHRpb25zLFxuICogQHNlZSB7QGxpbmsgQXBwbGljYXRpb25UaGVtZVBsdWdpbn1cbiAqIEBwYXJhbSB7b2JqZWN0fSBsb2dnZXIgcGx1Z2luIGxvZ2dlciBpbnN0YW5jZVxuICpcbiAqIEB0aHJvd3MgRXJyb3IgaWYgcGFyZW50IHRoZW1lIGRlZmluZWQsIGJ1dCBjYW4ndCBsb2NhdGUgcGFyZW50IHRoZW1lXG4gKlxuICogQHJldHVybnMgdHJ1ZSBpZiB0aGVtZSB3YXMgZm91bmQgZWxzZSBmYWxzZS5cbiAqL1xuZnVuY3Rpb24gaGFuZGxlVGhlbWVzKHRoZW1lTmFtZSwgdGhlbWVzRm9sZGVyLCBvcHRpb25zLCBsb2dnZXIpIHtcbiAgY29uc3QgdGhlbWVGb2xkZXIgPSByZXNvbHZlKHRoZW1lc0ZvbGRlciwgdGhlbWVOYW1lKTtcbiAgaWYgKGV4aXN0c1N5bmModGhlbWVGb2xkZXIpKSB7XG4gICAgbG9nZ2VyLmRlYnVnKCdGb3VuZCB0aGVtZSAnLCB0aGVtZU5hbWUsICcgaW4gZm9sZGVyICcsIHRoZW1lRm9sZGVyKTtcblxuICAgIGNvbnN0IHRoZW1lUHJvcGVydGllcyA9IGdldFRoZW1lUHJvcGVydGllcyh0aGVtZUZvbGRlcik7XG5cbiAgICAvLyBJZiB0aGVtZSBoYXMgcGFyZW50IGhhbmRsZSBwYXJlbnQgdGhlbWUgaW1tZWRpYXRlbHkuXG4gICAgaWYgKHRoZW1lUHJvcGVydGllcy5wYXJlbnQpIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gZmluZFRoZW1lRm9sZGVyQW5kSGFuZGxlVGhlbWUodGhlbWVQcm9wZXJ0aWVzLnBhcmVudCwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgICAgIGlmICghZm91bmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiQ291bGQgbm90IGxvY2F0ZSBmaWxlcyBmb3IgZGVmaW5lZCBwYXJlbnQgdGhlbWUgJ1wiICtcbiAgICAgICAgICAgIHRoZW1lUHJvcGVydGllcy5wYXJlbnQgK1xuICAgICAgICAgICAgXCInLlxcblwiICtcbiAgICAgICAgICAgICdQbGVhc2UgdmVyaWZ5IHRoYXQgZGVwZW5kZW5jeSBpcyBhZGRlZCBvciB0aGVtZSBmb2xkZXIgZXhpc3RzLidcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29weVN0YXRpY0Fzc2V0cyh0aGVtZU5hbWUsIHRoZW1lUHJvcGVydGllcywgb3B0aW9ucy5wcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCBsb2dnZXIpO1xuICAgIGNvcHlUaGVtZVJlc291cmNlcyh0aGVtZUZvbGRlciwgb3B0aW9ucy5wcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCBsb2dnZXIpO1xuXG4gICAgd3JpdGVUaGVtZUZpbGVzKHRoZW1lRm9sZGVyLCB0aGVtZU5hbWUsIHRoZW1lUHJvcGVydGllcywgb3B0aW9ucyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRUaGVtZVByb3BlcnRpZXModGhlbWVGb2xkZXIpIHtcbiAgY29uc3QgdGhlbWVQcm9wZXJ0eUZpbGUgPSByZXNvbHZlKHRoZW1lRm9sZGVyLCAndGhlbWUuanNvbicpO1xuICBpZiAoIWV4aXN0c1N5bmModGhlbWVQcm9wZXJ0eUZpbGUpKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIGNvbnN0IHRoZW1lUHJvcGVydHlGaWxlQXNTdHJpbmcgPSByZWFkRmlsZVN5bmModGhlbWVQcm9wZXJ0eUZpbGUpO1xuICBpZiAodGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgcmV0dXJuIEpTT04ucGFyc2UodGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZyk7XG59XG5cbi8qKlxuICogRXh0cmFjdHMgY3VycmVudCB0aGVtZSBuYW1lIGZyb20gYXV0by1nZW5lcmF0ZWQgJ3RoZW1lLmpzJyBmaWxlIGxvY2F0ZWQgb24gYVxuICogZ2l2ZW4gZm9sZGVyLlxuICogQHBhcmFtIGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyIGZvbGRlciBpbiBwcm9qZWN0IGNvbnRhaW5pbmcgJ3RoZW1lLmpzJyBmaWxlXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBjdXJyZW50IHRoZW1lIG5hbWVcbiAqL1xuZnVuY3Rpb24gZXh0cmFjdFRoZW1lTmFtZShmcm9udGVuZEdlbmVyYXRlZEZvbGRlcikge1xuICBpZiAoIWZyb250ZW5kR2VuZXJhdGVkRm9sZGVyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJDb3VsZG4ndCBleHRyYWN0IHRoZW1lIG5hbWUgZnJvbSAndGhlbWUuanMnLFwiICtcbiAgICAgICAgJyBiZWNhdXNlIHRoZSBwYXRoIHRvIGZvbGRlciBjb250YWluaW5nIHRoaXMgZmlsZSBpcyBlbXB0eS4gUGxlYXNlIHNldCcgK1xuICAgICAgICAnIHRoZSBhIGNvcnJlY3QgZm9sZGVyIHBhdGggaW4gQXBwbGljYXRpb25UaGVtZVBsdWdpbiBjb25zdHJ1Y3RvcicgK1xuICAgICAgICAnIHBhcmFtZXRlcnMuJ1xuICAgICk7XG4gIH1cbiAgY29uc3QgZ2VuZXJhdGVkVGhlbWVGaWxlID0gcmVzb2x2ZShmcm9udGVuZEdlbmVyYXRlZEZvbGRlciwgJ3RoZW1lLmpzJyk7XG4gIGlmIChleGlzdHNTeW5jKGdlbmVyYXRlZFRoZW1lRmlsZSkpIHtcbiAgICAvLyByZWFkIHRoZW1lIG5hbWUgZnJvbSB0aGUgJ2dlbmVyYXRlZC90aGVtZS5qcycgYXMgdGhlcmUgd2UgYWx3YXlzXG4gICAgLy8gbWFyayB0aGUgdXNlZCB0aGVtZSBmb3Igd2VicGFjayB0byBoYW5kbGUuXG4gICAgY29uc3QgdGhlbWVOYW1lID0gbmFtZVJlZ2V4LmV4ZWMocmVhZEZpbGVTeW5jKGdlbmVyYXRlZFRoZW1lRmlsZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pKVsxXTtcbiAgICBpZiAoIXRoZW1lTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgcGFyc2UgdGhlbWUgbmFtZSBmcm9tICdcIiArIGdlbmVyYXRlZFRoZW1lRmlsZSArIFwiJy5cIik7XG4gICAgfVxuICAgIHJldHVybiB0aGVtZU5hbWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59XG5cbi8qKlxuICogRmluZHMgYWxsIHRoZSBwYXJlbnQgdGhlbWVzIGxvY2F0ZWQgaW4gdGhlIHByb2plY3QgdGhlbWVzIGZvbGRlcnMgYW5kIGluXG4gKiB0aGUgSkFSIGRlcGVuZGVuY2llcyB3aXRoIHJlc3BlY3QgdG8gdGhlIGdpdmVuIGN1c3RvbSB0aGVtZSB3aXRoXG4gKiB7QGNvZGUgdGhlbWVOYW1lfS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZU5hbWUgZ2l2ZW4gY3VzdG9tIHRoZW1lIG5hbWUgdG8gbG9vayBwYXJlbnRzIGZvclxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgYXBwbGljYXRpb24gdGhlbWUgcGx1Z2luIG1hbmRhdG9yeSBvcHRpb25zLFxuICogQHNlZSB7QGxpbmsgQXBwbGljYXRpb25UaGVtZVBsdWdpbn1cbiAqIEByZXR1cm5zIHtzdHJpbmdbXX0gYXJyYXkgb2YgcGF0aHMgdG8gZm91bmQgcGFyZW50IHRoZW1lcyB3aXRoIHJlc3BlY3QgdG8gdGhlXG4gKiBnaXZlbiBjdXN0b20gdGhlbWVcbiAqL1xuZnVuY3Rpb24gZmluZFBhcmVudFRoZW1lcyh0aGVtZU5hbWUsIG9wdGlvbnMpIHtcbiAgY29uc3QgZXhpc3RpbmdUaGVtZUZvbGRlcnMgPSBbb3B0aW9ucy50aGVtZVJlc291cmNlRm9sZGVyLCAuLi5vcHRpb25zLnRoZW1lUHJvamVjdEZvbGRlcnNdLmZpbHRlcigoZm9sZGVyKSA9PlxuICAgIGV4aXN0c1N5bmMoZm9sZGVyKVxuICApO1xuICByZXR1cm4gY29sbGVjdFBhcmVudFRoZW1lcyh0aGVtZU5hbWUsIGV4aXN0aW5nVGhlbWVGb2xkZXJzLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RQYXJlbnRUaGVtZXModGhlbWVOYW1lLCB0aGVtZUZvbGRlcnMsIGlzUGFyZW50KSB7XG4gIGxldCBmb3VuZFBhcmVudFRoZW1lcyA9IFtdO1xuICB0aGVtZUZvbGRlcnMuZm9yRWFjaCgoZm9sZGVyKSA9PiB7XG4gICAgY29uc3QgdGhlbWVGb2xkZXIgPSByZXNvbHZlKGZvbGRlciwgdGhlbWVOYW1lKTtcbiAgICBpZiAoZXhpc3RzU3luYyh0aGVtZUZvbGRlcikpIHtcbiAgICAgIGNvbnN0IHRoZW1lUHJvcGVydGllcyA9IGdldFRoZW1lUHJvcGVydGllcyh0aGVtZUZvbGRlcik7XG5cbiAgICAgIGlmICh0aGVtZVByb3BlcnRpZXMucGFyZW50KSB7XG4gICAgICAgIGZvdW5kUGFyZW50VGhlbWVzLnB1c2goLi4uY29sbGVjdFBhcmVudFRoZW1lcyh0aGVtZVByb3BlcnRpZXMucGFyZW50LCB0aGVtZUZvbGRlcnMsIHRydWUpKTtcbiAgICAgICAgaWYgKCFmb3VuZFBhcmVudFRoZW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBcIkNvdWxkIG5vdCBsb2NhdGUgZmlsZXMgZm9yIGRlZmluZWQgcGFyZW50IHRoZW1lICdcIiArXG4gICAgICAgICAgICAgIHRoZW1lUHJvcGVydGllcy5wYXJlbnQgK1xuICAgICAgICAgICAgICBcIicuXFxuXCIgK1xuICAgICAgICAgICAgICAnUGxlYXNlIHZlcmlmeSB0aGF0IGRlcGVuZGVuY3kgaXMgYWRkZWQgb3IgdGhlbWUgZm9sZGVyIGV4aXN0cy4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQWRkIGEgdGhlbWUgcGF0aCB0byByZXN1bHQgY29sbGVjdGlvbiBvbmx5IGlmIGEgZ2l2ZW4gdGhlbWVOYW1lXG4gICAgICAvLyBpcyBzdXBwb3NlZCB0byBiZSBhIHBhcmVudCB0aGVtZVxuICAgICAgaWYgKGlzUGFyZW50KSB7XG4gICAgICAgIGZvdW5kUGFyZW50VGhlbWVzLnB1c2godGhlbWVGb2xkZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmb3VuZFBhcmVudFRoZW1lcztcbn1cblxuZXhwb3J0IHsgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzLCBleHRyYWN0VGhlbWVOYW1lLCBmaW5kUGFyZW50VGhlbWVzIH07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9taXJha2hyZWlzL3RlYW0xLmZyb250ZW5kMS90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9taXJha2hyZWlzL3RlYW0xLmZyb250ZW5kMS90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtZ2VuZXJhdG9yLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9taXJha2hyZWlzL3RlYW0xLmZyb250ZW5kMS90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtZ2VuZXJhdG9yLmpzXCI7LypcbiAqIENvcHlyaWdodCAyMDAwLTIwMjQgVmFhZGluIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgZmlsZSBoYW5kbGVzIHRoZSBnZW5lcmF0aW9uIG9mIHRoZSAnW3RoZW1lLW5hbWVdLmpzJyB0b1xuICogdGhlIHRoZW1lcy9bdGhlbWUtbmFtZV0gZm9sZGVyIGFjY29yZGluZyB0byBwcm9wZXJ0aWVzIGZyb20gJ3RoZW1lLmpzb24nLlxuICovXG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGNoZWNrTW9kdWxlcyB9IGZyb20gJy4vdGhlbWUtY29weS5qcyc7XG5cbi8vIFNwZWNpYWwgZm9sZGVyIGluc2lkZSBhIHRoZW1lIGZvciBjb21wb25lbnQgdGhlbWVzIHRoYXQgZ28gaW5zaWRlIHRoZSBjb21wb25lbnQgc2hhZG93IHJvb3RcbmNvbnN0IHRoZW1lQ29tcG9uZW50c0ZvbGRlciA9ICdjb21wb25lbnRzJztcbi8vIFRoZSBjb250ZW50cyBvZiBhIGdsb2JhbCBDU1MgZmlsZSB3aXRoIHRoaXMgbmFtZSBpbiBhIHRoZW1lIGlzIGFsd2F5cyBhZGRlZCB0b1xuLy8gdGhlIGRvY3VtZW50LiBFLmcuIEBmb250LWZhY2UgbXVzdCBiZSBpbiB0aGlzXG5jb25zdCBkb2N1bWVudENzc0ZpbGVuYW1lID0gJ2RvY3VtZW50LmNzcyc7XG4vLyBzdHlsZXMuY3NzIGlzIHRoZSBvbmx5IGVudHJ5cG9pbnQgY3NzIGZpbGUgd2l0aCBkb2N1bWVudC5jc3MuIEV2ZXJ5dGhpbmcgZWxzZSBzaG91bGQgYmUgaW1wb3J0ZWQgdXNpbmcgY3NzIEBpbXBvcnRcbmNvbnN0IHN0eWxlc0Nzc0ZpbGVuYW1lID0gJ3N0eWxlcy5jc3MnO1xuXG5jb25zdCBDU1NJTVBPUlRfQ09NTUVOVCA9ICdDU1NJbXBvcnQgZW5kJztcbmNvbnN0IGhlYWRlckltcG9ydCA9IGBpbXBvcnQgJ2NvbnN0cnVjdC1zdHlsZS1zaGVldHMtcG9seWZpbGwnO1xuYDtcblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgW3RoZW1lTmFtZV0uanMgZmlsZSBmb3IgdGhlbWVGb2xkZXIgd2hpY2ggY29sbGVjdHMgYWxsIHJlcXVpcmVkIGluZm9ybWF0aW9uIGZyb20gdGhlIGZvbGRlci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhlbWVGb2xkZXIgZm9sZGVyIG9mIHRoZSB0aGVtZVxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBuYW1lIG9mIHRoZSBoYW5kbGVkIHRoZW1lXG4gKiBAcGFyYW0ge0pTT059IHRoZW1lUHJvcGVydGllcyBjb250ZW50IG9mIHRoZW1lLmpzb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIGJ1aWxkIG9wdGlvbnMgKGUuZy4gcHJvZCBvciBkZXYgbW9kZSlcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZW1lIGZpbGUgY29udGVudFxuICovXG5mdW5jdGlvbiB3cml0ZVRoZW1lRmlsZXModGhlbWVGb2xkZXIsIHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHByb2R1Y3Rpb25Nb2RlID0gIW9wdGlvbnMuZGV2TW9kZTtcbiAgY29uc3QgdXNlRGV2U2VydmVyT3JJblByb2R1Y3Rpb25Nb2RlID0gIW9wdGlvbnMudXNlRGV2QnVuZGxlO1xuICBjb25zdCBvdXRwdXRGb2xkZXIgPSBvcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyO1xuICBjb25zdCBzdHlsZXMgPSByZXNvbHZlKHRoZW1lRm9sZGVyLCBzdHlsZXNDc3NGaWxlbmFtZSk7XG4gIGNvbnN0IGRvY3VtZW50Q3NzRmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsIGRvY3VtZW50Q3NzRmlsZW5hbWUpO1xuICBjb25zdCBhdXRvSW5qZWN0Q29tcG9uZW50cyA9IHRoZW1lUHJvcGVydGllcy5hdXRvSW5qZWN0Q29tcG9uZW50cyA/PyB0cnVlO1xuICBjb25zdCBhdXRvSW5qZWN0R2xvYmFsQ3NzSW1wb3J0cyA9IHRoZW1lUHJvcGVydGllcy5hdXRvSW5qZWN0R2xvYmFsQ3NzSW1wb3J0cyA/PyBmYWxzZTtcbiAgY29uc3QgZ2xvYmFsRmlsZW5hbWUgPSAndGhlbWUtJyArIHRoZW1lTmFtZSArICcuZ2xvYmFsLmdlbmVyYXRlZC5qcyc7XG4gIGNvbnN0IGNvbXBvbmVudHNGaWxlbmFtZSA9ICd0aGVtZS0nICsgdGhlbWVOYW1lICsgJy5jb21wb25lbnRzLmdlbmVyYXRlZC5qcyc7XG4gIGNvbnN0IHRoZW1lRmlsZW5hbWUgPSAndGhlbWUtJyArIHRoZW1lTmFtZSArICcuZ2VuZXJhdGVkLmpzJztcblxuICBsZXQgdGhlbWVGaWxlQ29udGVudCA9IGhlYWRlckltcG9ydDtcbiAgbGV0IGdsb2JhbEltcG9ydENvbnRlbnQgPSAnLy8gV2hlbiB0aGlzIGZpbGUgaXMgaW1wb3J0ZWQsIGdsb2JhbCBzdHlsZXMgYXJlIGF1dG9tYXRpY2FsbHkgYXBwbGllZFxcbic7XG4gIGxldCBjb21wb25lbnRzRmlsZUNvbnRlbnQgPSAnJztcbiAgdmFyIGNvbXBvbmVudHNGaWxlcztcblxuICBpZiAoYXV0b0luamVjdENvbXBvbmVudHMpIHtcbiAgICBjb21wb25lbnRzRmlsZXMgPSBnbG9iU3luYygnKi5jc3MnLCB7XG4gICAgICBjd2Q6IHJlc29sdmUodGhlbWVGb2xkZXIsIHRoZW1lQ29tcG9uZW50c0ZvbGRlciksXG4gICAgICBub2RpcjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgaWYgKGNvbXBvbmVudHNGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb21wb25lbnRzRmlsZUNvbnRlbnQgKz1cbiAgICAgICAgXCJpbXBvcnQgeyB1bnNhZmVDU1MsIHJlZ2lzdGVyU3R5bGVzIH0gZnJvbSAnQHZhYWRpbi92YWFkaW4tdGhlbWFibGUtbWl4aW4vcmVnaXN0ZXItc3R5bGVzJztcXG5cIjtcbiAgICB9XG4gIH1cblxuICBpZiAodGhlbWVQcm9wZXJ0aWVzLnBhcmVudCkge1xuICAgIHRoZW1lRmlsZUNvbnRlbnQgKz0gYGltcG9ydCB7IGFwcGx5VGhlbWUgYXMgYXBwbHlCYXNlVGhlbWUgfSBmcm9tICcuL3RoZW1lLSR7dGhlbWVQcm9wZXJ0aWVzLnBhcmVudH0uZ2VuZXJhdGVkLmpzJztcXG5gO1xuICB9XG5cbiAgdGhlbWVGaWxlQ29udGVudCArPSBgaW1wb3J0IHsgaW5qZWN0R2xvYmFsQ3NzIH0gZnJvbSAnRnJvbnRlbmQvZ2VuZXJhdGVkL2phci1yZXNvdXJjZXMvdGhlbWUtdXRpbC5qcyc7XFxuYDtcbiAgdGhlbWVGaWxlQ29udGVudCArPSBgaW1wb3J0IHsgd2ViY29tcG9uZW50R2xvYmFsQ3NzSW5qZWN0b3IgfSBmcm9tICdGcm9udGVuZC9nZW5lcmF0ZWQvamFyLXJlc291cmNlcy90aGVtZS11dGlsLmpzJztcXG5gO1xuICB0aGVtZUZpbGVDb250ZW50ICs9IGBpbXBvcnQgJy4vJHtjb21wb25lbnRzRmlsZW5hbWV9JztcXG5gO1xuXG4gIHRoZW1lRmlsZUNvbnRlbnQgKz0gYGxldCBuZWVkc1JlbG9hZE9uQ2hhbmdlcyA9IGZhbHNlO1xcbmA7XG4gIGNvbnN0IGltcG9ydHMgPSBbXTtcbiAgY29uc3QgY29tcG9uZW50Q3NzSW1wb3J0cyA9IFtdO1xuICBjb25zdCBnbG9iYWxGaWxlQ29udGVudCA9IFtdO1xuICBjb25zdCBnbG9iYWxDc3NDb2RlID0gW107XG4gIGNvbnN0IHNoYWRvd09ubHlDc3MgPSBbXTtcbiAgY29uc3QgY29tcG9uZW50Q3NzQ29kZSA9IFtdO1xuICBjb25zdCBwYXJlbnRUaGVtZSA9IHRoZW1lUHJvcGVydGllcy5wYXJlbnQgPyAnYXBwbHlCYXNlVGhlbWUodGFyZ2V0KTtcXG4nIDogJyc7XG4gIGNvbnN0IHBhcmVudFRoZW1lR2xvYmFsSW1wb3J0ID0gdGhlbWVQcm9wZXJ0aWVzLnBhcmVudFxuICAgID8gYGltcG9ydCAnLi90aGVtZS0ke3RoZW1lUHJvcGVydGllcy5wYXJlbnR9Lmdsb2JhbC5nZW5lcmF0ZWQuanMnO1xcbmBcbiAgICA6ICcnO1xuXG4gIGNvbnN0IHRoZW1lSWRlbnRpZmllciA9ICdfdmFhZGludGhlbWVfJyArIHRoZW1lTmFtZSArICdfJztcbiAgY29uc3QgbHVtb0Nzc0ZsYWcgPSAnX3ZhYWRpbnRoZW1lbHVtb2ltcG9ydHNfJztcbiAgY29uc3QgZ2xvYmFsQ3NzRmxhZyA9IHRoZW1lSWRlbnRpZmllciArICdnbG9iYWxDc3MnO1xuICBjb25zdCBjb21wb25lbnRDc3NGbGFnID0gdGhlbWVJZGVudGlmaWVyICsgJ2NvbXBvbmVudENzcyc7XG5cbiAgaWYgKCFleGlzdHNTeW5jKHN0eWxlcykpIHtcbiAgICBpZiAocHJvZHVjdGlvbk1vZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc3R5bGVzLmNzcyBmaWxlIGlzIG1pc3NpbmcgYW5kIGlzIG5lZWRlZCBmb3IgJyR7dGhlbWVOYW1lfScgaW4gZm9sZGVyICcke3RoZW1lRm9sZGVyfSdgKTtcbiAgICB9XG4gICAgd3JpdGVGaWxlU3luYyhcbiAgICAgIHN0eWxlcyxcbiAgICAgICcvKiBJbXBvcnQgeW91ciBhcHBsaWNhdGlvbiBnbG9iYWwgY3NzIGZpbGVzIGhlcmUgb3IgYWRkIHRoZSBzdHlsZXMgZGlyZWN0bHkgdG8gdGhpcyBmaWxlICovJyxcbiAgICAgICd1dGY4J1xuICAgICk7XG4gIH1cblxuICAvLyBzdHlsZXMuY3NzIHdpbGwgYWx3YXlzIGJlIGF2YWlsYWJsZSBhcyB3ZSB3cml0ZSBvbmUgaWYgaXQgZG9lc24ndCBleGlzdC5cbiAgbGV0IGZpbGVuYW1lID0gYmFzZW5hbWUoc3R5bGVzKTtcbiAgbGV0IHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcblxuICAvKiBMVU1PICovXG4gIGNvbnN0IGx1bW9JbXBvcnRzID0gdGhlbWVQcm9wZXJ0aWVzLmx1bW9JbXBvcnRzIHx8IFsndHlwb2dyYXBoeScsICdjb2xvcicsICdzcGFjaW5nJywgJ2JhZGdlJywgJ3V0aWxpdHknXSA7XG4gIGlmIChsdW1vSW1wb3J0cykge1xuICAgIGx1bW9JbXBvcnRzLmZvckVhY2goKGx1bW9JbXBvcnQpID0+IHtcbiAgICAgIGltcG9ydHMucHVzaChgaW1wb3J0IHsgJHtsdW1vSW1wb3J0fSB9IGZyb20gJ0B2YWFkaW4vdmFhZGluLWx1bW8tc3R5bGVzLyR7bHVtb0ltcG9ydH0uanMnO1xcbmApO1xuICAgICAgaWYgKGx1bW9JbXBvcnQgPT09ICd1dGlsaXR5JyB8fCBsdW1vSW1wb3J0ID09PSAnYmFkZ2UnIHx8IGx1bW9JbXBvcnQgPT09ICd0eXBvZ3JhcGh5JyB8fCBsdW1vSW1wb3J0ID09PSAnY29sb3InKSB7XG4gICAgICAgIC8vIEluamVjdCBpbnRvIG1haW4gZG9jdW1lbnQgdGhlIHNhbWUgd2F5IGFzIG90aGVyIEx1bW8gc3R5bGVzIGFyZSBpbmplY3RlZFxuICAgICAgICAvLyBMdW1vIGltcG9ydHMgZ28gdG8gdGhlIHRoZW1lIGdsb2JhbCBpbXBvcnRzIGZpbGUgdG8gcHJldmVudCBzdHlsZSBsZWFrc1xuICAgICAgICAvLyB3aGVuIHRoZSB0aGVtZSBpcyBhcHBsaWVkIHRvIGFuIGVtYmVkZGVkIGNvbXBvbmVudFxuICAgICAgICBnbG9iYWxGaWxlQ29udGVudC5wdXNoKGBpbXBvcnQgJ0B2YWFkaW4vdmFhZGluLWx1bW8tc3R5bGVzLyR7bHVtb0ltcG9ydH0tZ2xvYmFsLmpzJztcXG5gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGx1bW9JbXBvcnRzLmZvckVhY2goKGx1bW9JbXBvcnQpID0+IHtcbiAgICAgIC8vIEx1bW8gaXMgaW5qZWN0ZWQgdG8gdGhlIGRvY3VtZW50IGJ5IEx1bW8gaXRzZWxmXG4gICAgICBzaGFkb3dPbmx5Q3NzLnB1c2goYHJlbW92ZXJzLnB1c2goaW5qZWN0R2xvYmFsQ3NzKCR7bHVtb0ltcG9ydH0uY3NzVGV4dCwgJycsIHRhcmdldCwgdHJ1ZSkpO1xcbmApO1xuICAgIH0pO1xuICB9XG5cbiAgLyogVGhlbWUgKi9cbiAgaWYgKHVzZURldlNlcnZlck9ySW5Qcm9kdWN0aW9uTW9kZSkge1xuICAgIGdsb2JhbEZpbGVDb250ZW50LnB1c2gocGFyZW50VGhlbWVHbG9iYWxJbXBvcnQpO1xuICAgIGdsb2JhbEZpbGVDb250ZW50LnB1c2goYGltcG9ydCAndGhlbWVzLyR7dGhlbWVOYW1lfS8ke2ZpbGVuYW1lfSc7XFxuYCk7XG5cbiAgICBpbXBvcnRzLnB1c2goYGltcG9ydCAke3ZhcmlhYmxlfSBmcm9tICd0aGVtZXMvJHt0aGVtZU5hbWV9LyR7ZmlsZW5hbWV9P2lubGluZSc7XFxuYCk7XG4gICAgc2hhZG93T25seUNzcy5wdXNoKGByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke3ZhcmlhYmxlfS50b1N0cmluZygpLCAnJywgdGFyZ2V0KSk7XFxuICAgIGApO1xuICB9XG4gIGlmIChleGlzdHNTeW5jKGRvY3VtZW50Q3NzRmlsZSkpIHtcbiAgICBmaWxlbmFtZSA9IGJhc2VuYW1lKGRvY3VtZW50Q3NzRmlsZSk7XG4gICAgdmFyaWFibGUgPSBjYW1lbENhc2UoZmlsZW5hbWUpO1xuXG4gICAgaWYgKHVzZURldlNlcnZlck9ySW5Qcm9kdWN0aW9uTW9kZSkge1xuICAgICAgZ2xvYmFsRmlsZUNvbnRlbnQucHVzaChgaW1wb3J0ICd0aGVtZXMvJHt0aGVtZU5hbWV9LyR7ZmlsZW5hbWV9JztcXG5gKTtcblxuICAgICAgaW1wb3J0cy5wdXNoKGBpbXBvcnQgJHt2YXJpYWJsZX0gZnJvbSAndGhlbWVzLyR7dGhlbWVOYW1lfS8ke2ZpbGVuYW1lfT9pbmxpbmUnO1xcbmApO1xuICAgICAgc2hhZG93T25seUNzcy5wdXNoKGByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke3ZhcmlhYmxlfS50b1N0cmluZygpLCcnLCBkb2N1bWVudCkpO1xcbiAgICBgKTtcbiAgICB9XG4gIH1cblxuICBsZXQgaSA9IDA7XG4gIGlmICh0aGVtZVByb3BlcnRpZXMuZG9jdW1lbnRDc3MpIHtcbiAgICBjb25zdCBtaXNzaW5nTW9kdWxlcyA9IGNoZWNrTW9kdWxlcyh0aGVtZVByb3BlcnRpZXMuZG9jdW1lbnRDc3MpO1xuICAgIGlmIChtaXNzaW5nTW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgXCJNaXNzaW5nIG5wbSBtb2R1bGVzIG9yIGZpbGVzICdcIiArXG4gICAgICAgICAgbWlzc2luZ01vZHVsZXMuam9pbihcIicsICdcIikgK1xuICAgICAgICAgIFwiJyBmb3IgZG9jdW1lbnRDc3MgbWFya2VkIGluICd0aGVtZS5qc29uJy5cXG5cIiArXG4gICAgICAgICAgXCJJbnN0YWxsIG9yIHVwZGF0ZSBwYWNrYWdlKHMpIGJ5IGFkZGluZyBhIEBOcG1QYWNrYWdlIGFubm90YXRpb24gb3IgaW5zdGFsbCBpdCB1c2luZyAnbnBtL3BucG0vYnVuIGknXCJcbiAgICAgICk7XG4gICAgfVxuICAgIHRoZW1lUHJvcGVydGllcy5kb2N1bWVudENzcy5mb3JFYWNoKChjc3NJbXBvcnQpID0+IHtcbiAgICAgIGNvbnN0IHZhcmlhYmxlID0gJ21vZHVsZScgKyBpKys7XG4gICAgICBpbXBvcnRzLnB1c2goYGltcG9ydCAke3ZhcmlhYmxlfSBmcm9tICcke2Nzc0ltcG9ydH0/aW5saW5lJztcXG5gKTtcbiAgICAgIC8vIER1ZSB0byBjaHJvbWUgYnVnIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTMzNjg3NiBmb250LWZhY2Ugd2lsbCBub3Qgd29ya1xuICAgICAgLy8gaW5zaWRlIHNoYWRvd1Jvb3Qgc28gd2UgbmVlZCB0byBpbmplY3QgaXQgdGhlcmUgYWxzby5cbiAgICAgIGdsb2JhbENzc0NvZGUucHVzaChgaWYodGFyZ2V0ICE9PSBkb2N1bWVudCkge1xuICAgICAgICByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke3ZhcmlhYmxlfS50b1N0cmluZygpLCAnJywgdGFyZ2V0KSk7XG4gICAgfVxcbiAgICBgKTtcbiAgICAgIGdsb2JhbENzc0NvZGUucHVzaChcbiAgICAgICAgYHJlbW92ZXJzLnB1c2goaW5qZWN0R2xvYmFsQ3NzKCR7dmFyaWFibGV9LnRvU3RyaW5nKCksICcke0NTU0lNUE9SVF9DT01NRU5UfScsIGRvY3VtZW50KSk7XFxuICAgIGBcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKHRoZW1lUHJvcGVydGllcy5pbXBvcnRDc3MpIHtcbiAgICBjb25zdCBtaXNzaW5nTW9kdWxlcyA9IGNoZWNrTW9kdWxlcyh0aGVtZVByb3BlcnRpZXMuaW1wb3J0Q3NzKTtcbiAgICBpZiAobWlzc2luZ01vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgIFwiTWlzc2luZyBucG0gbW9kdWxlcyBvciBmaWxlcyAnXCIgK1xuICAgICAgICAgIG1pc3NpbmdNb2R1bGVzLmpvaW4oXCInLCAnXCIpICtcbiAgICAgICAgICBcIicgZm9yIGltcG9ydENzcyBtYXJrZWQgaW4gJ3RoZW1lLmpzb24nLlxcblwiICtcbiAgICAgICAgICBcIkluc3RhbGwgb3IgdXBkYXRlIHBhY2thZ2UocykgYnkgYWRkaW5nIGEgQE5wbVBhY2thZ2UgYW5ub3RhdGlvbiBvciBpbnN0YWxsIGl0IHVzaW5nICducG0vcG5wbS9idW4gaSdcIlxuICAgICAgKTtcbiAgICB9XG4gICAgdGhlbWVQcm9wZXJ0aWVzLmltcG9ydENzcy5mb3JFYWNoKChjc3NQYXRoKSA9PiB7XG4gICAgICBjb25zdCB2YXJpYWJsZSA9ICdtb2R1bGUnICsgaSsrO1xuICAgICAgZ2xvYmFsRmlsZUNvbnRlbnQucHVzaChgaW1wb3J0ICcke2Nzc1BhdGh9JztcXG5gKTtcbiAgICAgIGltcG9ydHMucHVzaChgaW1wb3J0ICR7dmFyaWFibGV9IGZyb20gJyR7Y3NzUGF0aH0/aW5saW5lJztcXG5gKTtcbiAgICAgIHNoYWRvd09ubHlDc3MucHVzaChgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwgJyR7Q1NTSU1QT1JUX0NPTU1FTlR9JywgdGFyZ2V0KSk7XFxuYCk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoYXV0b0luamVjdENvbXBvbmVudHMpIHtcbiAgICBjb21wb25lbnRzRmlsZXMuZm9yRWFjaCgoY29tcG9uZW50Q3NzKSA9PiB7XG4gICAgICBjb25zdCBmaWxlbmFtZSA9IGJhc2VuYW1lKGNvbXBvbmVudENzcyk7XG4gICAgICBjb25zdCB0YWcgPSBmaWxlbmFtZS5yZXBsYWNlKCcuY3NzJywgJycpO1xuICAgICAgY29uc3QgdmFyaWFibGUgPSBjYW1lbENhc2UoZmlsZW5hbWUpO1xuICAgICAgY29tcG9uZW50Q3NzSW1wb3J0cy5wdXNoKFxuICAgICAgICBgaW1wb3J0ICR7dmFyaWFibGV9IGZyb20gJ3RoZW1lcy8ke3RoZW1lTmFtZX0vJHt0aGVtZUNvbXBvbmVudHNGb2xkZXJ9LyR7ZmlsZW5hbWV9P2lubGluZSc7XFxuYFxuICAgICAgKTtcbiAgICAgIC8vIERvbid0IGZvcm1hdCBhcyB0aGUgZ2VuZXJhdGVkIGZpbGUgZm9ybWF0dGluZyB3aWxsIGdldCB3b25reSFcbiAgICAgIGNvbnN0IGNvbXBvbmVudFN0cmluZyA9IGByZWdpc3RlclN0eWxlcyhcbiAgICAgICAgJyR7dGFnfScsXG4gICAgICAgIHVuc2FmZUNTUygke3ZhcmlhYmxlfS50b1N0cmluZygpKVxuICAgICAgKTtcbiAgICAgIGA7XG4gICAgICBjb21wb25lbnRDc3NDb2RlLnB1c2goY29tcG9uZW50U3RyaW5nKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRoZW1lRmlsZUNvbnRlbnQgKz0gaW1wb3J0cy5qb2luKCcnKTtcblxuICAvLyBEb24ndCBmb3JtYXQgYXMgdGhlIGdlbmVyYXRlZCBmaWxlIGZvcm1hdHRpbmcgd2lsbCBnZXQgd29ua3khXG4gIC8vIElmIHRhcmdldHMgY2hlY2sgdGhhdCB3ZSBvbmx5IHJlZ2lzdGVyIHRoZSBzdHlsZSBwYXJ0cyBvbmNlLCBjaGVja3MgZXhpc3QgZm9yIGdsb2JhbCBjc3MgYW5kIGNvbXBvbmVudCBjc3NcbiAgY29uc3QgdGhlbWVGaWxlQXBwbHkgPSBgXG4gIGxldCB0aGVtZVJlbW92ZXJzID0gbmV3IFdlYWtNYXAoKTtcbiAgbGV0IHRhcmdldHMgPSBbXTtcblxuICBleHBvcnQgY29uc3QgYXBwbHlUaGVtZSA9ICh0YXJnZXQpID0+IHtcbiAgICBjb25zdCByZW1vdmVycyA9IFtdO1xuICAgIGlmICh0YXJnZXQgIT09IGRvY3VtZW50KSB7XG4gICAgICAke3NoYWRvd09ubHlDc3Muam9pbignJyl9XG4gICAgICAke2F1dG9JbmplY3RHbG9iYWxDc3NJbXBvcnRzID8gYFxuICAgICAgICB3ZWJjb21wb25lbnRHbG9iYWxDc3NJbmplY3RvcigoY3NzKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoY3NzLCAnJywgdGFyZ2V0KSk7XG4gICAgICAgIH0pO1xuICAgICAgICBgIDogJyd9XG4gICAgfVxuICAgICR7cGFyZW50VGhlbWV9XG4gICAgJHtnbG9iYWxDc3NDb2RlLmpvaW4oJycpfVxuXG4gICAgaWYgKGltcG9ydC5tZXRhLmhvdCkge1xuICAgICAgdGFyZ2V0cy5wdXNoKG5ldyBXZWFrUmVmKHRhcmdldCkpO1xuICAgICAgdGhlbWVSZW1vdmVycy5zZXQodGFyZ2V0LCByZW1vdmVycyk7XG4gICAgfVxuXG4gIH1cblxuYDtcbiAgY29tcG9uZW50c0ZpbGVDb250ZW50ICs9IGBcbiR7Y29tcG9uZW50Q3NzSW1wb3J0cy5qb2luKCcnKX1cblxuaWYgKCFkb2N1bWVudFsnJHtjb21wb25lbnRDc3NGbGFnfSddKSB7XG4gICR7Y29tcG9uZW50Q3NzQ29kZS5qb2luKCcnKX1cbiAgZG9jdW1lbnRbJyR7Y29tcG9uZW50Q3NzRmxhZ30nXSA9IHRydWU7XG59XG5cbmlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgaW1wb3J0Lm1ldGEuaG90LmFjY2VwdCgobW9kdWxlKSA9PiB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9KTtcbn1cblxuYDtcblxuICB0aGVtZUZpbGVDb250ZW50ICs9IHRoZW1lRmlsZUFwcGx5O1xuICB0aGVtZUZpbGVDb250ZW50ICs9IGBcbmlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgaW1wb3J0Lm1ldGEuaG90LmFjY2VwdCgobW9kdWxlKSA9PiB7XG5cbiAgICBpZiAobmVlZHNSZWxvYWRPbkNoYW5nZXMpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldFJlZiA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRhcmdldFJlZi5kZXJlZigpO1xuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgdGhlbWVSZW1vdmVycy5nZXQodGFyZ2V0KS5mb3JFYWNoKHJlbW92ZXIgPT4gcmVtb3ZlcigpKVxuICAgICAgICAgIG1vZHVsZS5hcHBseVRoZW1lKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KTtcblxuICBpbXBvcnQubWV0YS5ob3Qub24oJ3ZpdGU6YWZ0ZXJVcGRhdGUnLCAodXBkYXRlKSA9PiB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3ZhYWRpbi10aGVtZS11cGRhdGVkJywgeyBkZXRhaWw6IHVwZGF0ZSB9KSk7XG4gIH0pO1xufVxuXG5gO1xuXG4gIGdsb2JhbEltcG9ydENvbnRlbnQgKz0gYFxuJHtnbG9iYWxGaWxlQ29udGVudC5qb2luKCcnKX1cbmA7XG5cbiAgd3JpdGVJZkNoYW5nZWQocmVzb2x2ZShvdXRwdXRGb2xkZXIsIGdsb2JhbEZpbGVuYW1lKSwgZ2xvYmFsSW1wb3J0Q29udGVudCk7XG4gIHdyaXRlSWZDaGFuZ2VkKHJlc29sdmUob3V0cHV0Rm9sZGVyLCB0aGVtZUZpbGVuYW1lKSwgdGhlbWVGaWxlQ29udGVudCk7XG4gIHdyaXRlSWZDaGFuZ2VkKHJlc29sdmUob3V0cHV0Rm9sZGVyLCBjb21wb25lbnRzRmlsZW5hbWUpLCBjb21wb25lbnRzRmlsZUNvbnRlbnQpO1xufVxuXG5mdW5jdGlvbiB3cml0ZUlmQ2hhbmdlZChmaWxlLCBkYXRhKSB7XG4gIGlmICghZXhpc3RzU3luYyhmaWxlKSB8fCByZWFkRmlsZVN5bmMoZmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSAhPT0gZGF0YSkge1xuICAgIHdyaXRlRmlsZVN5bmMoZmlsZSwgZGF0YSk7XG4gIH1cbn1cblxuLyoqXG4gKiBNYWtlIGdpdmVuIHN0cmluZyBpbnRvIGNhbWVsQ2FzZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIHN0cmluZyB0byBtYWtlIGludG8gY2FtZUNhc2VcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNhbWVsQ2FzZWQgdmVyc2lvblxuICovXG5mdW5jdGlvbiBjYW1lbENhc2Uoc3RyKSB7XG4gIHJldHVybiBzdHJcbiAgICAucmVwbGFjZSgvKD86Xlxcd3xbQS1aXXxcXGJcXHcpL2csIGZ1bmN0aW9uICh3b3JkLCBpbmRleCkge1xuICAgICAgcmV0dXJuIGluZGV4ID09PSAwID8gd29yZC50b0xvd2VyQ2FzZSgpIDogd29yZC50b1VwcGVyQ2FzZSgpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoL1xccysvZywgJycpXG4gICAgLnJlcGxhY2UoL1xcLnxcXC0vZywgJycpO1xufVxuXG5leHBvcnQgeyB3cml0ZVRoZW1lRmlsZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxL3RhcmdldC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxL3RhcmdldC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpbi90aGVtZS1jb3B5LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9taXJha2hyZWlzL3RlYW0xLmZyb250ZW5kMS90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtY29weS5qc1wiOy8qXG4gKiBDb3B5cmlnaHQgMjAwMC0yMDI0IFZhYWRpbiBMdGQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3RcbiAqIHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mXG4gKiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVFxuICogV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlXG4gKiBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlclxuICogdGhlIExpY2Vuc2UuXG4gKi9cblxuLyoqXG4gKiBUaGlzIGNvbnRhaW5zIGZ1bmN0aW9ucyBhbmQgZmVhdHVyZXMgdXNlZCB0byBjb3B5IHRoZW1lIGZpbGVzLlxuICovXG5cbmltcG9ydCB7IHJlYWRkaXJTeW5jLCBzdGF0U3luYywgbWtkaXJTeW5jLCBleGlzdHNTeW5jLCBjb3B5RmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyByZXNvbHZlLCBiYXNlbmFtZSwgcmVsYXRpdmUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGdsb2JTeW5jIH0gZnJvbSAnZ2xvYic7XG5cbmNvbnN0IGlnbm9yZWRGaWxlRXh0ZW5zaW9ucyA9IFsnLmNzcycsICcuanMnLCAnLmpzb24nXTtcblxuLyoqXG4gKiBDb3B5IHRoZW1lIHN0YXRpYyByZXNvdXJjZXMgdG8gc3RhdGljIGFzc2V0cyBmb2xkZXIuIEFsbCBmaWxlcyBpbiB0aGUgdGhlbWVcbiAqIGZvbGRlciB3aWxsIGJlIGNvcGllZCBleGNsdWRpbmcgY3NzLCBqcyBhbmQganNvbiBmaWxlcyB0aGF0IHdpbGwgYmVcbiAqIGhhbmRsZWQgYnkgd2VicGFjayBhbmQgbm90IGJlIHNoYXJlZCBhcyBzdGF0aWMgZmlsZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lRm9sZGVyIEZvbGRlciB3aXRoIHRoZW1lIGZpbGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyIHJlc291cmNlcyBvdXRwdXQgZm9sZGVyXG4gKiBAcGFyYW0ge29iamVjdH0gbG9nZ2VyIHBsdWdpbiBsb2dnZXJcbiAqL1xuZnVuY3Rpb24gY29weVRoZW1lUmVzb3VyY2VzKHRoZW1lRm9sZGVyLCBwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCBsb2dnZXIpIHtcbiAgY29uc3Qgc3RhdGljQXNzZXRzVGhlbWVGb2xkZXIgPSByZXNvbHZlKHByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsICd0aGVtZXMnLCBiYXNlbmFtZSh0aGVtZUZvbGRlcikpO1xuICBjb25zdCBjb2xsZWN0aW9uID0gY29sbGVjdEZvbGRlcnModGhlbWVGb2xkZXIsIGxvZ2dlcik7XG5cbiAgLy8gT25seSBjcmVhdGUgYXNzZXRzIGZvbGRlciBpZiB0aGVyZSBhcmUgZmlsZXMgdG8gY29weS5cbiAgaWYgKGNvbGxlY3Rpb24uZmlsZXMubGVuZ3RoID4gMCkge1xuICAgIG1rZGlyU3luYyhzdGF0aWNBc3NldHNUaGVtZUZvbGRlciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgLy8gY3JlYXRlIGZvbGRlcnMgd2l0aFxuICAgIGNvbGxlY3Rpb24uZGlyZWN0b3JpZXMuZm9yRWFjaCgoZGlyZWN0b3J5KSA9PiB7XG4gICAgICBjb25zdCByZWxhdGl2ZURpcmVjdG9yeSA9IHJlbGF0aXZlKHRoZW1lRm9sZGVyLCBkaXJlY3RvcnkpO1xuICAgICAgY29uc3QgdGFyZ2V0RGlyZWN0b3J5ID0gcmVzb2x2ZShzdGF0aWNBc3NldHNUaGVtZUZvbGRlciwgcmVsYXRpdmVEaXJlY3RvcnkpO1xuXG4gICAgICBta2RpclN5bmModGFyZ2V0RGlyZWN0b3J5LCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICB9KTtcblxuICAgIGNvbGxlY3Rpb24uZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgY29uc3QgcmVsYXRpdmVGaWxlID0gcmVsYXRpdmUodGhlbWVGb2xkZXIsIGZpbGUpO1xuICAgICAgY29uc3QgdGFyZ2V0RmlsZSA9IHJlc29sdmUoc3RhdGljQXNzZXRzVGhlbWVGb2xkZXIsIHJlbGF0aXZlRmlsZSk7XG4gICAgICBjb3B5RmlsZUlmQWJzZW50T3JOZXdlcihmaWxlLCB0YXJnZXRGaWxlLCBsb2dnZXIpO1xuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ29sbGVjdCBhbGwgZm9sZGVycyB3aXRoIGNvcHlhYmxlIGZpbGVzIGFuZCBhbGwgZmlsZXMgdG8gYmUgY29waWVkLlxuICogRm9sZWQgd2lsbCBub3QgYmUgYWRkZWQgaWYgbm8gZmlsZXMgaW4gZm9sZGVyIG9yIHN1YmZvbGRlcnMuXG4gKlxuICogRmlsZXMgd2lsbCBub3QgY29udGFpbiBmaWxlcyB3aXRoIGlnbm9yZWQgZXh0ZW5zaW9ucyBhbmQgZm9sZGVycyBvbmx5IGNvbnRhaW5pbmcgaWdub3JlZCBmaWxlcyB3aWxsIG5vdCBiZSBhZGRlZC5cbiAqXG4gKiBAcGFyYW0gZm9sZGVyVG9Db3B5IGZvbGRlciB3ZSB3aWxsIGNvcHkgZmlsZXMgZnJvbVxuICogQHBhcmFtIGxvZ2dlciBwbHVnaW4gbG9nZ2VyXG4gKiBAcmV0dXJuIHt7ZGlyZWN0b3JpZXM6IFtdLCBmaWxlczogW119fSBvYmplY3QgY29udGFpbmluZyBkaXJlY3RvcmllcyB0byBjcmVhdGUgYW5kIGZpbGVzIHRvIGNvcHlcbiAqL1xuZnVuY3Rpb24gY29sbGVjdEZvbGRlcnMoZm9sZGVyVG9Db3B5LCBsb2dnZXIpIHtcbiAgY29uc3QgY29sbGVjdGlvbiA9IHsgZGlyZWN0b3JpZXM6IFtdLCBmaWxlczogW10gfTtcbiAgbG9nZ2VyLnRyYWNlKCdmaWxlcyBpbiBkaXJlY3RvcnknLCByZWFkZGlyU3luYyhmb2xkZXJUb0NvcHkpKTtcbiAgcmVhZGRpclN5bmMoZm9sZGVyVG9Db3B5KS5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgY29uc3QgZmlsZVRvQ29weSA9IHJlc29sdmUoZm9sZGVyVG9Db3B5LCBmaWxlKTtcbiAgICB0cnkge1xuICAgICAgaWYgKHN0YXRTeW5jKGZpbGVUb0NvcHkpLmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdHb2luZyB0aHJvdWdoIGRpcmVjdG9yeScsIGZpbGVUb0NvcHkpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBjb2xsZWN0Rm9sZGVycyhmaWxlVG9Db3B5LCBsb2dnZXIpO1xuICAgICAgICBpZiAocmVzdWx0LmZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBjb2xsZWN0aW9uLmRpcmVjdG9yaWVzLnB1c2goZmlsZVRvQ29weSk7XG4gICAgICAgICAgbG9nZ2VyLmRlYnVnKCdBZGRpbmcgZGlyZWN0b3J5JywgZmlsZVRvQ29weSk7XG4gICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3Rvcmllcy5wdXNoLmFwcGx5KGNvbGxlY3Rpb24uZGlyZWN0b3JpZXMsIHJlc3VsdC5kaXJlY3Rvcmllcyk7XG4gICAgICAgICAgY29sbGVjdGlvbi5maWxlcy5wdXNoLmFwcGx5KGNvbGxlY3Rpb24uZmlsZXMsIHJlc3VsdC5maWxlcyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoIWlnbm9yZWRGaWxlRXh0ZW5zaW9ucy5pbmNsdWRlcyhleHRuYW1lKGZpbGVUb0NvcHkpKSkge1xuICAgICAgICBsb2dnZXIuZGVidWcoJ0FkZGluZyBmaWxlJywgZmlsZVRvQ29weSk7XG4gICAgICAgIGNvbGxlY3Rpb24uZmlsZXMucHVzaChmaWxlVG9Db3B5KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaGFuZGxlTm9TdWNoRmlsZUVycm9yKGZpbGVUb0NvcHksIGVycm9yLCBsb2dnZXIpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBjb2xsZWN0aW9uO1xufVxuXG4vKipcbiAqIENvcHkgYW55IHN0YXRpYyBub2RlX21vZHVsZXMgYXNzZXRzIG1hcmtlZCBpbiB0aGVtZS5qc29uIHRvXG4gKiBwcm9qZWN0IHN0YXRpYyBhc3NldHMgZm9sZGVyLlxuICpcbiAqIFRoZSB0aGVtZS5qc29uIGNvbnRlbnQgZm9yIGFzc2V0cyBpcyBzZXQgdXAgYXM6XG4gKiB7XG4gKiAgIGFzc2V0czoge1xuICogICAgIFwibm9kZV9tb2R1bGUgaWRlbnRpZmllclwiOiB7XG4gKiAgICAgICBcImNvcHktcnVsZVwiOiBcInRhcmdldC9mb2xkZXJcIixcbiAqICAgICB9XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBUaGlzIHdvdWxkIG1lYW4gdGhhdCBhbiBhc3NldCB3b3VsZCBiZSBidWlsdCBhczpcbiAqIFwiQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLWZyZWVcIjoge1xuICogICBcInN2Z3MvcmVndWxhci8qKlwiOiBcImZvcnRhd2Vzb21lL2ljb25zXCJcbiAqIH1cbiAqIFdoZXJlICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtZnJlZScgaXMgdGhlIG5wbSBwYWNrYWdlLCAnc3Zncy9yZWd1bGFyLyoqJyBpcyB3aGF0IHNob3VsZCBiZSBjb3BpZWRcbiAqIGFuZCAnZm9ydGF3ZXNvbWUvaWNvbnMnIGlzIHRoZSB0YXJnZXQgZGlyZWN0b3J5IHVuZGVyIHByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIgd2hlcmUgdGhpbmdzXG4gKiB3aWxsIGdldCBjb3BpZWQgdG8uXG4gKlxuICogTm90ZSEgdGhlcmUgY2FuIGJlIG11bHRpcGxlIGNvcHktcnVsZXMgd2l0aCB0YXJnZXQgZm9sZGVycyBmb3Igb25lIG5wbSBwYWNrYWdlIGFzc2V0LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZU5hbWUgbmFtZSBvZiB0aGUgdGhlbWUgd2UgYXJlIGNvcHlpbmcgYXNzZXRzIGZvclxuICogQHBhcmFtIHtqc29ufSB0aGVtZVByb3BlcnRpZXMgdGhlbWUgcHJvcGVydGllcyBqc29uIHdpdGggZGF0YSBvbiBhc3NldHNcbiAqIEBwYXJhbSB7c3RyaW5nfSBwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyIHByb2plY3Qgb3V0cHV0IGZvbGRlciB3aGVyZSB3ZSBjb3B5IGFzc2V0cyB0byB1bmRlciB0aGVtZS9bdGhlbWVOYW1lXVxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIGNvcHlTdGF0aWNBc3NldHModGhlbWVOYW1lLCB0aGVtZVByb3BlcnRpZXMsIHByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIGxvZ2dlcikge1xuICBjb25zdCBhc3NldHMgPSB0aGVtZVByb3BlcnRpZXNbJ2Fzc2V0cyddO1xuICBpZiAoIWFzc2V0cykge1xuICAgIGxvZ2dlci5kZWJ1Zygnbm8gYXNzZXRzIHRvIGhhbmRsZSBubyBzdGF0aWMgYXNzZXRzIHdlcmUgY29waWVkJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbWtkaXJTeW5jKHByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIHtcbiAgICByZWN1cnNpdmU6IHRydWVcbiAgfSk7XG4gIGNvbnN0IG1pc3NpbmdNb2R1bGVzID0gY2hlY2tNb2R1bGVzKE9iamVjdC5rZXlzKGFzc2V0cykpO1xuICBpZiAobWlzc2luZ01vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IEVycm9yKFxuICAgICAgXCJNaXNzaW5nIG5wbSBtb2R1bGVzICdcIiArXG4gICAgICAgIG1pc3NpbmdNb2R1bGVzLmpvaW4oXCInLCAnXCIpICtcbiAgICAgICAgXCInIGZvciBhc3NldHMgbWFya2VkIGluICd0aGVtZS5qc29uJy5cXG5cIiArXG4gICAgICAgIFwiSW5zdGFsbCBwYWNrYWdlKHMpIGJ5IGFkZGluZyBhIEBOcG1QYWNrYWdlIGFubm90YXRpb24gb3IgaW5zdGFsbCBpdCB1c2luZyAnbnBtL3BucG0vYnVuIGknXCJcbiAgICApO1xuICB9XG4gIE9iamVjdC5rZXlzKGFzc2V0cykuZm9yRWFjaCgobW9kdWxlKSA9PiB7XG4gICAgY29uc3QgY29weVJ1bGVzID0gYXNzZXRzW21vZHVsZV07XG4gICAgT2JqZWN0LmtleXMoY29weVJ1bGVzKS5mb3JFYWNoKChjb3B5UnVsZSkgPT4ge1xuICAgICAgY29uc3Qgbm9kZVNvdXJjZXMgPSByZXNvbHZlKCdub2RlX21vZHVsZXMvJywgbW9kdWxlLCBjb3B5UnVsZSk7XG4gICAgICBjb25zdCBmaWxlcyA9IGdsb2JTeW5jKG5vZGVTb3VyY2VzLCB7IG5vZGlyOiB0cnVlIH0pO1xuICAgICAgY29uc3QgdGFyZ2V0Rm9sZGVyID0gcmVzb2x2ZShwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCAndGhlbWVzJywgdGhlbWVOYW1lLCBjb3B5UnVsZXNbY29weVJ1bGVdKTtcblxuICAgICAgbWtkaXJTeW5jKHRhcmdldEZvbGRlciwge1xuICAgICAgICByZWN1cnNpdmU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICBjb25zdCBjb3B5VGFyZ2V0ID0gcmVzb2x2ZSh0YXJnZXRGb2xkZXIsIGJhc2VuYW1lKGZpbGUpKTtcbiAgICAgICAgY29weUZpbGVJZkFic2VudE9yTmV3ZXIoZmlsZSwgY29weVRhcmdldCwgbG9nZ2VyKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2hlY2tNb2R1bGVzKG1vZHVsZXMpIHtcbiAgY29uc3QgbWlzc2luZyA9IFtdO1xuXG4gIG1vZHVsZXMuZm9yRWFjaCgobW9kdWxlKSA9PiB7XG4gICAgaWYgKCFleGlzdHNTeW5jKHJlc29sdmUoJ25vZGVfbW9kdWxlcy8nLCBtb2R1bGUpKSkge1xuICAgICAgbWlzc2luZy5wdXNoKG1vZHVsZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbWlzc2luZztcbn1cblxuLyoqXG4gKiBDb3BpZXMgZ2l2ZW4gZmlsZSB0byBhIGdpdmVuIHRhcmdldCBwYXRoLCBpZiB0YXJnZXQgZmlsZSBkb2Vzbid0IGV4aXN0IG9yIGlmXG4gKiBmaWxlIHRvIGNvcHkgaXMgbmV3ZXIuXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlsZVRvQ29weSBwYXRoIG9mIHRoZSBmaWxlIHRvIGNvcHlcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb3B5VGFyZ2V0IHBhdGggb2YgdGhlIHRhcmdldCBmaWxlXG4gKiBAcGFyYW0ge29iamVjdH0gbG9nZ2VyIHBsdWdpbiBsb2dnZXJcbiAqL1xuZnVuY3Rpb24gY29weUZpbGVJZkFic2VudE9yTmV3ZXIoZmlsZVRvQ29weSwgY29weVRhcmdldCwgbG9nZ2VyKSB7XG4gIHRyeSB7XG4gICAgaWYgKCFleGlzdHNTeW5jKGNvcHlUYXJnZXQpIHx8IHN0YXRTeW5jKGNvcHlUYXJnZXQpLm10aW1lIDwgc3RhdFN5bmMoZmlsZVRvQ29weSkubXRpbWUpIHtcbiAgICAgIGxvZ2dlci50cmFjZSgnQ29weWluZzogJywgZmlsZVRvQ29weSwgJz0+JywgY29weVRhcmdldCk7XG4gICAgICBjb3B5RmlsZVN5bmMoZmlsZVRvQ29weSwgY29weVRhcmdldCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGhhbmRsZU5vU3VjaEZpbGVFcnJvcihmaWxlVG9Db3B5LCBlcnJvciwgbG9nZ2VyKTtcbiAgfVxufVxuXG4vLyBJZ25vcmVzIGVycm9ycyBkdWUgdG8gZmlsZSBtaXNzaW5nIGR1cmluZyB0aGVtZSBwcm9jZXNzaW5nXG4vLyBUaGlzIG1heSBoYXBwZW4gZm9yIGV4YW1wbGUgd2hlbiBhbiBJREUgY3JlYXRlcyBhIHRlbXBvcmFyeSBmaWxlXG4vLyBhbmQgdGhlbiBpbW1lZGlhdGVseSBkZWxldGVzIGl0XG5mdW5jdGlvbiBoYW5kbGVOb1N1Y2hGaWxlRXJyb3IoZmlsZSwgZXJyb3IsIGxvZ2dlcikge1xuICBpZiAoZXJyb3IuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICBsb2dnZXIud2FybignSWdub3Jpbmcgbm90IGV4aXN0aW5nIGZpbGUgJyArIGZpbGUgKyAnLiBGaWxlIG1heSBoYXZlIGJlZW4gZGVsZXRlZCBkdXJpbmcgdGhlbWUgcHJvY2Vzc2luZy4nKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5leHBvcnQgeyBjaGVja01vZHVsZXMsIGNvcHlTdGF0aWNBc3NldHMsIGNvcHlUaGVtZVJlc291cmNlcyB9O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L3BsdWdpbnMvdGhlbWUtbG9hZGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L3BsdWdpbnMvdGhlbWUtbG9hZGVyL3RoZW1lLWxvYWRlci11dGlscy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L3BsdWdpbnMvdGhlbWUtbG9hZGVyL3RoZW1lLWxvYWRlci11dGlscy5qc1wiO2ltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IHJlc29sdmUsIGJhc2VuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InO1xuXG4vLyBDb2xsZWN0IGdyb3VwcyBbdXJsKF0gWyd8XCJdb3B0aW9uYWwgJy4vfC4uLycsIG90aGVyICcuLi8nIHNlZ21lbnRzIG9wdGlvbmFsLCBmaWxlIHBhcnQgYW5kIGVuZCBvZiB1cmxcbi8vIFRoZSBhZGRpdGlvbmFsIGRvdCBzZWdtZW50cyBjb3VsZCBiZSBVUkwgcmVmZXJlbmNpbmcgYXNzZXRzIGluIG5lc3RlZCBpbXBvcnRlZCBDU1Ncbi8vIFdoZW4gVml0ZSBpbmxpbmVzIENTUyBpbXBvcnQgaXQgZG9lcyBub3QgcmV3cml0ZSByZWxhdGl2ZSBVUkwgZm9yIG5vdC1yZXNvbHZhYmxlIHJlc291cmNlXG4vLyBzbyB0aGUgZmluYWwgQ1NTIGVuZHMgdXAgd2l0aCB3cm9uZyByZWxhdGl2ZSBVUkxzIChyLmcuIC4uLy4uL3BrZy9pY29uLnN2Zylcbi8vIElmIHRoZSBVUkwgaXMgcmVsYXRpdmUsIHdlIHNob3VsZCB0cnkgdG8gY2hlY2sgaWYgaXQgaXMgYW4gYXNzZXQgYnkgaWdub3JpbmcgdGhlIGFkZGl0aW9uYWwgZG90IHNlZ21lbnRzXG5jb25zdCB1cmxNYXRjaGVyID0gLyh1cmxcXChcXHMqKShcXCd8XFxcIik/KFxcLlxcL3xcXC5cXC5cXC8pKCg/OlxcMykqKT8oXFxTKikoXFwyXFxzKlxcKSkvZztcblxuZnVuY3Rpb24gYXNzZXRzQ29udGFpbnMoZmlsZVVybCwgdGhlbWVGb2xkZXIsIGxvZ2dlcikge1xuICBjb25zdCB0aGVtZVByb3BlcnRpZXMgPSBnZXRUaGVtZVByb3BlcnRpZXModGhlbWVGb2xkZXIpO1xuICBpZiAoIXRoZW1lUHJvcGVydGllcykge1xuICAgIGxvZ2dlci5kZWJ1ZygnTm8gdGhlbWUgcHJvcGVydGllcyBmb3VuZC4nKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY29uc3QgYXNzZXRzID0gdGhlbWVQcm9wZXJ0aWVzWydhc3NldHMnXTtcbiAgaWYgKCFhc3NldHMpIHtcbiAgICBsb2dnZXIuZGVidWcoJ05vIGRlZmluZWQgYXNzZXRzIGluIHRoZW1lIHByb3BlcnRpZXMnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy8gR28gdGhyb3VnaCBlYWNoIGFzc2V0IG1vZHVsZVxuICBmb3IgKGxldCBtb2R1bGUgb2YgT2JqZWN0LmtleXMoYXNzZXRzKSkge1xuICAgIGNvbnN0IGNvcHlSdWxlcyA9IGFzc2V0c1ttb2R1bGVdO1xuICAgIC8vIEdvIHRocm91Z2ggZWFjaCBjb3B5IHJ1bGVcbiAgICBmb3IgKGxldCBjb3B5UnVsZSBvZiBPYmplY3Qua2V5cyhjb3B5UnVsZXMpKSB7XG4gICAgICAvLyBpZiBmaWxlIHN0YXJ0cyB3aXRoIGNvcHlSdWxlIHRhcmdldCBjaGVjayBpZiBmaWxlIHdpdGggcGF0aCBhZnRlciBjb3B5IHRhcmdldCBjYW4gYmUgZm91bmRcbiAgICAgIGlmIChmaWxlVXJsLnN0YXJ0c1dpdGgoY29weVJ1bGVzW2NvcHlSdWxlXSkpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0RmlsZSA9IGZpbGVVcmwucmVwbGFjZShjb3B5UnVsZXNbY29weVJ1bGVdLCAnJyk7XG4gICAgICAgIGNvbnN0IGZpbGVzID0gZ2xvYlN5bmMocmVzb2x2ZSgnbm9kZV9tb2R1bGVzLycsIG1vZHVsZSwgY29weVJ1bGUpLCB7IG5vZGlyOiB0cnVlIH0pO1xuXG4gICAgICAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICBpZiAoZmlsZS5lbmRzV2l0aCh0YXJnZXRGaWxlKSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBnZXRUaGVtZVByb3BlcnRpZXModGhlbWVGb2xkZXIpIHtcbiAgY29uc3QgdGhlbWVQcm9wZXJ0eUZpbGUgPSByZXNvbHZlKHRoZW1lRm9sZGVyLCAndGhlbWUuanNvbicpO1xuICBpZiAoIWV4aXN0c1N5bmModGhlbWVQcm9wZXJ0eUZpbGUpKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIGNvbnN0IHRoZW1lUHJvcGVydHlGaWxlQXNTdHJpbmcgPSByZWFkRmlsZVN5bmModGhlbWVQcm9wZXJ0eUZpbGUpO1xuICBpZiAodGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgcmV0dXJuIEpTT04ucGFyc2UodGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZyk7XG59XG5cbmZ1bmN0aW9uIHJld3JpdGVDc3NVcmxzKHNvdXJjZSwgaGFuZGxlZFJlc291cmNlRm9sZGVyLCB0aGVtZUZvbGRlciwgbG9nZ2VyLCBvcHRpb25zKSB7XG4gIHNvdXJjZSA9IHNvdXJjZS5yZXBsYWNlKHVybE1hdGNoZXIsIGZ1bmN0aW9uIChtYXRjaCwgdXJsLCBxdW90ZU1hcmssIHJlcGxhY2UsIGFkZGl0aW9uYWxEb3RTZWdtZW50cywgZmlsZVVybCwgZW5kU3RyaW5nKSB7XG4gICAgbGV0IGFic29sdXRlUGF0aCA9IHJlc29sdmUoaGFuZGxlZFJlc291cmNlRm9sZGVyLCByZXBsYWNlLCBhZGRpdGlvbmFsRG90U2VnbWVudHMgfHwgJycsIGZpbGVVcmwpO1xuICAgIGxldCBleGlzdGluZ1RoZW1lUmVzb3VyY2UgPSBhYnNvbHV0ZVBhdGguc3RhcnRzV2l0aCh0aGVtZUZvbGRlcikgJiYgZXhpc3RzU3luYyhhYnNvbHV0ZVBhdGgpO1xuICAgIGlmICghZXhpc3RpbmdUaGVtZVJlc291cmNlICYmIGFkZGl0aW9uYWxEb3RTZWdtZW50cykge1xuICAgICAgLy8gVHJ5IHRvIHJlc29sdmUgcGF0aCB3aXRob3V0IGRvdCBzZWdtZW50cyBhcyBpdCBtYXkgYmUgYW4gdW5yZXNvbHZhYmxlXG4gICAgICAvLyByZWxhdGl2ZSBVUkwgZnJvbSBhbiBpbmxpbmVkIG5lc3RlZCBDU1NcbiAgICAgIGFic29sdXRlUGF0aCA9IHJlc29sdmUoaGFuZGxlZFJlc291cmNlRm9sZGVyLCByZXBsYWNlLCBmaWxlVXJsKTtcbiAgICAgIGV4aXN0aW5nVGhlbWVSZXNvdXJjZSA9IGFic29sdXRlUGF0aC5zdGFydHNXaXRoKHRoZW1lRm9sZGVyKSAmJiBleGlzdHNTeW5jKGFic29sdXRlUGF0aCk7XG4gICAgfVxuICAgIGNvbnN0IGlzQXNzZXQgPSBhc3NldHNDb250YWlucyhmaWxlVXJsLCB0aGVtZUZvbGRlciwgbG9nZ2VyKTtcbiAgICBpZiAoZXhpc3RpbmdUaGVtZVJlc291cmNlIHx8IGlzQXNzZXQpIHtcbiAgICAgIC8vIEFkZGluZyAuLyB3aWxsIHNraXAgY3NzLWxvYWRlciwgd2hpY2ggc2hvdWxkIGJlIGRvbmUgZm9yIGFzc2V0IGZpbGVzXG4gICAgICAvLyBJbiBhIHByb2R1Y3Rpb24gYnVpbGQsIHRoZSBjc3MgZmlsZSBpcyBpbiBWQUFESU4vYnVpbGQgYW5kIHN0YXRpYyBmaWxlcyBhcmUgaW4gVkFBRElOL3N0YXRpYywgc28gLi4vc3RhdGljIG5lZWRzIHRvIGJlIGFkZGVkXG4gICAgICBjb25zdCByZXBsYWNlbWVudCA9IG9wdGlvbnMuZGV2TW9kZSA/ICcuLycgOiAnLi4vc3RhdGljLyc7XG5cbiAgICAgIGNvbnN0IHNraXBMb2FkZXIgPSBleGlzdGluZ1RoZW1lUmVzb3VyY2UgPyAnJyA6IHJlcGxhY2VtZW50O1xuICAgICAgY29uc3QgZnJvbnRlbmRUaGVtZUZvbGRlciA9IHNraXBMb2FkZXIgKyAndGhlbWVzLycgKyBiYXNlbmFtZSh0aGVtZUZvbGRlcik7XG4gICAgICBsb2dnZXIubG9nKFxuICAgICAgICAnVXBkYXRpbmcgdXJsIGZvciBmaWxlJyxcbiAgICAgICAgXCInXCIgKyByZXBsYWNlICsgZmlsZVVybCArIFwiJ1wiLFxuICAgICAgICAndG8gdXNlJyxcbiAgICAgICAgXCInXCIgKyBmcm9udGVuZFRoZW1lRm9sZGVyICsgJy8nICsgZmlsZVVybCArIFwiJ1wiXG4gICAgICApO1xuICAgICAgLy8gYXNzZXRzIGFyZSBhbHdheXMgcmVsYXRpdmUgdG8gdGhlbWUgZm9sZGVyXG4gICAgICBjb25zdCBwYXRoUmVzb2x2ZWQgPSBpc0Fzc2V0ID8gJy8nICsgZmlsZVVybFxuICAgICAgICAgIDogYWJzb2x1dGVQYXRoLnN1YnN0cmluZyh0aGVtZUZvbGRlci5sZW5ndGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcblxuICAgICAgLy8ga2VlcCB0aGUgdXJsIHRoZSBzYW1lIGV4Y2VwdCByZXBsYWNlIHRoZSAuLyBvciAuLi8gdG8gdGhlbWVzL1t0aGVtZUZvbGRlcl1cbiAgICAgIHJldHVybiB1cmwgKyAocXVvdGVNYXJrID8/ICcnKSArIGZyb250ZW5kVGhlbWVGb2xkZXIgKyBwYXRoUmVzb2x2ZWQgKyBlbmRTdHJpbmc7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmRldk1vZGUpIHtcbiAgICAgIGxvZ2dlci5sb2coXCJObyByZXdyaXRlIGZvciAnXCIsIG1hdGNoLCBcIicgYXMgdGhlIGZpbGUgd2FzIG5vdCBmb3VuZC5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEluIHByb2R1Y3Rpb24sIHRoZSBjc3MgaXMgaW4gVkFBRElOL2J1aWxkIGJ1dCB0aGUgdGhlbWUgZmlsZXMgYXJlIGluIC5cbiAgICAgIHJldHVybiB1cmwgKyAocXVvdGVNYXJrID8/ICcnKSArICcuLi8uLi8nICsgZmlsZVVybCArIGVuZFN0cmluZztcbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoO1xuICB9KTtcbiAgcmV0dXJuIHNvdXJjZTtcbn1cblxuZXhwb3J0IHsgcmV3cml0ZUNzc1VybHMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxL3RhcmdldC9wbHVnaW5zL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxL3RhcmdldC9wbHVnaW5zL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi9yZWFjdC1mdW5jdGlvbi1sb2NhdGlvbi1wbHVnaW4uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxL3RhcmdldC9wbHVnaW5zL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi9yZWFjdC1mdW5jdGlvbi1sb2NhdGlvbi1wbHVnaW4uanNcIjtpbXBvcnQgKiBhcyB0IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGdW5jdGlvbkNvbXBvbmVudFNvdXJjZUxvY2F0aW9uQmFiZWwoKSB7XG4gIGZ1bmN0aW9uIGlzUmVhY3RGdW5jdGlvbk5hbWUobmFtZSkge1xuICAgIC8vIEEgUmVhY3QgY29tcG9uZW50IGZ1bmN0aW9uIGFsd2F5cyBzdGFydHMgd2l0aCBhIENhcGl0YWwgbGV0dGVyXG4gICAgcmV0dXJuIG5hbWUgJiYgbmFtZS5tYXRjaCgvXltBLVpdLiovKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgZGVidWcgaW5mbyBhcyBOYW1lLl9fZGVidWdTb3VyY2VEZWZpbmU9ey4uLn0gYWZ0ZXIgdGhlIGdpdmVuIHN0YXRlbWVudCAoXCJwYXRoXCIpLlxuICAgKiBUaGlzIGlzIHVzZWQgdG8gbWFrZSB0aGUgc291cmNlIGxvY2F0aW9uIG9mIHRoZSBmdW5jdGlvbiAoZGVmaW5lZCBieSB0aGUgbG9jIHBhcmFtZXRlcikgYXZhaWxhYmxlIGluIHRoZSBicm93c2VyIGluIGRldmVsb3BtZW50IG1vZGUuXG4gICAqIFRoZSBuYW1lIF9fZGVidWdTb3VyY2VEZWZpbmUgaXMgcHJlZml4ZWQgYnkgX18gdG8gbWFyayB0aGlzIGlzIG5vdCBhIHB1YmxpYyBBUEkuXG4gICAqL1xuICBmdW5jdGlvbiBhZGREZWJ1Z0luZm8ocGF0aCwgbmFtZSwgZmlsZW5hbWUsIGxvYykge1xuICAgIGNvbnN0IGxpbmVOdW1iZXIgPSBsb2Muc3RhcnQubGluZTtcbiAgICBjb25zdCBjb2x1bW5OdW1iZXIgPSBsb2Muc3RhcnQuY29sdW1uICsgMTtcbiAgICBjb25zdCBkZWJ1Z1NvdXJjZU1lbWJlciA9IHQubWVtYmVyRXhwcmVzc2lvbih0LmlkZW50aWZpZXIobmFtZSksIHQuaWRlbnRpZmllcignX19kZWJ1Z1NvdXJjZURlZmluZScpKTtcbiAgICBjb25zdCBkZWJ1Z1NvdXJjZURlZmluZSA9IHQub2JqZWN0RXhwcmVzc2lvbihbXG4gICAgICB0Lm9iamVjdFByb3BlcnR5KHQuaWRlbnRpZmllcignZmlsZU5hbWUnKSwgdC5zdHJpbmdMaXRlcmFsKGZpbGVuYW1lKSksXG4gICAgICB0Lm9iamVjdFByb3BlcnR5KHQuaWRlbnRpZmllcignbGluZU51bWJlcicpLCB0Lm51bWVyaWNMaXRlcmFsKGxpbmVOdW1iZXIpKSxcbiAgICAgIHQub2JqZWN0UHJvcGVydHkodC5pZGVudGlmaWVyKCdjb2x1bW5OdW1iZXInKSwgdC5udW1lcmljTGl0ZXJhbChjb2x1bW5OdW1iZXIpKVxuICAgIF0pO1xuICAgIGNvbnN0IGFzc2lnbm1lbnQgPSB0LmV4cHJlc3Npb25TdGF0ZW1lbnQodC5hc3NpZ25tZW50RXhwcmVzc2lvbignPScsIGRlYnVnU291cmNlTWVtYmVyLCBkZWJ1Z1NvdXJjZURlZmluZSkpO1xuICAgIGNvbnN0IGNvbmRpdGlvbiA9IHQuYmluYXJ5RXhwcmVzc2lvbihcbiAgICAgICc9PT0nLFxuICAgICAgdC51bmFyeUV4cHJlc3Npb24oJ3R5cGVvZicsIHQuaWRlbnRpZmllcihuYW1lKSksXG4gICAgICB0LnN0cmluZ0xpdGVyYWwoJ2Z1bmN0aW9uJylcbiAgICApO1xuICAgIGNvbnN0IGlmRnVuY3Rpb24gPSB0LmlmU3RhdGVtZW50KGNvbmRpdGlvbiwgdC5ibG9ja1N0YXRlbWVudChbYXNzaWdubWVudF0pKTtcbiAgICBwYXRoLmluc2VydEFmdGVyKGlmRnVuY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB2aXNpdG9yOiB7XG4gICAgICBWYXJpYWJsZURlY2xhcmF0aW9uKHBhdGgsIHN0YXRlKSB7XG4gICAgICAgIC8vIEZpbmRzIGRlY2xhcmF0aW9ucyBzdWNoIGFzXG4gICAgICAgIC8vIGNvbnN0IEZvbyA9ICgpID0+IDxkaXYvPlxuICAgICAgICAvLyBleHBvcnQgY29uc3QgQmFyID0gKCkgPT4gPHNwYW4vPlxuXG4gICAgICAgIC8vIGFuZCB3cml0ZXMgYSBGb28uX19kZWJ1Z1NvdXJjZURlZmluZT0gey4ufSBhZnRlciBpdCwgcmVmZXJyaW5nIHRvIHRoZSBzdGFydCBvZiB0aGUgZnVuY3Rpb24gYm9keVxuICAgICAgICBwYXRoLm5vZGUuZGVjbGFyYXRpb25zLmZvckVhY2goKGRlY2xhcmF0aW9uKSA9PiB7XG4gICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLmlkLnR5cGUgIT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBuYW1lID0gZGVjbGFyYXRpb24/LmlkPy5uYW1lO1xuICAgICAgICAgIGlmICghaXNSZWFjdEZ1bmN0aW9uTmFtZShuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGZpbGVuYW1lID0gc3RhdGUuZmlsZS5vcHRzLmZpbGVuYW1lO1xuICAgICAgICAgIGlmIChkZWNsYXJhdGlvbj8uaW5pdD8uYm9keT8ubG9jKSB7XG4gICAgICAgICAgICBhZGREZWJ1Z0luZm8ocGF0aCwgbmFtZSwgZmlsZW5hbWUsIGRlY2xhcmF0aW9uLmluaXQuYm9keS5sb2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBGdW5jdGlvbkRlY2xhcmF0aW9uKHBhdGgsIHN0YXRlKSB7XG4gICAgICAgIC8vIEZpbmRzIGRlY2xhcmF0aW9ucyBzdWNoIGFzXG4gICAgICAgIC8vIGZ1bmN0aW8gRm9vKCkgeyByZXR1cm4gPGRpdi8+OyB9XG4gICAgICAgIC8vIGV4cG9ydCBmdW5jdGlvbiBCYXIoKSB7IHJldHVybiA8c3Bhbj5IZWxsbzwvc3Bhbj47fVxuXG4gICAgICAgIC8vIGFuZCB3cml0ZXMgYSBGb28uX19kZWJ1Z1NvdXJjZURlZmluZT0gey4ufSBhZnRlciBpdCwgcmVmZXJyaW5nIHRvIHRoZSBzdGFydCBvZiB0aGUgZnVuY3Rpb24gYm9keVxuICAgICAgICBjb25zdCBub2RlID0gcGF0aC5ub2RlO1xuICAgICAgICBjb25zdCBuYW1lID0gbm9kZT8uaWQ/Lm5hbWU7XG4gICAgICAgIGlmICghaXNSZWFjdEZ1bmN0aW9uTmFtZShuYW1lKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHN0YXRlLmZpbGUub3B0cy5maWxlbmFtZTtcbiAgICAgICAgaWYgKG5vZGUuYm9keS5sb2MpIHtcbiAgICAgICAgICBhZGREZWJ1Z0luZm8ocGF0aCwgbmFtZSwgZmlsZW5hbWUsIG5vZGUuYm9keS5sb2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuIiwgIntcbiAgXCJmcm9udGVuZEZvbGRlclwiOiBcIi9Vc2Vycy9taXJha2hyZWlzL3RlYW0xLmZyb250ZW5kMS8uL3NyYy9tYWluL2Zyb250ZW5kXCIsXG4gIFwidGhlbWVGb2xkZXJcIjogXCJ0aGVtZXNcIixcbiAgXCJ0aGVtZVJlc291cmNlRm9sZGVyXCI6IFwiL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxLy4vc3JjL21haW4vZnJvbnRlbmQvZ2VuZXJhdGVkL2phci1yZXNvdXJjZXNcIixcbiAgXCJzdGF0aWNPdXRwdXRcIjogXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L2NsYXNzZXMvTUVUQS1JTkYvVkFBRElOL3dlYmFwcC9WQUFESU4vc3RhdGljXCIsXG4gIFwiZ2VuZXJhdGVkRm9sZGVyXCI6IFwiZ2VuZXJhdGVkXCIsXG4gIFwic3RhdHNPdXRwdXRcIjogXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L2NsYXNzZXMvTUVUQS1JTkYvVkFBRElOL2NvbmZpZ1wiLFxuICBcImZyb250ZW5kQnVuZGxlT3V0cHV0XCI6IFwiL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxL3RhcmdldC9jbGFzc2VzL01FVEEtSU5GL1ZBQURJTi93ZWJhcHBcIixcbiAgXCJkZXZCdW5kbGVPdXRwdXRcIjogXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L2Rldi1idW5kbGUvd2ViYXBwXCIsXG4gIFwiZGV2QnVuZGxlU3RhdHNPdXRwdXRcIjogXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L2Rldi1idW5kbGUvY29uZmlnXCIsXG4gIFwiamFyUmVzb3VyY2VzRm9sZGVyXCI6IFwiL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxLy4vc3JjL21haW4vZnJvbnRlbmQvZ2VuZXJhdGVkL2phci1yZXNvdXJjZXNcIixcbiAgXCJ0aGVtZU5hbWVcIjogXCJteS1hcHBcIixcbiAgXCJjbGllbnRTZXJ2aWNlV29ya2VyU291cmNlXCI6IFwiL1VzZXJzL21pcmFraHJlaXMvdGVhbTEuZnJvbnRlbmQxL3RhcmdldC9zdy50c1wiLFxuICBcInB3YUVuYWJsZWRcIjogZmFsc2UsXG4gIFwib2ZmbGluZUVuYWJsZWRcIjogZmFsc2UsXG4gIFwib2ZmbGluZVBhdGhcIjogXCInb2ZmbGluZS5odG1sJ1wiXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L3BsdWdpbnMvcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC1jdXN0b21cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9taXJha2hyZWlzL3RlYW0xLmZyb250ZW5kMS90YXJnZXQvcGx1Z2lucy9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LWN1c3RvbS9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9taXJha2hyZWlzL3RlYW0xLmZyb250ZW5kMS90YXJnZXQvcGx1Z2lucy9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LWN1c3RvbS9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LmpzXCI7LyoqXG4gKiBNSVQgTGljZW5zZVxuXG5Db3B5cmlnaHQgKGMpIDIwMTkgVW1iZXJ0byBQZXBhdG9cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpbiBhbGxcbmNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEVcblNPRlRXQVJFLlxuICovXG4vLyBUaGlzIGlzIGh0dHBzOi8vZ2l0aHViLmNvbS91bWJvcGVwYXRvL3JvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQgMi4wLjAgKyBodHRwczovL2dpdGh1Yi5jb20vdW1ib3BlcGF0by9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0L3B1bGwvNTRcbi8vIHRvIG1ha2UgaXQgd29yayB3aXRoIFZpdGUgM1xuLy8gT25jZSAvIGlmIGh0dHBzOi8vZ2l0aHViLmNvbS91bWJvcGVwYXRvL3JvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQvcHVsbC81NCBpcyBtZXJnZWQgdGhpcyBzaG91bGQgYmUgcmVtb3ZlZCBhbmQgcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdCBzaG91bGQgYmUgdXNlZCBpbnN0ZWFkXG5cbmltcG9ydCB7IGNyZWF0ZUZpbHRlciB9IGZyb20gJ0Byb2xsdXAvcGx1Z2ludXRpbHMnO1xuaW1wb3J0IHRyYW5zZm9ybUFzdCBmcm9tICd0cmFuc2Zvcm0tYXN0JztcblxuY29uc3QgYXNzZXRVcmxSRSA9IC9fX1ZJVEVfQVNTRVRfXyhbXFx3JF0rKV9fKD86XFwkXyguKj8pX18pPy9nXG5cbmNvbnN0IGVzY2FwZSA9IChzdHIpID0+XG4gIHN0clxuICAgIC5yZXBsYWNlKGFzc2V0VXJsUkUsICcke3Vuc2FmZUNTU1RhZyhcIl9fVklURV9BU1NFVF9fJDFfXyQyXCIpfScpXG4gICAgLnJlcGxhY2UoL2AvZywgJ1xcXFxgJylcbiAgICAucmVwbGFjZSgvXFxcXCg/IWApL2csICdcXFxcXFxcXCcpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBwb3N0Y3NzTGl0KG9wdGlvbnMgPSB7fSkge1xuICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBpbmNsdWRlOiAnKiovKi57Y3NzLHNzcyxwY3NzLHN0eWwsc3R5bHVzLHNhc3Msc2NzcyxsZXNzfScsXG4gICAgZXhjbHVkZTogbnVsbCxcbiAgICBpbXBvcnRQYWNrYWdlOiAnbGl0J1xuICB9O1xuXG4gIGNvbnN0IG9wdHMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG4gIGNvbnN0IGZpbHRlciA9IGNyZWF0ZUZpbHRlcihvcHRzLmluY2x1ZGUsIG9wdHMuZXhjbHVkZSk7XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAncG9zdGNzcy1saXQnLFxuICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgIGlmICghZmlsdGVyKGlkKSkgcmV0dXJuO1xuICAgICAgY29uc3QgYXN0ID0gdGhpcy5wYXJzZShjb2RlLCB7fSk7XG4gICAgICAvLyBleHBvcnQgZGVmYXVsdCBjb25zdCBjc3M7XG4gICAgICBsZXQgZGVmYXVsdEV4cG9ydE5hbWU7XG5cbiAgICAgIC8vIGV4cG9ydCBkZWZhdWx0ICcuLi4nO1xuICAgICAgbGV0IGlzRGVjbGFyYXRpb25MaXRlcmFsID0gZmFsc2U7XG4gICAgICBjb25zdCBtYWdpY1N0cmluZyA9IHRyYW5zZm9ybUFzdChjb2RlLCB7IGFzdDogYXN0IH0sIChub2RlKSA9PiB7XG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgZGVmYXVsdEV4cG9ydE5hbWUgPSBub2RlLmRlY2xhcmF0aW9uLm5hbWU7XG5cbiAgICAgICAgICBpc0RlY2xhcmF0aW9uTGl0ZXJhbCA9IG5vZGUuZGVjbGFyYXRpb24udHlwZSA9PT0gJ0xpdGVyYWwnO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKCFkZWZhdWx0RXhwb3J0TmFtZSAmJiAhaXNEZWNsYXJhdGlvbkxpdGVyYWwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbWFnaWNTdHJpbmcud2Fsaygobm9kZSkgPT4ge1xuICAgICAgICBpZiAoZGVmYXVsdEV4cG9ydE5hbWUgJiYgbm9kZS50eXBlID09PSAnVmFyaWFibGVEZWNsYXJhdGlvbicpIHtcbiAgICAgICAgICBjb25zdCBleHBvcnRlZFZhciA9IG5vZGUuZGVjbGFyYXRpb25zLmZpbmQoKGQpID0+IGQuaWQubmFtZSA9PT0gZGVmYXVsdEV4cG9ydE5hbWUpO1xuICAgICAgICAgIGlmIChleHBvcnRlZFZhcikge1xuICAgICAgICAgICAgZXhwb3J0ZWRWYXIuaW5pdC5lZGl0LnVwZGF0ZShgY3NzVGFnXFxgJHtlc2NhcGUoZXhwb3J0ZWRWYXIuaW5pdC52YWx1ZSl9XFxgYCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzRGVjbGFyYXRpb25MaXRlcmFsICYmIG5vZGUudHlwZSA9PT0gJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbicpIHtcbiAgICAgICAgICBub2RlLmRlY2xhcmF0aW9uLmVkaXQudXBkYXRlKGBjc3NUYWdcXGAke2VzY2FwZShub2RlLmRlY2xhcmF0aW9uLnZhbHVlKX1cXGBgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBtYWdpY1N0cmluZy5wcmVwZW5kKGBpbXBvcnQge2NzcyBhcyBjc3NUYWcsIHVuc2FmZUNTUyBhcyB1bnNhZmVDU1NUYWd9IGZyb20gJyR7b3B0cy5pbXBvcnRQYWNrYWdlfSc7XFxuYCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBjb2RlOiBtYWdpY1N0cmluZy50b1N0cmluZygpLFxuICAgICAgICBtYXA6IG1hZ2ljU3RyaW5nLmdlbmVyYXRlTWFwKHtcbiAgICAgICAgICBoaXJlczogdHJ1ZVxuICAgICAgICB9KVxuICAgICAgfTtcbiAgICB9XG4gIH07XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9taXJha2hyZWlzL3RlYW0xLmZyb250ZW5kMS92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbWlyYWtocmVpcy90ZWFtMS5mcm9udGVuZDEvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBVc2VyQ29uZmlnRm4gfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IG92ZXJyaWRlVmFhZGluQ29uZmlnIH0gZnJvbSAnLi92aXRlLmdlbmVyYXRlZCc7XG5cbmNvbnN0IGN1c3RvbUNvbmZpZzogVXNlckNvbmZpZ0ZuID0gKGVudikgPT4gKHtcbiAgLy8gSGVyZSB5b3UgY2FuIGFkZCBjdXN0b20gVml0ZSBwYXJhbWV0ZXJzXG4gIC8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG59KTtcblxuZXhwb3J0IGRlZmF1bHQgb3ZlcnJpZGVWYWFkaW5Db25maWcoY3VzdG9tQ29uZmlnKTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFNQSxPQUFPLFVBQVU7QUFDakIsU0FBUyxjQUFBQSxhQUFZLGFBQUFDLFlBQVcsZUFBQUMsY0FBYSxnQkFBQUMsZUFBYyxpQkFBQUMsc0JBQTRCO0FBQ3ZGLFNBQVMsa0JBQWtCO0FBQzNCLFlBQVksU0FBUzs7O0FDV3JCLFNBQVMsY0FBQUMsYUFBWSxnQkFBQUMscUJBQW9CO0FBQ3pDLFNBQVMsV0FBQUMsZ0JBQWU7OztBQ0R4QixTQUFTLFlBQUFDLGlCQUFnQjtBQUN6QixTQUFTLFdBQUFDLFVBQVMsWUFBQUMsaUJBQWdCO0FBQ2xDLFNBQVMsY0FBQUMs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ICAibmFtZXMiOiBbImV4aXN0c1N5bmMiLCAibWtkaXJTeW5jIiwgInJlYWRkaXJTeW5jIiwgInJlYWRGaWxlU3luYyIsICJ3cml0ZUZpbGVTeW5jIiwgImV4aXN0c1N5bmMiLCAicmVhZEZpbGVTeW5jIiwgInJlc29sdmUiLCAiZ2xvYlN5bmMiLCAicmVzb2x2ZSIsICJiYXNlbmFtZSIsICJleGlzdHNTeW5jIiwgInRoZW1lRm9sZGVyIiwgInRoZW1lRm9sZGVyIiwgInJlc29sdmUiLCAiZ2xvYlN5bmMiLCAiZXhpc3RzU3luYyIsICJiYXNlbmFtZSIsICJ2YXJpYWJsZSIsICJmaWxlbmFtZSIsICJleGlzdHNTeW5jIiwgInJlc29sdmUiLCAidGhlbWVGb2xkZXIiLCAicmVhZEZpbGVTeW5jIiwgImV4aXN0c1N5bmMiLCAicmVhZEZpbGVTeW5jIiwgInJlc29sdmUiLCAiYmFzZW5hbWUiLCAiZ2xvYlN5bmMiLCAidGhlbWVGb2xkZXIiLCAiZ2V0VGhlbWVQcm9wZXJ0aWVzIiwgImdsb2JTeW5jIiwgInJlc29sdmUiLCAiZXhpc3RzU3luYyIsICJyZWFkRmlsZVN5bmMiLCAicmVwbGFjZSIsICJiYXNlbmFtZSIsICJwYXRoIiwgInJlcXVpcmUiLCAiZXhpc3RzU3luYyIsICJyZWFkRmlsZVN5bmMiLCAibWtkaXJTeW5jIiwgImJ1bmRsZSIsICJyZWFkZGlyU3luYyIsICJ0aGVtZUZvbGRlciIsICJ3cml0ZUZpbGVTeW5jIiwgImUiLCAicGF0aCIsICJjdXN0b21Db25maWciXQp9Cg==
