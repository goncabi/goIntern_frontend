// vite.generated.ts
import path from "path";
import { existsSync as existsSync5, mkdirSync as mkdirSync2, readdirSync as readdirSync2, readFileSync as readFileSync4, writeFileSync as writeFileSync2 } from "fs";
import { createHash } from "crypto";
import * as net from "net";

// target/plugins/application-theme-plugin/theme-handle.js
import { existsSync as existsSync3, readFileSync as readFileSync2 } from "fs";
import { resolve as resolve3 } from "path";

// target/plugins/application-theme-plugin/theme-generator.js
import { globSync as globSync2 } from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/glob/dist/esm/index.js";
import { resolve as resolve2, basename as basename2 } from "path";
import { existsSync as existsSync2, readFileSync, writeFileSync } from "fs";

// target/plugins/application-theme-plugin/theme-copy.js
import { readdirSync, statSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { resolve, basename, relative, extname } from "path";
import { globSync } from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/glob/dist/esm/index.js";
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
import { globSync as globSync3 } from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/glob/dist/esm/index.js";
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
import * as t from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/@babel/types/lib/index.js";
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
  frontendFolder: "C:/Users/merli/Projekt3Semester/team1.frontend1/./src/main/frontend",
  themeFolder: "themes",
  themeResourceFolder: "C:/Users/merli/Projekt3Semester/team1.frontend1/./src/main/frontend/generated/jar-resources",
  staticOutput: "C:/Users/merli/Projekt3Semester/team1.frontend1/target/classes/META-INF/VAADIN/webapp/VAADIN/static",
  generatedFolder: "generated",
  statsOutput: "C:\\Users\\merli\\Projekt3Semester\\team1.frontend1\\target\\classes\\META-INF\\VAADIN\\config",
  frontendBundleOutput: "C:\\Users\\merli\\Projekt3Semester\\team1.frontend1\\target\\classes\\META-INF\\VAADIN\\webapp",
  devBundleOutput: "C:/Users/merli/Projekt3Semester/team1.frontend1/target/dev-bundle/webapp",
  devBundleStatsOutput: "C:/Users/merli/Projekt3Semester/team1.frontend1/target/dev-bundle/config",
  jarResourcesFolder: "C:/Users/merli/Projekt3Semester/team1.frontend1/./src/main/frontend/generated/jar-resources",
  themeName: "my-app",
  clientServiceWorkerSource: "C:\\Users\\merli\\Projekt3Semester\\team1.frontend1\\target\\sw.ts",
  pwaEnabled: false,
  offlineEnabled: false,
  offlinePath: "'offline.html'"
};

// vite.generated.ts
import {
  defineConfig,
  mergeConfig
} from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/vite/dist/node/index.js";
import { getManifest } from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/workbox-build/build/index.js";
import * as rollup from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/rollup/dist/es/rollup.js";
import brotli from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/rollup-plugin-brotli/lib/index.cjs.js";
import replace from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/@rollup/plugin-replace/dist/es/index.js";
import checker from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/vite-plugin-checker/dist/esm/main.js";

// target/plugins/rollup-plugin-postcss-lit-custom/rollup-plugin-postcss-lit.js
import { createFilter } from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/@rollup/pluginutils/dist/es/index.js";
import transformAst from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/transform-ast/index.js";
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
import { visualizer } from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import reactPlugin from "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\merli\\Projekt3Semester\\team1.frontend1";
var __vite_injected_original_import_meta_url = "file:///C:/Users/merli/Projekt3Semester/team1.frontend1/vite.generated.ts";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5nZW5lcmF0ZWQudHMiLCAidGFyZ2V0L3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luL3RoZW1lLWhhbmRsZS5qcyIsICJ0YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtZ2VuZXJhdG9yLmpzIiwgInRhcmdldC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpbi90aGVtZS1jb3B5LmpzIiwgInRhcmdldC9wbHVnaW5zL3RoZW1lLWxvYWRlci90aGVtZS1sb2FkZXItdXRpbHMuanMiLCAidGFyZ2V0L3BsdWdpbnMvcmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi5qcyIsICJ0YXJnZXQvdmFhZGluLWRldi1zZXJ2ZXItc2V0dGluZ3MuanNvbiIsICJ0YXJnZXQvcGx1Z2lucy9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LWN1c3RvbS9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LmpzIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbWVybGlcXFxcUHJvamVrdDNTZW1lc3RlclxcXFx0ZWFtMS5mcm9udGVuZDFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG1lcmxpXFxcXFByb2pla3QzU2VtZXN0ZXJcXFxcdGVhbTEuZnJvbnRlbmQxXFxcXHZpdGUuZ2VuZXJhdGVkLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9tZXJsaS9Qcm9qZWt0M1NlbWVzdGVyL3RlYW0xLmZyb250ZW5kMS92aXRlLmdlbmVyYXRlZC50c1wiOy8qKlxuICogTk9USUNFOiB0aGlzIGlzIGFuIGF1dG8tZ2VuZXJhdGVkIGZpbGVcbiAqXG4gKiBUaGlzIGZpbGUgaGFzIGJlZW4gZ2VuZXJhdGVkIGJ5IHRoZSBgZmxvdzpwcmVwYXJlLWZyb250ZW5kYCBtYXZlbiBnb2FsLlxuICogVGhpcyBmaWxlIHdpbGwgYmUgb3ZlcndyaXR0ZW4gb24gZXZlcnkgcnVuLiBBbnkgY3VzdG9tIGNoYW5nZXMgc2hvdWxkIGJlIG1hZGUgdG8gdml0ZS5jb25maWcudHNcbiAqL1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBleGlzdHNTeW5jLCBta2RpclN5bmMsIHJlYWRkaXJTeW5jLCByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmMsIFN0YXRzIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgY3JlYXRlSGFzaCB9IGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgKiBhcyBuZXQgZnJvbSAnbmV0JztcblxuaW1wb3J0IHsgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzIH0gZnJvbSAnLi90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtaGFuZGxlLmpzJztcbmltcG9ydCB7IHJld3JpdGVDc3NVcmxzIH0gZnJvbSAnLi90YXJnZXQvcGx1Z2lucy90aGVtZS1sb2FkZXIvdGhlbWUtbG9hZGVyLXV0aWxzLmpzJztcbmltcG9ydCB7IGFkZEZ1bmN0aW9uQ29tcG9uZW50U291cmNlTG9jYXRpb25CYWJlbCB9IGZyb20gJy4vdGFyZ2V0L3BsdWdpbnMvcmVhY3QtZnVuY3Rpb24tbG9jYXRpb24tcGx1Z2luL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi5qcyc7XG5pbXBvcnQgc2V0dGluZ3MgZnJvbSAnLi90YXJnZXQvdmFhZGluLWRldi1zZXJ2ZXItc2V0dGluZ3MuanNvbic7XG5pbXBvcnQge1xuICBBc3NldEluZm8sXG4gIENodW5rSW5mbyxcbiAgZGVmaW5lQ29uZmlnLFxuICBtZXJnZUNvbmZpZyxcbiAgT3V0cHV0T3B0aW9ucyxcbiAgUGx1Z2luT3B0aW9uLFxuICBSZXNvbHZlZENvbmZpZyxcbiAgVXNlckNvbmZpZ0ZuXG59IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgZ2V0TWFuaWZlc3QsIHR5cGUgTWFuaWZlc3RUcmFuc2Zvcm0gfSBmcm9tICd3b3JrYm94LWJ1aWxkJztcblxuaW1wb3J0ICogYXMgcm9sbHVwIGZyb20gJ3JvbGx1cCc7XG5pbXBvcnQgYnJvdGxpIGZyb20gJ3JvbGx1cC1wbHVnaW4tYnJvdGxpJztcbmltcG9ydCByZXBsYWNlIGZyb20gJ0Byb2xsdXAvcGx1Z2luLXJlcGxhY2UnO1xuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XG5pbXBvcnQgcG9zdGNzc0xpdCBmcm9tICcuL3RhcmdldC9wbHVnaW5zL3JvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQtY3VzdG9tL3JvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQuanMnO1xuXG5pbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJztcblxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XG5pbXBvcnQgcmVhY3RQbHVnaW4gZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG5cblxuLy8gTWFrZSBgcmVxdWlyZWAgY29tcGF0aWJsZSB3aXRoIEVTIG1vZHVsZXNcbmNvbnN0IHJlcXVpcmUgPSBjcmVhdGVSZXF1aXJlKGltcG9ydC5tZXRhLnVybCk7XG5cbmNvbnN0IGFwcFNoZWxsVXJsID0gJy4nO1xuXG5jb25zdCBmcm9udGVuZEZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLmZyb250ZW5kRm9sZGVyKTtcbmNvbnN0IHRoZW1lRm9sZGVyID0gcGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCBzZXR0aW5ncy50aGVtZUZvbGRlcik7XG5jb25zdCBmcm9udGVuZEJ1bmRsZUZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLmZyb250ZW5kQnVuZGxlT3V0cHV0KTtcbmNvbnN0IGRldkJ1bmRsZUZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLmRldkJ1bmRsZU91dHB1dCk7XG5jb25zdCBkZXZCdW5kbGUgPSAhIXByb2Nlc3MuZW52LmRldkJ1bmRsZTtcbmNvbnN0IGphclJlc291cmNlc0ZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLmphclJlc291cmNlc0ZvbGRlcik7XG5jb25zdCB0aGVtZVJlc291cmNlRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MudGhlbWVSZXNvdXJjZUZvbGRlcik7XG5jb25zdCBwcm9qZWN0UGFja2FnZUpzb25GaWxlID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3BhY2thZ2UuanNvbicpO1xuXG5jb25zdCBidWlsZE91dHB1dEZvbGRlciA9IGRldkJ1bmRsZSA/IGRldkJ1bmRsZUZvbGRlciA6IGZyb250ZW5kQnVuZGxlRm9sZGVyO1xuY29uc3Qgc3RhdHNGb2xkZXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBkZXZCdW5kbGUgPyBzZXR0aW5ncy5kZXZCdW5kbGVTdGF0c091dHB1dCA6IHNldHRpbmdzLnN0YXRzT3V0cHV0KTtcbmNvbnN0IHN0YXRzRmlsZSA9IHBhdGgucmVzb2x2ZShzdGF0c0ZvbGRlciwgJ3N0YXRzLmpzb24nKTtcbmNvbnN0IGJ1bmRsZVNpemVGaWxlID0gcGF0aC5yZXNvbHZlKHN0YXRzRm9sZGVyLCAnYnVuZGxlLXNpemUuaHRtbCcpO1xuY29uc3Qgbm9kZU1vZHVsZXNGb2xkZXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzJyk7XG5jb25zdCB3ZWJDb21wb25lbnRUYWdzID0gJyc7XG5cbmNvbnN0IHByb2plY3RJbmRleEh0bWwgPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsICdpbmRleC5odG1sJyk7XG5cbmNvbnN0IHByb2plY3RTdGF0aWNBc3NldHNGb2xkZXJzID0gW1xuICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJywgJ21haW4nLCAncmVzb3VyY2VzJywgJ01FVEEtSU5GJywgJ3Jlc291cmNlcycpLFxuICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJywgJ21haW4nLCAncmVzb3VyY2VzJywgJ3N0YXRpYycpLFxuICBmcm9udGVuZEZvbGRlclxuXTtcblxuLy8gRm9sZGVycyBpbiB0aGUgcHJvamVjdCB3aGljaCBjYW4gY29udGFpbiBhcHBsaWNhdGlvbiB0aGVtZXNcbmNvbnN0IHRoZW1lUHJvamVjdEZvbGRlcnMgPSBwcm9qZWN0U3RhdGljQXNzZXRzRm9sZGVycy5tYXAoKGZvbGRlcikgPT4gcGF0aC5yZXNvbHZlKGZvbGRlciwgc2V0dGluZ3MudGhlbWVGb2xkZXIpKTtcblxuY29uc3QgdGhlbWVPcHRpb25zID0ge1xuICBkZXZNb2RlOiBmYWxzZSxcbiAgdXNlRGV2QnVuZGxlOiBkZXZCdW5kbGUsXG4gIC8vIFRoZSBmb2xsb3dpbmcgbWF0Y2hlcyBmb2xkZXIgJ2Zyb250ZW5kL2dlbmVyYXRlZC90aGVtZXMvJ1xuICAvLyAobm90ICdmcm9udGVuZC90aGVtZXMnKSBmb3IgdGhlbWUgaW4gSkFSIHRoYXQgaXMgY29waWVkIHRoZXJlXG4gIHRoZW1lUmVzb3VyY2VGb2xkZXI6IHBhdGgucmVzb2x2ZSh0aGVtZVJlc291cmNlRm9sZGVyLCBzZXR0aW5ncy50aGVtZUZvbGRlciksXG4gIHRoZW1lUHJvamVjdEZvbGRlcnM6IHRoZW1lUHJvamVjdEZvbGRlcnMsXG4gIHByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXI6IGRldkJ1bmRsZVxuICAgID8gcGF0aC5yZXNvbHZlKGRldkJ1bmRsZUZvbGRlciwgJy4uL2Fzc2V0cycpXG4gICAgOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBzZXR0aW5ncy5zdGF0aWNPdXRwdXQpLFxuICBmcm9udGVuZEdlbmVyYXRlZEZvbGRlcjogcGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCBzZXR0aW5ncy5nZW5lcmF0ZWRGb2xkZXIpXG59O1xuXG5jb25zdCBoYXNFeHBvcnRlZFdlYkNvbXBvbmVudHMgPSBleGlzdHNTeW5jKHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ3dlYi1jb21wb25lbnQuaHRtbCcpKTtcblxuLy8gQmxvY2sgZGVidWcgYW5kIHRyYWNlIGxvZ3MuXG5jb25zb2xlLnRyYWNlID0gKCkgPT4ge307XG5jb25zb2xlLmRlYnVnID0gKCkgPT4ge307XG5cbmZ1bmN0aW9uIGluamVjdE1hbmlmZXN0VG9TV1BsdWdpbigpOiByb2xsdXAuUGx1Z2luIHtcbiAgY29uc3QgcmV3cml0ZU1hbmlmZXN0SW5kZXhIdG1sVXJsOiBNYW5pZmVzdFRyYW5zZm9ybSA9IChtYW5pZmVzdCkgPT4ge1xuICAgIGNvbnN0IGluZGV4RW50cnkgPSBtYW5pZmVzdC5maW5kKChlbnRyeSkgPT4gZW50cnkudXJsID09PSAnaW5kZXguaHRtbCcpO1xuICAgIGlmIChpbmRleEVudHJ5KSB7XG4gICAgICBpbmRleEVudHJ5LnVybCA9IGFwcFNoZWxsVXJsO1xuICAgIH1cblxuICAgIHJldHVybiB7IG1hbmlmZXN0LCB3YXJuaW5nczogW10gfTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2YWFkaW46aW5qZWN0LW1hbmlmZXN0LXRvLXN3JyxcbiAgICBhc3luYyB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgIGlmICgvc3dcXC4odHN8anMpJC8udGVzdChpZCkpIHtcbiAgICAgICAgY29uc3QgeyBtYW5pZmVzdEVudHJpZXMgfSA9IGF3YWl0IGdldE1hbmlmZXN0KHtcbiAgICAgICAgICBnbG9iRGlyZWN0b3J5OiBidWlsZE91dHB1dEZvbGRlcixcbiAgICAgICAgICBnbG9iUGF0dGVybnM6IFsnKiovKiddLFxuICAgICAgICAgIGdsb2JJZ25vcmVzOiBbJyoqLyouYnInXSxcbiAgICAgICAgICBtYW5pZmVzdFRyYW5zZm9ybXM6IFtyZXdyaXRlTWFuaWZlc3RJbmRleEh0bWxVcmxdLFxuICAgICAgICAgIG1heGltdW1GaWxlU2l6ZVRvQ2FjaGVJbkJ5dGVzOiAxMDAgKiAxMDI0ICogMTAyNCAvLyAxMDBtYixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZSgnc2VsZi5fX1dCX01BTklGRVNUJywgSlNPTi5zdHJpbmdpZnkobWFuaWZlc3RFbnRyaWVzKSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBidWlsZFNXUGx1Z2luKG9wdHM6IHsgZGV2TW9kZTogYm9vbGVhbiB9KTogUGx1Z2luT3B0aW9uIHtcbiAgbGV0IGNvbmZpZzogUmVzb2x2ZWRDb25maWc7XG4gIGNvbnN0IGRldk1vZGUgPSBvcHRzLmRldk1vZGU7XG5cbiAgY29uc3Qgc3dPYmo6IHsgY29kZT86IHN0cmluZywgbWFwPzogcm9sbHVwLlNvdXJjZU1hcCB8IG51bGwgfSA9IHt9O1xuXG4gIGFzeW5jIGZ1bmN0aW9uIGJ1aWxkKGFjdGlvbjogJ2dlbmVyYXRlJyB8ICd3cml0ZScsIGFkZGl0aW9uYWxQbHVnaW5zOiByb2xsdXAuUGx1Z2luW10gPSBbXSkge1xuICAgIGNvbnN0IGluY2x1ZGVkUGx1Z2luTmFtZXMgPSBbXG4gICAgICAndml0ZTplc2J1aWxkJyxcbiAgICAgICdyb2xsdXAtcGx1Z2luLWR5bmFtaWMtaW1wb3J0LXZhcmlhYmxlcycsXG4gICAgICAndml0ZTplc2J1aWxkLXRyYW5zcGlsZScsXG4gICAgICAndml0ZTp0ZXJzZXInXG4gICAgXTtcbiAgICBjb25zdCBwbHVnaW5zOiByb2xsdXAuUGx1Z2luW10gPSBjb25maWcucGx1Z2lucy5maWx0ZXIoKHApID0+IHtcbiAgICAgIHJldHVybiBpbmNsdWRlZFBsdWdpbk5hbWVzLmluY2x1ZGVzKHAubmFtZSk7XG4gICAgfSk7XG4gICAgY29uc3QgcmVzb2x2ZXIgPSBjb25maWcuY3JlYXRlUmVzb2x2ZXIoKTtcbiAgICBjb25zdCByZXNvbHZlUGx1Z2luOiByb2xsdXAuUGx1Z2luID0ge1xuICAgICAgbmFtZTogJ3Jlc29sdmVyJyxcbiAgICAgIHJlc29sdmVJZChzb3VyY2UsIGltcG9ydGVyLCBfb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZXIoc291cmNlLCBpbXBvcnRlcik7XG4gICAgICB9XG4gICAgfTtcbiAgICBwbHVnaW5zLnVuc2hpZnQocmVzb2x2ZVBsdWdpbik7IC8vIFB1dCByZXNvbHZlIGZpcnN0XG4gICAgcGx1Z2lucy5wdXNoKFxuICAgICAgcmVwbGFjZSh7XG4gICAgICAgIHZhbHVlczoge1xuICAgICAgICAgICdwcm9jZXNzLmVudi5OT0RFX0VOVic6IEpTT04uc3RyaW5naWZ5KGNvbmZpZy5tb2RlKSxcbiAgICAgICAgICAuLi5jb25maWcuZGVmaW5lXG4gICAgICAgIH0sXG4gICAgICAgIHByZXZlbnRBc3NpZ25tZW50OiB0cnVlXG4gICAgICB9KVxuICAgICk7XG4gICAgaWYgKGFkZGl0aW9uYWxQbHVnaW5zKSB7XG4gICAgICBwbHVnaW5zLnB1c2goLi4uYWRkaXRpb25hbFBsdWdpbnMpO1xuICAgIH1cbiAgICBjb25zdCBidW5kbGUgPSBhd2FpdCByb2xsdXAucm9sbHVwKHtcbiAgICAgIGlucHV0OiBwYXRoLnJlc29sdmUoc2V0dGluZ3MuY2xpZW50U2VydmljZVdvcmtlclNvdXJjZSksXG4gICAgICBwbHVnaW5zXG4gICAgfSk7XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IGJ1bmRsZVthY3Rpb25dKHtcbiAgICAgICAgZmlsZTogcGF0aC5yZXNvbHZlKGJ1aWxkT3V0cHV0Rm9sZGVyLCAnc3cuanMnKSxcbiAgICAgICAgZm9ybWF0OiAnZXMnLFxuICAgICAgICBleHBvcnRzOiAnbm9uZScsXG4gICAgICAgIHNvdXJjZW1hcDogY29uZmlnLmNvbW1hbmQgPT09ICdzZXJ2ZScgfHwgY29uZmlnLmJ1aWxkLnNvdXJjZW1hcCxcbiAgICAgICAgaW5saW5lRHluYW1pY0ltcG9ydHM6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBhd2FpdCBidW5kbGUuY2xvc2UoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2YWFkaW46YnVpbGQtc3cnLFxuICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICBhc3luYyBjb25maWdSZXNvbHZlZChyZXNvbHZlZENvbmZpZykge1xuICAgICAgY29uZmlnID0gcmVzb2x2ZWRDb25maWc7XG4gICAgfSxcbiAgICBhc3luYyBidWlsZFN0YXJ0KCkge1xuICAgICAgaWYgKGRldk1vZGUpIHtcbiAgICAgICAgY29uc3QgeyBvdXRwdXQgfSA9IGF3YWl0IGJ1aWxkKCdnZW5lcmF0ZScpO1xuICAgICAgICBzd09iai5jb2RlID0gb3V0cHV0WzBdLmNvZGU7XG4gICAgICAgIHN3T2JqLm1hcCA9IG91dHB1dFswXS5tYXA7XG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyBsb2FkKGlkKSB7XG4gICAgICBpZiAoaWQuZW5kc1dpdGgoJ3N3LmpzJykpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgdHJhbnNmb3JtKF9jb2RlLCBpZCkge1xuICAgICAgaWYgKGlkLmVuZHNXaXRoKCdzdy5qcycpKSB7XG4gICAgICAgIHJldHVybiBzd09iajtcbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jIGNsb3NlQnVuZGxlKCkge1xuICAgICAgaWYgKCFkZXZNb2RlKSB7XG4gICAgICAgIGF3YWl0IGJ1aWxkKCd3cml0ZScsIFtpbmplY3RNYW5pZmVzdFRvU1dQbHVnaW4oKSwgYnJvdGxpKCldKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHN0YXRzRXh0cmFjdGVyUGx1Z2luKCk6IFBsdWdpbk9wdGlvbiB7XG4gIGZ1bmN0aW9uIGNvbGxlY3RUaGVtZUpzb25zSW5Gcm9udGVuZCh0aGVtZUpzb25Db250ZW50czogUmVjb3JkPHN0cmluZywgc3RyaW5nPiwgdGhlbWVOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCB0aGVtZUpzb24gPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIHNldHRpbmdzLnRoZW1lRm9sZGVyLCB0aGVtZU5hbWUsICd0aGVtZS5qc29uJyk7XG4gICAgaWYgKGV4aXN0c1N5bmModGhlbWVKc29uKSkge1xuICAgICAgY29uc3QgdGhlbWVKc29uQ29udGVudCA9IHJlYWRGaWxlU3luYyh0aGVtZUpzb24sIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgICAgIHRoZW1lSnNvbkNvbnRlbnRzW3RoZW1lTmFtZV0gPSB0aGVtZUpzb25Db250ZW50O1xuICAgICAgY29uc3QgdGhlbWVKc29uT2JqZWN0ID0gSlNPTi5wYXJzZSh0aGVtZUpzb25Db250ZW50KTtcbiAgICAgIGlmICh0aGVtZUpzb25PYmplY3QucGFyZW50KSB7XG4gICAgICAgIGNvbGxlY3RUaGVtZUpzb25zSW5Gcm9udGVuZCh0aGVtZUpzb25Db250ZW50cywgdGhlbWVKc29uT2JqZWN0LnBhcmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOnN0YXRzJyxcbiAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgYXN5bmMgd3JpdGVCdW5kbGUob3B0aW9uczogT3V0cHV0T3B0aW9ucywgYnVuZGxlOiB7IFtmaWxlTmFtZTogc3RyaW5nXTogQXNzZXRJbmZvIHwgQ2h1bmtJbmZvIH0pIHtcbiAgICAgIGNvbnN0IG1vZHVsZXMgPSBPYmplY3QudmFsdWVzKGJ1bmRsZSkuZmxhdE1hcCgoYikgPT4gKGIubW9kdWxlcyA/IE9iamVjdC5rZXlzKGIubW9kdWxlcykgOiBbXSkpO1xuICAgICAgY29uc3Qgbm9kZU1vZHVsZXNGb2xkZXJzID0gbW9kdWxlc1xuICAgICAgICAubWFwKChpZCkgPT4gaWQucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAuZmlsdGVyKChpZCkgPT4gaWQuc3RhcnRzV2l0aChub2RlTW9kdWxlc0ZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJykpKVxuICAgICAgICAubWFwKChpZCkgPT4gaWQuc3Vic3RyaW5nKG5vZGVNb2R1bGVzRm9sZGVyLmxlbmd0aCArIDEpKTtcbiAgICAgIGNvbnN0IG5wbU1vZHVsZXMgPSBub2RlTW9kdWxlc0ZvbGRlcnNcbiAgICAgICAgLm1hcCgoaWQpID0+IGlkLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgLm1hcCgoaWQpID0+IHtcbiAgICAgICAgICBjb25zdCBwYXJ0cyA9IGlkLnNwbGl0KCcvJyk7XG4gICAgICAgICAgaWYgKGlkLnN0YXJ0c1dpdGgoJ0AnKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnRzWzBdICsgJy8nICsgcGFydHNbMV07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJ0c1swXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIC5zb3J0KClcbiAgICAgICAgLmZpbHRlcigodmFsdWUsIGluZGV4LCBzZWxmKSA9PiBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpbmRleCk7XG4gICAgICBjb25zdCBucG1Nb2R1bGVBbmRWZXJzaW9uID0gT2JqZWN0LmZyb21FbnRyaWVzKG5wbU1vZHVsZXMubWFwKChtb2R1bGUpID0+IFttb2R1bGUsIGdldFZlcnNpb24obW9kdWxlKV0pKTtcbiAgICAgIGNvbnN0IGN2ZGxzID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICBucG1Nb2R1bGVzXG4gICAgICAgICAgLmZpbHRlcigobW9kdWxlKSA9PiBnZXRDdmRsTmFtZShtb2R1bGUpICE9IG51bGwpXG4gICAgICAgICAgLm1hcCgobW9kdWxlKSA9PiBbbW9kdWxlLCB7IG5hbWU6IGdldEN2ZGxOYW1lKG1vZHVsZSksIHZlcnNpb246IGdldFZlcnNpb24obW9kdWxlKSB9XSlcbiAgICAgICk7XG5cbiAgICAgIG1rZGlyU3luYyhwYXRoLmRpcm5hbWUoc3RhdHNGaWxlKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgICBjb25zdCBwcm9qZWN0UGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyhwcm9qZWN0UGFja2FnZUpzb25GaWxlLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKTtcblxuICAgICAgY29uc3QgZW50cnlTY3JpcHRzID0gT2JqZWN0LnZhbHVlcyhidW5kbGUpXG4gICAgICAgIC5maWx0ZXIoKGJ1bmRsZSkgPT4gYnVuZGxlLmlzRW50cnkpXG4gICAgICAgIC5tYXAoKGJ1bmRsZSkgPT4gYnVuZGxlLmZpbGVOYW1lKTtcblxuICAgICAgY29uc3QgZ2VuZXJhdGVkSW5kZXhIdG1sID0gcGF0aC5yZXNvbHZlKGJ1aWxkT3V0cHV0Rm9sZGVyLCAnaW5kZXguaHRtbCcpO1xuICAgICAgY29uc3QgY3VzdG9tSW5kZXhEYXRhOiBzdHJpbmcgPSByZWFkRmlsZVN5bmMocHJvamVjdEluZGV4SHRtbCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZEluZGV4RGF0YTogc3RyaW5nID0gcmVhZEZpbGVTeW5jKGdlbmVyYXRlZEluZGV4SHRtbCwge1xuICAgICAgICBlbmNvZGluZzogJ3V0Zi04J1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGN1c3RvbUluZGV4Um93cyA9IG5ldyBTZXQoY3VzdG9tSW5kZXhEYXRhLnNwbGl0KC9bXFxyXFxuXS8pLmZpbHRlcigocm93KSA9PiByb3cudHJpbSgpICE9PSAnJykpO1xuICAgICAgY29uc3QgZ2VuZXJhdGVkSW5kZXhSb3dzID0gZ2VuZXJhdGVkSW5kZXhEYXRhLnNwbGl0KC9bXFxyXFxuXS8pLmZpbHRlcigocm93KSA9PiByb3cudHJpbSgpICE9PSAnJyk7XG5cbiAgICAgIGNvbnN0IHJvd3NHZW5lcmF0ZWQ6IHN0cmluZ1tdID0gW107XG4gICAgICBnZW5lcmF0ZWRJbmRleFJvd3MuZm9yRWFjaCgocm93KSA9PiB7XG4gICAgICAgIGlmICghY3VzdG9tSW5kZXhSb3dzLmhhcyhyb3cpKSB7XG4gICAgICAgICAgcm93c0dlbmVyYXRlZC5wdXNoKHJvdyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvL0FmdGVyIGRldi1idW5kbGUgYnVpbGQgYWRkIHVzZWQgRmxvdyBmcm9udGVuZCBpbXBvcnRzIEpzTW9kdWxlL0phdmFTY3JpcHQvQ3NzSW1wb3J0XG5cbiAgICAgIGNvbnN0IHBhcnNlSW1wb3J0cyA9IChmaWxlbmFtZTogc3RyaW5nLCByZXN1bHQ6IFNldDxzdHJpbmc+KTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnQ6IHN0cmluZyA9IHJlYWRGaWxlU3luYyhmaWxlbmFtZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KTtcbiAgICAgICAgY29uc3QgbGluZXMgPSBjb250ZW50LnNwbGl0KCdcXG4nKTtcbiAgICAgICAgY29uc3Qgc3RhdGljSW1wb3J0cyA9IGxpbmVzXG4gICAgICAgICAgLmZpbHRlcigobGluZSkgPT4gbGluZS5zdGFydHNXaXRoKCdpbXBvcnQgJykpXG4gICAgICAgICAgLm1hcCgobGluZSkgPT4gbGluZS5zdWJzdHJpbmcobGluZS5pbmRleE9mKFwiJ1wiKSArIDEsIGxpbmUubGFzdEluZGV4T2YoXCInXCIpKSlcbiAgICAgICAgICAubWFwKChsaW5lKSA9PiAobGluZS5pbmNsdWRlcygnPycpID8gbGluZS5zdWJzdHJpbmcoMCwgbGluZS5sYXN0SW5kZXhPZignPycpKSA6IGxpbmUpKTtcbiAgICAgICAgY29uc3QgZHluYW1pY0ltcG9ydHMgPSBsaW5lc1xuICAgICAgICAgIC5maWx0ZXIoKGxpbmUpID0+IGxpbmUuaW5jbHVkZXMoJ2ltcG9ydCgnKSlcbiAgICAgICAgICAubWFwKChsaW5lKSA9PiBsaW5lLnJlcGxhY2UoLy4qaW1wb3J0XFwoLywgJycpKVxuICAgICAgICAgIC5tYXAoKGxpbmUpID0+IGxpbmUuc3BsaXQoLycvKVsxXSlcbiAgICAgICAgICAubWFwKChsaW5lKSA9PiAobGluZS5pbmNsdWRlcygnPycpID8gbGluZS5zdWJzdHJpbmcoMCwgbGluZS5sYXN0SW5kZXhPZignPycpKSA6IGxpbmUpKTtcblxuICAgICAgICBzdGF0aWNJbXBvcnRzLmZvckVhY2goKHN0YXRpY0ltcG9ydCkgPT4gcmVzdWx0LmFkZChzdGF0aWNJbXBvcnQpKTtcblxuICAgICAgICBkeW5hbWljSW1wb3J0cy5tYXAoKGR5bmFtaWNJbXBvcnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRlZEZpbGUgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKGZpbGVuYW1lKSwgZHluYW1pY0ltcG9ydCk7XG4gICAgICAgICAgcGFyc2VJbXBvcnRzKGltcG9ydGVkRmlsZSwgcmVzdWx0KTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBnZW5lcmF0ZWRJbXBvcnRzU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgICBwYXJzZUltcG9ydHMoXG4gICAgICAgIHBhdGgucmVzb2x2ZSh0aGVtZU9wdGlvbnMuZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIsICdmbG93JywgJ2dlbmVyYXRlZC1mbG93LWltcG9ydHMuanMnKSxcbiAgICAgICAgZ2VuZXJhdGVkSW1wb3J0c1NldFxuICAgICAgKTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZEltcG9ydHMgPSBBcnJheS5mcm9tKGdlbmVyYXRlZEltcG9ydHNTZXQpLnNvcnQoKTtcblxuICAgICAgY29uc3QgZnJvbnRlbmRGaWxlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gICAgICBjb25zdCBwcm9qZWN0RmlsZUV4dGVuc2lvbnMgPSBbJy5qcycsICcuanMubWFwJywgJy50cycsICcudHMubWFwJywgJy50c3gnLCAnLnRzeC5tYXAnLCAnLmNzcycsICcuY3NzLm1hcCddO1xuXG4gICAgICBjb25zdCBpc1RoZW1lQ29tcG9uZW50c1Jlc291cmNlID0gKGlkOiBzdHJpbmcpID0+XG4gICAgICAgICAgaWQuc3RhcnRzV2l0aCh0aGVtZU9wdGlvbnMuZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAgICAgICAmJiBpZC5tYXRjaCgvLipcXC9qYXItcmVzb3VyY2VzXFwvdGhlbWVzXFwvW15cXC9dK1xcL2NvbXBvbmVudHNcXC8vKTtcblxuICAgICAgY29uc3QgaXNHZW5lcmF0ZWRXZWJDb21wb25lbnRSZXNvdXJjZSA9IChpZDogc3RyaW5nKSA9PlxuICAgICAgICAgIGlkLnN0YXJ0c1dpdGgodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgICAgICAgJiYgaWQubWF0Y2goLy4qXFwvZmxvd1xcL3dlYi1jb21wb25lbnRzXFwvLyk7XG5cbiAgICAgIGNvbnN0IGlzRnJvbnRlbmRSZXNvdXJjZUNvbGxlY3RlZCA9IChpZDogc3RyaW5nKSA9PlxuICAgICAgICAgICFpZC5zdGFydHNXaXRoKHRoZW1lT3B0aW9ucy5mcm9udGVuZEdlbmVyYXRlZEZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJykpXG4gICAgICAgICAgfHwgaXNUaGVtZUNvbXBvbmVudHNSZXNvdXJjZShpZClcbiAgICAgICAgICB8fCBpc0dlbmVyYXRlZFdlYkNvbXBvbmVudFJlc291cmNlKGlkKTtcblxuICAgICAgLy8gY29sbGVjdHMgcHJvamVjdCdzIGZyb250ZW5kIHJlc291cmNlcyBpbiBmcm9udGVuZCBmb2xkZXIsIGV4Y2x1ZGluZ1xuICAgICAgLy8gJ2dlbmVyYXRlZCcgc3ViLWZvbGRlciwgZXhjZXB0IGZvciBsZWdhY3kgc2hhZG93IERPTSBzdHlsZXNoZWV0c1xuICAgICAgLy8gcGFja2FnZWQgaW4gYHRoZW1lL2NvbXBvbmVudHMvYCBmb2xkZXJcbiAgICAgIC8vIGFuZCBnZW5lcmF0ZWQgd2ViIGNvbXBvbmVudCByZXNvdXJjZXMgaW4gYGZsb3cvd2ViLWNvbXBvbmVudHNgIGZvbGRlci5cbiAgICAgIG1vZHVsZXNcbiAgICAgICAgLm1hcCgoaWQpID0+IGlkLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgLmZpbHRlcigoaWQpID0+IGlkLnN0YXJ0c1dpdGgoZnJvbnRlbmRGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpKSlcbiAgICAgICAgLmZpbHRlcihpc0Zyb250ZW5kUmVzb3VyY2VDb2xsZWN0ZWQpXG4gICAgICAgIC5tYXAoKGlkKSA9PiBpZC5zdWJzdHJpbmcoZnJvbnRlbmRGb2xkZXIubGVuZ3RoICsgMSkpXG4gICAgICAgIC5tYXAoKGxpbmU6IHN0cmluZykgPT4gKGxpbmUuaW5jbHVkZXMoJz8nKSA/IGxpbmUuc3Vic3RyaW5nKDAsIGxpbmUubGFzdEluZGV4T2YoJz8nKSkgOiBsaW5lKSlcbiAgICAgICAgLmZvckVhY2goKGxpbmU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIC8vIFxcclxcbiBmcm9tIHdpbmRvd3MgbWFkZSBmaWxlcyBtYXkgYmUgdXNlZCBzbyBjaGFuZ2UgdG8gXFxuXG4gICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIGxpbmUpO1xuICAgICAgICAgIGlmIChwcm9qZWN0RmlsZUV4dGVuc2lvbnMuaW5jbHVkZXMocGF0aC5leHRuYW1lKGZpbGVQYXRoKSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVCdWZmZXIgPSByZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgICAgICAgICAgIGZyb250ZW5kRmlsZXNbbGluZV0gPSBjcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoZmlsZUJ1ZmZlciwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIC8vIGNvbGxlY3RzIGZyb250ZW5kIHJlc291cmNlcyBmcm9tIHRoZSBKQVJzXG4gICAgICBnZW5lcmF0ZWRJbXBvcnRzXG4gICAgICAgIC5maWx0ZXIoKGxpbmU6IHN0cmluZykgPT4gbGluZS5pbmNsdWRlcygnZ2VuZXJhdGVkL2phci1yZXNvdXJjZXMnKSlcbiAgICAgICAgLmZvckVhY2goKGxpbmU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGxldCBmaWxlbmFtZSA9IGxpbmUuc3Vic3RyaW5nKGxpbmUuaW5kZXhPZignZ2VuZXJhdGVkJykpO1xuICAgICAgICAgIC8vIFxcclxcbiBmcm9tIHdpbmRvd3MgbWFkZSBmaWxlcyBtYXkgYmUgdXNlZCBybyByZW1vdmUgdG8gYmUgb25seSBcXG5cbiAgICAgICAgICBjb25zdCBmaWxlQnVmZmVyID0gcmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgZmlsZW5hbWUpLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pLnJlcGxhY2UoXG4gICAgICAgICAgICAvXFxyXFxuL2csXG4gICAgICAgICAgICAnXFxuJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgY29uc3QgaGFzaCA9IGNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShmaWxlQnVmZmVyLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG5cbiAgICAgICAgICBjb25zdCBmaWxlS2V5ID0gbGluZS5zdWJzdHJpbmcobGluZS5pbmRleE9mKCdqYXItcmVzb3VyY2VzLycpICsgMTQpO1xuICAgICAgICAgIGZyb250ZW5kRmlsZXNbZmlsZUtleV0gPSBoYXNoO1xuICAgICAgICB9KTtcbiAgICAgIC8vIGNvbGxlY3RzIGFuZCBoYXNoIHJlc3Qgb2YgdGhlIEZyb250ZW5kIHJlc291cmNlcyBleGNsdWRpbmcgZmlsZXMgaW4gL2dlbmVyYXRlZC8gYW5kIC90aGVtZXMvXG4gICAgICAvLyBhbmQgZmlsZXMgYWxyZWFkeSBpbiBmcm9udGVuZEZpbGVzLlxuICAgICAgbGV0IGZyb250ZW5kRm9sZGVyQWxpYXMgPSBcIkZyb250ZW5kXCI7XG4gICAgICBnZW5lcmF0ZWRJbXBvcnRzXG4gICAgICAgIC5maWx0ZXIoKGxpbmU6IHN0cmluZykgPT4gbGluZS5zdGFydHNXaXRoKGZyb250ZW5kRm9sZGVyQWxpYXMgKyAnLycpKVxuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+ICFsaW5lLnN0YXJ0c1dpdGgoZnJvbnRlbmRGb2xkZXJBbGlhcyArICcvZ2VuZXJhdGVkLycpKVxuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+ICFsaW5lLnN0YXJ0c1dpdGgoZnJvbnRlbmRGb2xkZXJBbGlhcyArICcvdGhlbWVzLycpKVxuICAgICAgICAubWFwKChsaW5lKSA9PiBsaW5lLnN1YnN0cmluZyhmcm9udGVuZEZvbGRlckFsaWFzLmxlbmd0aCArIDEpKVxuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+ICFmcm9udGVuZEZpbGVzW2xpbmVdKVxuICAgICAgICAuZm9yRWFjaCgobGluZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIGxpbmUpO1xuICAgICAgICAgIGlmIChwcm9qZWN0RmlsZUV4dGVuc2lvbnMuaW5jbHVkZXMocGF0aC5leHRuYW1lKGZpbGVQYXRoKSkgJiYgZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVCdWZmZXIgPSByZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgICAgICAgICAgIGZyb250ZW5kRmlsZXNbbGluZV0gPSBjcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoZmlsZUJ1ZmZlciwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAvLyBJZiBhIGluZGV4LnRzIGV4aXN0cyBoYXNoIGl0IHRvIGJlIGFibGUgdG8gc2VlIGlmIGl0IGNoYW5nZXMuXG4gICAgICBpZiAoZXhpc3RzU3luYyhwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsICdpbmRleC50cycpKSkge1xuICAgICAgICBjb25zdCBmaWxlQnVmZmVyID0gcmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ2luZGV4LnRzJyksIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZShcbiAgICAgICAgICAvXFxyXFxuL2csXG4gICAgICAgICAgJ1xcbidcbiAgICAgICAgKTtcbiAgICAgICAgZnJvbnRlbmRGaWxlc1tgaW5kZXgudHNgXSA9IGNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShmaWxlQnVmZmVyLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRoZW1lSnNvbkNvbnRlbnRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgICBjb25zdCB0aGVtZXNGb2xkZXIgPSBwYXRoLnJlc29sdmUoamFyUmVzb3VyY2VzRm9sZGVyLCAndGhlbWVzJyk7XG4gICAgICBpZiAoZXhpc3RzU3luYyh0aGVtZXNGb2xkZXIpKSB7XG4gICAgICAgIHJlYWRkaXJTeW5jKHRoZW1lc0ZvbGRlcikuZm9yRWFjaCgodGhlbWVGb2xkZXIpID0+IHtcbiAgICAgICAgICBjb25zdCB0aGVtZUpzb24gPSBwYXRoLnJlc29sdmUodGhlbWVzRm9sZGVyLCB0aGVtZUZvbGRlciwgJ3RoZW1lLmpzb24nKTtcbiAgICAgICAgICBpZiAoZXhpc3RzU3luYyh0aGVtZUpzb24pKSB7XG4gICAgICAgICAgICB0aGVtZUpzb25Db250ZW50c1twYXRoLmJhc2VuYW1lKHRoZW1lRm9sZGVyKV0gPSByZWFkRmlsZVN5bmModGhlbWVKc29uLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pLnJlcGxhY2UoXG4gICAgICAgICAgICAgIC9cXHJcXG4vZyxcbiAgICAgICAgICAgICAgJ1xcbidcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgY29sbGVjdFRoZW1lSnNvbnNJbkZyb250ZW5kKHRoZW1lSnNvbkNvbnRlbnRzLCBzZXR0aW5ncy50aGVtZU5hbWUpO1xuXG4gICAgICBsZXQgd2ViQ29tcG9uZW50czogc3RyaW5nW10gPSBbXTtcbiAgICAgIGlmICh3ZWJDb21wb25lbnRUYWdzKSB7XG4gICAgICAgIHdlYkNvbXBvbmVudHMgPSB3ZWJDb21wb25lbnRUYWdzLnNwbGl0KCc7Jyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0YXRzID0ge1xuICAgICAgICBwYWNrYWdlSnNvbkRlcGVuZGVuY2llczogcHJvamVjdFBhY2thZ2VKc29uLmRlcGVuZGVuY2llcyxcbiAgICAgICAgbnBtTW9kdWxlczogbnBtTW9kdWxlQW5kVmVyc2lvbixcbiAgICAgICAgYnVuZGxlSW1wb3J0czogZ2VuZXJhdGVkSW1wb3J0cyxcbiAgICAgICAgZnJvbnRlbmRIYXNoZXM6IGZyb250ZW5kRmlsZXMsXG4gICAgICAgIHRoZW1lSnNvbkNvbnRlbnRzOiB0aGVtZUpzb25Db250ZW50cyxcbiAgICAgICAgZW50cnlTY3JpcHRzLFxuICAgICAgICB3ZWJDb21wb25lbnRzLFxuICAgICAgICBjdmRsTW9kdWxlczogY3ZkbHMsXG4gICAgICAgIHBhY2thZ2VKc29uSGFzaDogcHJvamVjdFBhY2thZ2VKc29uPy52YWFkaW4/Lmhhc2gsXG4gICAgICAgIGluZGV4SHRtbEdlbmVyYXRlZDogcm93c0dlbmVyYXRlZFxuICAgICAgfTtcbiAgICAgIHdyaXRlRmlsZVN5bmMoc3RhdHNGaWxlLCBKU09OLnN0cmluZ2lmeShzdGF0cywgbnVsbCwgMSkpO1xuICAgIH1cbiAgfTtcbn1cbmZ1bmN0aW9uIHZhYWRpbkJ1bmRsZXNQbHVnaW4oKTogUGx1Z2luT3B0aW9uIHtcbiAgdHlwZSBFeHBvcnRJbmZvID1cbiAgICB8IHN0cmluZ1xuICAgIHwge1xuICAgICAgICBuYW1lc3BhY2U/OiBzdHJpbmc7XG4gICAgICAgIHNvdXJjZTogc3RyaW5nO1xuICAgICAgfTtcblxuICB0eXBlIEV4cG9zZUluZm8gPSB7XG4gICAgZXhwb3J0czogRXhwb3J0SW5mb1tdO1xuICB9O1xuXG4gIHR5cGUgUGFja2FnZUluZm8gPSB7XG4gICAgdmVyc2lvbjogc3RyaW5nO1xuICAgIGV4cG9zZXM6IFJlY29yZDxzdHJpbmcsIEV4cG9zZUluZm8+O1xuICB9O1xuXG4gIHR5cGUgQnVuZGxlSnNvbiA9IHtcbiAgICBwYWNrYWdlczogUmVjb3JkPHN0cmluZywgUGFja2FnZUluZm8+O1xuICB9O1xuXG4gIGNvbnN0IGRpc2FibGVkTWVzc2FnZSA9ICdWYWFkaW4gY29tcG9uZW50IGRlcGVuZGVuY3kgYnVuZGxlcyBhcmUgZGlzYWJsZWQuJztcblxuICBjb25zdCBtb2R1bGVzRGlyZWN0b3J5ID0gbm9kZU1vZHVsZXNGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gIGxldCB2YWFkaW5CdW5kbGVKc29uOiBCdW5kbGVKc29uO1xuXG4gIGZ1bmN0aW9uIHBhcnNlTW9kdWxlSWQoaWQ6IHN0cmluZyk6IHsgcGFja2FnZU5hbWU6IHN0cmluZzsgbW9kdWxlUGF0aDogc3RyaW5nIH0ge1xuICAgIGNvbnN0IFtzY29wZSwgc2NvcGVkUGFja2FnZU5hbWVdID0gaWQuc3BsaXQoJy8nLCAzKTtcbiAgICBjb25zdCBwYWNrYWdlTmFtZSA9IHNjb3BlLnN0YXJ0c1dpdGgoJ0AnKSA/IGAke3Njb3BlfS8ke3Njb3BlZFBhY2thZ2VOYW1lfWAgOiBzY29wZTtcbiAgICBjb25zdCBtb2R1bGVQYXRoID0gYC4ke2lkLnN1YnN0cmluZyhwYWNrYWdlTmFtZS5sZW5ndGgpfWA7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBhY2thZ2VOYW1lLFxuICAgICAgbW9kdWxlUGF0aFxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBnZXRFeHBvcnRzKGlkOiBzdHJpbmcpOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCB7XG4gICAgY29uc3QgeyBwYWNrYWdlTmFtZSwgbW9kdWxlUGF0aCB9ID0gcGFyc2VNb2R1bGVJZChpZCk7XG4gICAgY29uc3QgcGFja2FnZUluZm8gPSB2YWFkaW5CdW5kbGVKc29uLnBhY2thZ2VzW3BhY2thZ2VOYW1lXTtcblxuICAgIGlmICghcGFja2FnZUluZm8pIHJldHVybjtcblxuICAgIGNvbnN0IGV4cG9zZUluZm86IEV4cG9zZUluZm8gPSBwYWNrYWdlSW5mby5leHBvc2VzW21vZHVsZVBhdGhdO1xuICAgIGlmICghZXhwb3NlSW5mbykgcmV0dXJuO1xuXG4gICAgY29uc3QgZXhwb3J0c1NldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgIGZvciAoY29uc3QgZSBvZiBleHBvc2VJbmZvLmV4cG9ydHMpIHtcbiAgICAgIGlmICh0eXBlb2YgZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgZXhwb3J0c1NldC5hZGQoZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB7IG5hbWVzcGFjZSwgc291cmNlIH0gPSBlO1xuICAgICAgICBpZiAobmFtZXNwYWNlKSB7XG4gICAgICAgICAgZXhwb3J0c1NldC5hZGQobmFtZXNwYWNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBzb3VyY2VFeHBvcnRzID0gZ2V0RXhwb3J0cyhzb3VyY2UpO1xuICAgICAgICAgIGlmIChzb3VyY2VFeHBvcnRzKSB7XG4gICAgICAgICAgICBzb3VyY2VFeHBvcnRzLmZvckVhY2goKGUpID0+IGV4cG9ydHNTZXQuYWRkKGUpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZXhwb3J0c1NldCk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRFeHBvcnRCaW5kaW5nKGJpbmRpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBiaW5kaW5nID09PSAnZGVmYXVsdCcgPyAnX2RlZmF1bHQgYXMgZGVmYXVsdCcgOiBiaW5kaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW1wb3J0QXNzaWdtZW50KGJpbmRpbmc6IHN0cmluZykge1xuICAgIHJldHVybiBiaW5kaW5nID09PSAnZGVmYXVsdCcgPyAnZGVmYXVsdDogX2RlZmF1bHQnIDogYmluZGluZztcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjpidW5kbGVzJyxcbiAgICBlbmZvcmNlOiAncHJlJyxcbiAgICBhcHBseShjb25maWcsIHsgY29tbWFuZCB9KSB7XG4gICAgICBpZiAoY29tbWFuZCAhPT0gJ3NlcnZlJykgcmV0dXJuIGZhbHNlO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB2YWFkaW5CdW5kbGVKc29uUGF0aCA9IHJlcXVpcmUucmVzb2x2ZSgnQHZhYWRpbi9idW5kbGVzL3ZhYWRpbi1idW5kbGUuanNvbicpO1xuICAgICAgICB2YWFkaW5CdW5kbGVKc29uID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmModmFhZGluQnVuZGxlSnNvblBhdGgsIHsgZW5jb2Rpbmc6ICd1dGY4JyB9KSk7XG4gICAgICB9IGNhdGNoIChlOiB1bmtub3duKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZSA9PT0gJ29iamVjdCcgJiYgKGUgYXMgeyBjb2RlOiBzdHJpbmcgfSkuY29kZSA9PT0gJ01PRFVMRV9OT1RfRk9VTkQnKSB7XG4gICAgICAgICAgdmFhZGluQnVuZGxlSnNvbiA9IHsgcGFja2FnZXM6IHt9IH07XG4gICAgICAgICAgY29uc29sZS5pbmZvKGBAdmFhZGluL2J1bmRsZXMgbnBtIHBhY2thZ2UgaXMgbm90IGZvdW5kLCAke2Rpc2FibGVkTWVzc2FnZX1gKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCB2ZXJzaW9uTWlzbWF0Y2hlczogQXJyYXk8eyBuYW1lOiBzdHJpbmc7IGJ1bmRsZWRWZXJzaW9uOiBzdHJpbmc7IGluc3RhbGxlZFZlcnNpb246IHN0cmluZyB9PiA9IFtdO1xuICAgICAgZm9yIChjb25zdCBbbmFtZSwgcGFja2FnZUluZm9dIG9mIE9iamVjdC5lbnRyaWVzKHZhYWRpbkJ1bmRsZUpzb24ucGFja2FnZXMpKSB7XG4gICAgICAgIGxldCBpbnN0YWxsZWRWZXJzaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgeyB2ZXJzaW9uOiBidW5kbGVkVmVyc2lvbiB9ID0gcGFja2FnZUluZm87XG4gICAgICAgICAgY29uc3QgaW5zdGFsbGVkUGFja2FnZUpzb25GaWxlID0gcGF0aC5yZXNvbHZlKG1vZHVsZXNEaXJlY3RvcnksIG5hbWUsICdwYWNrYWdlLmpzb24nKTtcbiAgICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKGluc3RhbGxlZFBhY2thZ2VKc29uRmlsZSwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pKTtcbiAgICAgICAgICBpbnN0YWxsZWRWZXJzaW9uID0gcGFja2FnZUpzb24udmVyc2lvbjtcbiAgICAgICAgICBpZiAoaW5zdGFsbGVkVmVyc2lvbiAmJiBpbnN0YWxsZWRWZXJzaW9uICE9PSBidW5kbGVkVmVyc2lvbikge1xuICAgICAgICAgICAgdmVyc2lvbk1pc21hdGNoZXMucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICAgIGJ1bmRsZWRWZXJzaW9uLFxuICAgICAgICAgICAgICBpbnN0YWxsZWRWZXJzaW9uXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICAvLyBpZ25vcmUgcGFja2FnZSBub3QgZm91bmRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHZlcnNpb25NaXNtYXRjaGVzLmxlbmd0aCkge1xuICAgICAgICBjb25zb2xlLmluZm8oYEB2YWFkaW4vYnVuZGxlcyBoYXMgdmVyc2lvbiBtaXNtYXRjaGVzIHdpdGggaW5zdGFsbGVkIHBhY2thZ2VzLCAke2Rpc2FibGVkTWVzc2FnZX1gKTtcbiAgICAgICAgY29uc29sZS5pbmZvKGBQYWNrYWdlcyB3aXRoIHZlcnNpb24gbWlzbWF0Y2hlczogJHtKU09OLnN0cmluZ2lmeSh2ZXJzaW9uTWlzbWF0Y2hlcywgdW5kZWZpbmVkLCAyKX1gKTtcbiAgICAgICAgdmFhZGluQnVuZGxlSnNvbiA9IHsgcGFja2FnZXM6IHt9IH07XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBhc3luYyBjb25maWcoY29uZmlnKSB7XG4gICAgICByZXR1cm4gbWVyZ2VDb25maWcoXG4gICAgICAgIHtcbiAgICAgICAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgICAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgICAgICAgLy8gVmFhZGluIGJ1bmRsZVxuICAgICAgICAgICAgICAnQHZhYWRpbi9idW5kbGVzJyxcbiAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXModmFhZGluQnVuZGxlSnNvbi5wYWNrYWdlcyksXG4gICAgICAgICAgICAgICdAdmFhZGluL3ZhYWRpbi1tYXRlcmlhbC1zdHlsZXMnXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb25maWdcbiAgICAgICk7XG4gICAgfSxcbiAgICBsb2FkKHJhd0lkKSB7XG4gICAgICBjb25zdCBbcGF0aCwgcGFyYW1zXSA9IHJhd0lkLnNwbGl0KCc/Jyk7XG4gICAgICBpZiAoIXBhdGguc3RhcnRzV2l0aChtb2R1bGVzRGlyZWN0b3J5KSkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBpZCA9IHBhdGguc3Vic3RyaW5nKG1vZHVsZXNEaXJlY3RvcnkubGVuZ3RoICsgMSk7XG4gICAgICBjb25zdCBiaW5kaW5ncyA9IGdldEV4cG9ydHMoaWQpO1xuICAgICAgaWYgKGJpbmRpbmdzID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgICAgY29uc3QgY2FjaGVTdWZmaXggPSBwYXJhbXMgPyBgPyR7cGFyYW1zfWAgOiAnJztcbiAgICAgIGNvbnN0IGJ1bmRsZVBhdGggPSBgQHZhYWRpbi9idW5kbGVzL3ZhYWRpbi5qcyR7Y2FjaGVTdWZmaXh9YDtcblxuICAgICAgcmV0dXJuIGBpbXBvcnQgeyBpbml0IGFzIFZhYWRpbkJ1bmRsZUluaXQsIGdldCBhcyBWYWFkaW5CdW5kbGVHZXQgfSBmcm9tICcke2J1bmRsZVBhdGh9JztcbmF3YWl0IFZhYWRpbkJ1bmRsZUluaXQoJ2RlZmF1bHQnKTtcbmNvbnN0IHsgJHtiaW5kaW5ncy5tYXAoZ2V0SW1wb3J0QXNzaWdtZW50KS5qb2luKCcsICcpfSB9ID0gKGF3YWl0IFZhYWRpbkJ1bmRsZUdldCgnLi9ub2RlX21vZHVsZXMvJHtpZH0nKSkoKTtcbmV4cG9ydCB7ICR7YmluZGluZ3MubWFwKGdldEV4cG9ydEJpbmRpbmcpLmpvaW4oJywgJyl9IH07YDtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRoZW1lUGx1Z2luKG9wdHM6IHsgZGV2TW9kZTogYm9vbGVhbiB9KTogUGx1Z2luT3B0aW9uIHtcbiAgY29uc3QgZnVsbFRoZW1lT3B0aW9ucyA9IHsgLi4udGhlbWVPcHRpb25zLCBkZXZNb2RlOiBvcHRzLmRldk1vZGUgfTtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOnRoZW1lJyxcbiAgICBjb25maWcoKSB7XG4gICAgICBwcm9jZXNzVGhlbWVSZXNvdXJjZXMoZnVsbFRoZW1lT3B0aW9ucywgY29uc29sZSk7XG4gICAgfSxcbiAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICBmdW5jdGlvbiBoYW5kbGVUaGVtZUZpbGVDcmVhdGVEZWxldGUodGhlbWVGaWxlOiBzdHJpbmcsIHN0YXRzPzogU3RhdHMpIHtcbiAgICAgICAgaWYgKHRoZW1lRmlsZS5zdGFydHNXaXRoKHRoZW1lRm9sZGVyKSkge1xuICAgICAgICAgIGNvbnN0IGNoYW5nZWQgPSBwYXRoLnJlbGF0aXZlKHRoZW1lRm9sZGVyLCB0aGVtZUZpbGUpO1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1RoZW1lIGZpbGUgJyArICghIXN0YXRzID8gJ2NyZWF0ZWQnIDogJ2RlbGV0ZWQnKSwgY2hhbmdlZCk7XG4gICAgICAgICAgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzKGZ1bGxUaGVtZU9wdGlvbnMsIGNvbnNvbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXJ2ZXIud2F0Y2hlci5vbignYWRkJywgaGFuZGxlVGhlbWVGaWxlQ3JlYXRlRGVsZXRlKTtcbiAgICAgIHNlcnZlci53YXRjaGVyLm9uKCd1bmxpbmsnLCBoYW5kbGVUaGVtZUZpbGVDcmVhdGVEZWxldGUpO1xuICAgIH0sXG4gICAgaGFuZGxlSG90VXBkYXRlKGNvbnRleHQpIHtcbiAgICAgIGNvbnN0IGNvbnRleHRQYXRoID0gcGF0aC5yZXNvbHZlKGNvbnRleHQuZmlsZSk7XG4gICAgICBjb25zdCB0aGVtZVBhdGggPSBwYXRoLnJlc29sdmUodGhlbWVGb2xkZXIpO1xuICAgICAgaWYgKGNvbnRleHRQYXRoLnN0YXJ0c1dpdGgodGhlbWVQYXRoKSkge1xuICAgICAgICBjb25zdCBjaGFuZ2VkID0gcGF0aC5yZWxhdGl2ZSh0aGVtZVBhdGgsIGNvbnRleHRQYXRoKTtcblxuICAgICAgICBjb25zb2xlLmRlYnVnKCdUaGVtZSBmaWxlIGNoYW5nZWQnLCBjaGFuZ2VkKTtcblxuICAgICAgICBpZiAoY2hhbmdlZC5zdGFydHNXaXRoKHNldHRpbmdzLnRoZW1lTmFtZSkpIHtcbiAgICAgICAgICBwcm9jZXNzVGhlbWVSZXNvdXJjZXMoZnVsbFRoZW1lT3B0aW9ucywgY29uc29sZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jIHJlc29sdmVJZChpZCwgaW1wb3J0ZXIpIHtcbiAgICAgIC8vIGZvcmNlIHRoZW1lIGdlbmVyYXRpb24gaWYgZ2VuZXJhdGVkIHRoZW1lIHNvdXJjZXMgZG9lcyBub3QgeWV0IGV4aXN0XG4gICAgICAvLyB0aGlzIG1heSBoYXBwZW4gZm9yIGV4YW1wbGUgZHVyaW5nIEphdmEgaG90IHJlbG9hZCB3aGVuIHVwZGF0aW5nXG4gICAgICAvLyBAVGhlbWUgYW5ub3RhdGlvbiB2YWx1ZVxuICAgICAgaWYgKFxuICAgICAgICBwYXRoLnJlc29sdmUodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCAndGhlbWUuanMnKSA9PT0gaW1wb3J0ZXIgJiZcbiAgICAgICAgIWV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKHRoZW1lT3B0aW9ucy5mcm9udGVuZEdlbmVyYXRlZEZvbGRlciwgaWQpKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ0dlbmVyYXRlIHRoZW1lIGZpbGUgJyArIGlkICsgJyBub3QgZXhpc3RpbmcuIFByb2Nlc3NpbmcgdGhlbWUgcmVzb3VyY2UnKTtcbiAgICAgICAgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzKGZ1bGxUaGVtZU9wdGlvbnMsIGNvbnNvbGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWlkLnN0YXJ0c1dpdGgoc2V0dGluZ3MudGhlbWVGb2xkZXIpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgbG9jYXRpb24gb2YgW3RoZW1lUmVzb3VyY2VGb2xkZXIsIGZyb250ZW5kRm9sZGVyXSkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB0aGlzLnJlc29sdmUocGF0aC5yZXNvbHZlKGxvY2F0aW9uLCBpZCkpO1xuICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgdHJhbnNmb3JtKHJhdywgaWQsIG9wdGlvbnMpIHtcbiAgICAgIC8vIHJld3JpdGUgdXJscyBmb3IgdGhlIGFwcGxpY2F0aW9uIHRoZW1lIGNzcyBmaWxlc1xuICAgICAgY29uc3QgW2JhcmVJZCwgcXVlcnldID0gaWQuc3BsaXQoJz8nKTtcbiAgICAgIGlmIChcbiAgICAgICAgKCFiYXJlSWQ/LnN0YXJ0c1dpdGgodGhlbWVGb2xkZXIpICYmICFiYXJlSWQ/LnN0YXJ0c1dpdGgodGhlbWVPcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIpKSB8fFxuICAgICAgICAhYmFyZUlkPy5lbmRzV2l0aCgnLmNzcycpXG4gICAgICApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVzb3VyY2VUaGVtZUZvbGRlciA9IGJhcmVJZC5zdGFydHNXaXRoKHRoZW1lRm9sZGVyKSA/IHRoZW1lRm9sZGVyIDogdGhlbWVPcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXI7XG4gICAgICBjb25zdCBbdGhlbWVOYW1lXSA9ICBiYXJlSWQuc3Vic3RyaW5nKHJlc291cmNlVGhlbWVGb2xkZXIubGVuZ3RoICsgMSkuc3BsaXQoJy8nKTtcbiAgICAgIHJldHVybiByZXdyaXRlQ3NzVXJscyhyYXcsIHBhdGguZGlybmFtZShiYXJlSWQpLCBwYXRoLnJlc29sdmUocmVzb3VyY2VUaGVtZUZvbGRlciwgdGhlbWVOYW1lKSwgY29uc29sZSwgb3B0cyk7XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBydW5XYXRjaERvZyh3YXRjaERvZ1BvcnQ6IG51bWJlciwgd2F0Y2hEb2dIb3N0OiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgY29uc3QgY2xpZW50ID0gbmV3IG5ldC5Tb2NrZXQoKTtcbiAgY2xpZW50LnNldEVuY29kaW5nKCd1dGY4Jyk7XG4gIGNsaWVudC5vbignZXJyb3InLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coJ1dhdGNoZG9nIGNvbm5lY3Rpb24gZXJyb3IuIFRlcm1pbmF0aW5nIHZpdGUgcHJvY2Vzcy4uLicsIGVycik7XG4gICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICBwcm9jZXNzLmV4aXQoMCk7XG4gIH0pO1xuICBjbGllbnQub24oJ2Nsb3NlJywgZnVuY3Rpb24gKCkge1xuICAgIGNsaWVudC5kZXN0cm95KCk7XG4gICAgcnVuV2F0Y2hEb2cod2F0Y2hEb2dQb3J0LCB3YXRjaERvZ0hvc3QpO1xuICB9KTtcblxuICBjbGllbnQuY29ubmVjdCh3YXRjaERvZ1BvcnQsIHdhdGNoRG9nSG9zdCB8fCAnbG9jYWxob3N0Jyk7XG59XG5cbmNvbnN0IGFsbG93ZWRGcm9udGVuZEZvbGRlcnMgPSBbZnJvbnRlbmRGb2xkZXIsIG5vZGVNb2R1bGVzRm9sZGVyXTtcblxuZnVuY3Rpb24gc2hvd1JlY29tcGlsZVJlYXNvbigpOiBQbHVnaW5PcHRpb24ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2YWFkaW46d2h5LXlvdS1jb21waWxlJyxcbiAgICBoYW5kbGVIb3RVcGRhdGUoY29udGV4dCkge1xuICAgICAgY29uc29sZS5sb2coJ1JlY29tcGlsaW5nIGJlY2F1c2UnLCBjb250ZXh0LmZpbGUsICdjaGFuZ2VkJyk7XG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBERVZfTU9ERV9TVEFSVF9SRUdFWFAgPSAvXFwvXFwqW1xcKiFdXFxzK3ZhYWRpbi1kZXYtbW9kZTpzdGFydC87XG5jb25zdCBERVZfTU9ERV9DT0RFX1JFR0VYUCA9IC9cXC9cXCpbXFwqIV1cXHMrdmFhZGluLWRldi1tb2RlOnN0YXJ0KFtcXHNcXFNdKil2YWFkaW4tZGV2LW1vZGU6ZW5kXFxzK1xcKlxcKlxcLy9pO1xuXG5mdW5jdGlvbiBwcmVzZXJ2ZVVzYWdlU3RhdHMoKSB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjpwcmVzZXJ2ZS11c2FnZS1zdGF0cycsXG5cbiAgICB0cmFuc2Zvcm0oc3JjOiBzdHJpbmcsIGlkOiBzdHJpbmcpIHtcbiAgICAgIGlmIChpZC5pbmNsdWRlcygndmFhZGluLXVzYWdlLXN0YXRpc3RpY3MnKSkge1xuICAgICAgICBpZiAoc3JjLmluY2x1ZGVzKCd2YWFkaW4tZGV2LW1vZGU6c3RhcnQnKSkge1xuICAgICAgICAgIGNvbnN0IG5ld1NyYyA9IHNyYy5yZXBsYWNlKERFVl9NT0RFX1NUQVJUX1JFR0VYUCwgJy8qISB2YWFkaW4tZGV2LW1vZGU6c3RhcnQnKTtcbiAgICAgICAgICBpZiAobmV3U3JjID09PSBzcmMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvbW1lbnQgcmVwbGFjZW1lbnQgZmFpbGVkIHRvIGNoYW5nZSBhbnl0aGluZycpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIW5ld1NyYy5tYXRjaChERVZfTU9ERV9DT0RFX1JFR0VYUCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05ldyBjb21tZW50IGZhaWxzIHRvIG1hdGNoIG9yaWdpbmFsIHJlZ2V4cCcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4geyBjb2RlOiBuZXdTcmMgfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgY29kZTogc3JjIH07XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgdmFhZGluQ29uZmlnOiBVc2VyQ29uZmlnRm4gPSAoZW52KSA9PiB7XG4gIGNvbnN0IGRldk1vZGUgPSBlbnYubW9kZSA9PT0gJ2RldmVsb3BtZW50JztcbiAgY29uc3QgcHJvZHVjdGlvbk1vZGUgPSAhZGV2TW9kZSAmJiAhZGV2QnVuZGxlXG5cbiAgaWYgKGRldk1vZGUgJiYgcHJvY2Vzcy5lbnYud2F0Y2hEb2dQb3J0KSB7XG4gICAgLy8gT3BlbiBhIGNvbm5lY3Rpb24gd2l0aCB0aGUgSmF2YSBkZXYtbW9kZSBoYW5kbGVyIGluIG9yZGVyIHRvIGZpbmlzaFxuICAgIC8vIHZpdGUgd2hlbiBpdCBleGl0cyBvciBjcmFzaGVzLlxuICAgIHJ1bldhdGNoRG9nKHBhcnNlSW50KHByb2Nlc3MuZW52LndhdGNoRG9nUG9ydCksIHByb2Nlc3MuZW52LndhdGNoRG9nSG9zdCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHJvb3Q6IGZyb250ZW5kRm9sZGVyLFxuICAgIGJhc2U6ICcnLFxuICAgIHB1YmxpY0RpcjogZmFsc2UsXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0B2YWFkaW4vZmxvdy1mcm9udGVuZCc6IGphclJlc291cmNlc0ZvbGRlcixcbiAgICAgICAgRnJvbnRlbmQ6IGZyb250ZW5kRm9sZGVyXG4gICAgICB9LFxuICAgICAgcHJlc2VydmVTeW1saW5rczogdHJ1ZVxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBPRkZMSU5FX1BBVEg6IHNldHRpbmdzLm9mZmxpbmVQYXRoLFxuICAgICAgVklURV9FTkFCTEVEOiAndHJ1ZSdcbiAgICB9LFxuICAgIHNlcnZlcjoge1xuICAgICAgaG9zdDogJzEyNy4wLjAuMScsXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgZnM6IHtcbiAgICAgICAgYWxsb3c6IGFsbG93ZWRGcm9udGVuZEZvbGRlcnNcbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBtaW5pZnk6IHByb2R1Y3Rpb25Nb2RlLFxuICAgICAgb3V0RGlyOiBidWlsZE91dHB1dEZvbGRlcixcbiAgICAgIGVtcHR5T3V0RGlyOiBkZXZCdW5kbGUsXG4gICAgICBhc3NldHNEaXI6ICdWQUFESU4vYnVpbGQnLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBpbnB1dDoge1xuICAgICAgICAgIGluZGV4aHRtbDogcHJvamVjdEluZGV4SHRtbCxcblxuICAgICAgICAgIC4uLihoYXNFeHBvcnRlZFdlYkNvbXBvbmVudHMgPyB7IHdlYmNvbXBvbmVudGh0bWw6IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ3dlYi1jb21wb25lbnQuaHRtbCcpIH0gOiB7fSlcbiAgICAgICAgfSxcbiAgICAgICAgb253YXJuOiAod2FybmluZzogcm9sbHVwLlJvbGx1cExvZywgZGVmYXVsdEhhbmRsZXI6IHJvbGx1cC5Mb2dnaW5nRnVuY3Rpb24pID0+IHtcbiAgICAgICAgICBjb25zdCBpZ25vcmVFdmFsV2FybmluZyA9IFtcbiAgICAgICAgICAgICdnZW5lcmF0ZWQvamFyLXJlc291cmNlcy9GbG93Q2xpZW50LmpzJyxcbiAgICAgICAgICAgICdnZW5lcmF0ZWQvamFyLXJlc291cmNlcy92YWFkaW4tc3ByZWFkc2hlZXQvc3ByZWFkc2hlZXQtZXhwb3J0LmpzJyxcbiAgICAgICAgICAgICdAdmFhZGluL2NoYXJ0cy9zcmMvaGVscGVycy5qcydcbiAgICAgICAgICBdO1xuICAgICAgICAgIGlmICh3YXJuaW5nLmNvZGUgPT09ICdFVkFMJyAmJiB3YXJuaW5nLmlkICYmICEhaWdub3JlRXZhbFdhcm5pbmcuZmluZCgoaWQpID0+IHdhcm5pbmcuaWQ/LmVuZHNXaXRoKGlkKSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgZGVmYXVsdEhhbmRsZXIod2FybmluZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZW50cmllczogW1xuICAgICAgICAvLyBQcmUtc2NhbiBlbnRyeXBvaW50cyBpbiBWaXRlIHRvIGF2b2lkIHJlbG9hZGluZyBvbiBmaXJzdCBvcGVuXG4gICAgICAgICdnZW5lcmF0ZWQvdmFhZGluLnRzJ1xuICAgICAgXSxcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgJ0B2YWFkaW4vcm91dGVyJyxcbiAgICAgICAgJ0B2YWFkaW4vdmFhZGluLWxpY2Vuc2UtY2hlY2tlcicsXG4gICAgICAgICdAdmFhZGluL3ZhYWRpbi11c2FnZS1zdGF0aXN0aWNzJyxcbiAgICAgICAgJ3dvcmtib3gtY29yZScsXG4gICAgICAgICd3b3JrYm94LXByZWNhY2hpbmcnLFxuICAgICAgICAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgJ3dvcmtib3gtc3RyYXRlZ2llcydcbiAgICAgIF1cbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgIHByb2R1Y3Rpb25Nb2RlICYmIGJyb3RsaSgpLFxuICAgICAgZGV2TW9kZSAmJiB2YWFkaW5CdW5kbGVzUGx1Z2luKCksXG4gICAgICBkZXZNb2RlICYmIHNob3dSZWNvbXBpbGVSZWFzb24oKSxcbiAgICAgIHNldHRpbmdzLm9mZmxpbmVFbmFibGVkICYmIGJ1aWxkU1dQbHVnaW4oeyBkZXZNb2RlIH0pLFxuICAgICAgIWRldk1vZGUgJiYgc3RhdHNFeHRyYWN0ZXJQbHVnaW4oKSxcbiAgICAgICFwcm9kdWN0aW9uTW9kZSAmJiBwcmVzZXJ2ZVVzYWdlU3RhdHMoKSxcbiAgICAgIHRoZW1lUGx1Z2luKHsgZGV2TW9kZSB9KSxcbiAgICAgIHBvc3Rjc3NMaXQoe1xuICAgICAgICBpbmNsdWRlOiBbJyoqLyouY3NzJywgLy4qXFwvLipcXC5jc3NcXD8uKi9dLFxuICAgICAgICBleGNsdWRlOiBbXG4gICAgICAgICAgYCR7dGhlbWVGb2xkZXJ9LyoqLyouY3NzYCxcbiAgICAgICAgICBuZXcgUmVnRXhwKGAke3RoZW1lRm9sZGVyfS8uKi8uKlxcXFwuY3NzXFxcXD8uKmApLFxuICAgICAgICAgIGAke3RoZW1lUmVzb3VyY2VGb2xkZXJ9LyoqLyouY3NzYCxcbiAgICAgICAgICBuZXcgUmVnRXhwKGAke3RoZW1lUmVzb3VyY2VGb2xkZXJ9Ly4qLy4qXFxcXC5jc3NcXFxcPy4qYCksXG4gICAgICAgICAgbmV3IFJlZ0V4cCgnLiovLipcXFxcP2h0bWwtcHJveHkuKicpXG4gICAgICAgIF1cbiAgICAgIH0pLFxuICAgICAgLy8gVGhlIFJlYWN0IHBsdWdpbiBwcm92aWRlcyBmYXN0IHJlZnJlc2ggYW5kIGRlYnVnIHNvdXJjZSBpbmZvXG4gICAgICByZWFjdFBsdWdpbih7XG4gICAgICAgIGluY2x1ZGU6ICcqKi8qLnRzeCcsXG4gICAgICAgIGJhYmVsOiB7XG4gICAgICAgICAgLy8gV2UgbmVlZCB0byB1c2UgYmFiZWwgdG8gcHJvdmlkZSB0aGUgc291cmNlIGluZm9ybWF0aW9uIGZvciBpdCB0byBiZSBjb3JyZWN0XG4gICAgICAgICAgLy8gKG90aGVyd2lzZSBCYWJlbCB3aWxsIHNsaWdodGx5IHJld3JpdGUgdGhlIHNvdXJjZSBmaWxlIGFuZCBlc2J1aWxkIGdlbmVyYXRlIHNvdXJjZSBpbmZvIGZvciB0aGUgbW9kaWZpZWQgZmlsZSlcbiAgICAgICAgICBwcmVzZXRzOiBbWydAYmFiZWwvcHJlc2V0LXJlYWN0JywgeyBydW50aW1lOiAnYXV0b21hdGljJywgZGV2ZWxvcG1lbnQ6ICFwcm9kdWN0aW9uTW9kZSB9XV0sXG4gICAgICAgICAgLy8gUmVhY3Qgd3JpdGVzIHRoZSBzb3VyY2UgbG9jYXRpb24gZm9yIHdoZXJlIGNvbXBvbmVudHMgYXJlIHVzZWQsIHRoaXMgd3JpdGVzIGZvciB3aGVyZSB0aGV5IGFyZSBkZWZpbmVkXG4gICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgIXByb2R1Y3Rpb25Nb2RlICYmIGFkZEZ1bmN0aW9uQ29tcG9uZW50U291cmNlTG9jYXRpb25CYWJlbCgpLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnbW9kdWxlOkBwcmVhY3Qvc2lnbmFscy1yZWFjdC10cmFuc2Zvcm0nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbW9kZTogJ2FsbCcgLy8gTmVlZGVkIHRvIGluY2x1ZGUgdHJhbnNsYXRpb25zIHdoaWNoIGRvIG5vdCB1c2Ugc29tZXRoaW5nLnZhbHVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdLmZpbHRlcihCb29sZWFuKVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3ZhYWRpbjpmb3JjZS1yZW1vdmUtaHRtbC1taWRkbGV3YXJlJyxcbiAgICAgICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBzZXJ2ZXIubWlkZGxld2FyZXMuc3RhY2sgPSBzZXJ2ZXIubWlkZGxld2FyZXMuc3RhY2suZmlsdGVyKChtdykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBoYW5kbGVOYW1lID0gYCR7bXcuaGFuZGxlfWA7XG4gICAgICAgICAgICAgIHJldHVybiAhaGFuZGxlTmFtZS5pbmNsdWRlcygndml0ZUh0bWxGYWxsYmFja01pZGRsZXdhcmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgaGFzRXhwb3J0ZWRXZWJDb21wb25lbnRzICYmIHtcbiAgICAgICAgbmFtZTogJ3ZhYWRpbjppbmplY3QtZW50cnlwb2ludHMtdG8td2ViLWNvbXBvbmVudC1odG1sJyxcbiAgICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sOiB7XG4gICAgICAgICAgb3JkZXI6ICdwcmUnLFxuICAgICAgICAgIGhhbmRsZXIoX2h0bWwsIHsgcGF0aCwgc2VydmVyIH0pIHtcbiAgICAgICAgICAgIGlmIChwYXRoICE9PSAnL3dlYi1jb21wb25lbnQuaHRtbCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGFnOiAnc2NyaXB0JyxcbiAgICAgICAgICAgICAgICBhdHRyczogeyB0eXBlOiAnbW9kdWxlJywgc3JjOiBgL2dlbmVyYXRlZC92YWFkaW4td2ViLWNvbXBvbmVudC50c2AgfSxcbiAgICAgICAgICAgICAgICBpbmplY3RUbzogJ2hlYWQnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAndmFhZGluOmluamVjdC1lbnRyeXBvaW50cy10by1pbmRleC1odG1sJyxcbiAgICAgICAgdHJhbnNmb3JtSW5kZXhIdG1sOiB7XG4gICAgICAgICAgb3JkZXI6ICdwcmUnLFxuICAgICAgICAgIGhhbmRsZXIoX2h0bWwsIHsgcGF0aCwgc2VydmVyIH0pIHtcbiAgICAgICAgICAgIGlmIChwYXRoICE9PSAnL2luZGV4Lmh0bWwnKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3Qgc2NyaXB0cyA9IFtdO1xuXG4gICAgICAgICAgICBpZiAoZGV2TW9kZSkge1xuICAgICAgICAgICAgICBzY3JpcHRzLnB1c2goe1xuICAgICAgICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXG4gICAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogJ21vZHVsZScsIHNyYzogYC9nZW5lcmF0ZWQvdml0ZS1kZXZtb2RlLnRzYCwgb25lcnJvcjogXCJkb2N1bWVudC5sb2NhdGlvbi5yZWxvYWQoKVwiIH0sXG4gICAgICAgICAgICAgICAgaW5qZWN0VG86ICdoZWFkJ1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNjcmlwdHMucHVzaCh7XG4gICAgICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXG4gICAgICAgICAgICAgIGF0dHJzOiB7IHR5cGU6ICdtb2R1bGUnLCBzcmM6ICcvZ2VuZXJhdGVkL3ZhYWRpbi50cycgfSxcbiAgICAgICAgICAgICAgaW5qZWN0VG86ICdoZWFkJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gc2NyaXB0cztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaGVja2VyKHtcbiAgICAgICAgdHlwZXNjcmlwdDogdHJ1ZVxuICAgICAgfSksXG4gICAgICBwcm9kdWN0aW9uTW9kZSAmJiB2aXN1YWxpemVyKHsgYnJvdGxpU2l6ZTogdHJ1ZSwgZmlsZW5hbWU6IGJ1bmRsZVNpemVGaWxlIH0pXG4gICAgICBcbiAgICBdXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3Qgb3ZlcnJpZGVWYWFkaW5Db25maWcgPSAoY3VzdG9tQ29uZmlnOiBVc2VyQ29uZmlnRm4pID0+IHtcbiAgcmV0dXJuIGRlZmluZUNvbmZpZygoZW52KSA9PiBtZXJnZUNvbmZpZyh2YWFkaW5Db25maWcoZW52KSwgY3VzdG9tQ29uZmlnKGVudikpKTtcbn07XG5mdW5jdGlvbiBnZXRWZXJzaW9uKG1vZHVsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFja2FnZUpzb24gPSBwYXRoLnJlc29sdmUobm9kZU1vZHVsZXNGb2xkZXIsIG1vZHVsZSwgJ3BhY2thZ2UuanNvbicpO1xuICByZXR1cm4gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGFja2FnZUpzb24sIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpLnZlcnNpb247XG59XG5mdW5jdGlvbiBnZXRDdmRsTmFtZShtb2R1bGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhY2thZ2VKc29uID0gcGF0aC5yZXNvbHZlKG5vZGVNb2R1bGVzRm9sZGVyLCBtb2R1bGUsICdwYWNrYWdlLmpzb24nKTtcbiAgcmV0dXJuIEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHBhY2thZ2VKc29uLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKS5jdmRsTmFtZTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbWVybGlcXFxcUHJvamVrdDNTZW1lc3RlclxcXFx0ZWFtMS5mcm9udGVuZDFcXFxcdGFyZ2V0XFxcXHBsdWdpbnNcXFxcYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtZXJsaVxcXFxQcm9qZWt0M1NlbWVzdGVyXFxcXHRlYW0xLmZyb250ZW5kMVxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFxhcHBsaWNhdGlvbi10aGVtZS1wbHVnaW5cXFxcdGhlbWUtaGFuZGxlLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9tZXJsaS9Qcm9qZWt0M1NlbWVzdGVyL3RlYW0xLmZyb250ZW5kMS90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtaGFuZGxlLmpzXCI7LypcbiAqIENvcHlyaWdodCAyMDAwLTIwMjQgVmFhZGluIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyBmdW5jdGlvbnMgZm9yIGxvb2sgdXAgYW5kIGhhbmRsZSB0aGUgdGhlbWUgcmVzb3VyY2VzXG4gKiBmb3IgYXBwbGljYXRpb24gdGhlbWUgcGx1Z2luLlxuICovXG5pbXBvcnQgeyBleGlzdHNTeW5jLCByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyB3cml0ZVRoZW1lRmlsZXMgfSBmcm9tICcuL3RoZW1lLWdlbmVyYXRvci5qcyc7XG5pbXBvcnQgeyBjb3B5U3RhdGljQXNzZXRzLCBjb3B5VGhlbWVSZXNvdXJjZXMgfSBmcm9tICcuL3RoZW1lLWNvcHkuanMnO1xuXG4vLyBtYXRjaGVzIHRoZW1lIG5hbWUgaW4gJy4vdGhlbWUtbXktdGhlbWUuZ2VuZXJhdGVkLmpzJ1xuY29uc3QgbmFtZVJlZ2V4ID0gL3RoZW1lLSguKilcXC5nZW5lcmF0ZWRcXC5qcy87XG5cbmxldCBwcmV2VGhlbWVOYW1lID0gdW5kZWZpbmVkO1xubGV0IGZpcnN0VGhlbWVOYW1lID0gdW5kZWZpbmVkO1xuXG4vKipcbiAqIExvb2tzIHVwIGZvciBhIHRoZW1lIHJlc291cmNlcyBpbiBhIGN1cnJlbnQgcHJvamVjdCBhbmQgaW4gamFyIGRlcGVuZGVuY2llcyxcbiAqIGNvcGllcyB0aGUgZm91bmQgcmVzb3VyY2VzIGFuZCBnZW5lcmF0ZXMvdXBkYXRlcyBtZXRhIGRhdGEgZm9yIHdlYnBhY2tcbiAqIGNvbXBpbGF0aW9uLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIGFwcGxpY2F0aW9uIHRoZW1lIHBsdWdpbiBtYW5kYXRvcnkgb3B0aW9ucyxcbiAqIEBzZWUge0BsaW5rIEFwcGxpY2F0aW9uVGhlbWVQbHVnaW59XG4gKlxuICogQHBhcmFtIGxvZ2dlciBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NUaGVtZVJlc291cmNlcyhvcHRpb25zLCBsb2dnZXIpIHtcbiAgY29uc3QgdGhlbWVOYW1lID0gZXh0cmFjdFRoZW1lTmFtZShvcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyKTtcbiAgaWYgKHRoZW1lTmFtZSkge1xuICAgIGlmICghcHJldlRoZW1lTmFtZSAmJiAhZmlyc3RUaGVtZU5hbWUpIHtcbiAgICAgIGZpcnN0VGhlbWVOYW1lID0gdGhlbWVOYW1lO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAocHJldlRoZW1lTmFtZSAmJiBwcmV2VGhlbWVOYW1lICE9PSB0aGVtZU5hbWUgJiYgZmlyc3RUaGVtZU5hbWUgIT09IHRoZW1lTmFtZSkgfHxcbiAgICAgICghcHJldlRoZW1lTmFtZSAmJiBmaXJzdFRoZW1lTmFtZSAhPT0gdGhlbWVOYW1lKVxuICAgICkge1xuICAgICAgLy8gV2FybmluZyBtZXNzYWdlIGlzIHNob3duIHRvIHRoZSBkZXZlbG9wZXIgd2hlbjpcbiAgICAgIC8vIDEuIEhlIGlzIHN3aXRjaGluZyB0byBhbnkgdGhlbWUsIHdoaWNoIGlzIGRpZmZlciBmcm9tIG9uZSBiZWluZyBzZXQgdXBcbiAgICAgIC8vIG9uIGFwcGxpY2F0aW9uIHN0YXJ0dXAsIGJ5IGNoYW5naW5nIHRoZW1lIG5hbWUgaW4gYEBUaGVtZSgpYFxuICAgICAgLy8gMi4gSGUgcmVtb3ZlcyBvciBjb21tZW50cyBvdXQgYEBUaGVtZSgpYCB0byBzZWUgaG93IHRoZSBhcHBcbiAgICAgIC8vIGxvb2tzIGxpa2Ugd2l0aG91dCB0aGVtaW5nLCBhbmQgdGhlbiBhZ2FpbiBicmluZ3MgYEBUaGVtZSgpYCBiYWNrXG4gICAgICAvLyB3aXRoIGEgdGhlbWVOYW1lIHdoaWNoIGlzIGRpZmZlciBmcm9tIG9uZSBiZWluZyBzZXQgdXAgb24gYXBwbGljYXRpb25cbiAgICAgIC8vIHN0YXJ0dXAuXG4gICAgICBjb25zdCB3YXJuaW5nID0gYEF0dGVudGlvbjogQWN0aXZlIHRoZW1lIGlzIHN3aXRjaGVkIHRvICcke3RoZW1lTmFtZX0nLmA7XG4gICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGBcbiAgICAgIE5vdGUgdGhhdCBhZGRpbmcgbmV3IHN0eWxlIHNoZWV0IGZpbGVzIHRvICcvdGhlbWVzLyR7dGhlbWVOYW1lfS9jb21wb25lbnRzJywgXG4gICAgICBtYXkgbm90IGJlIHRha2VuIGludG8gZWZmZWN0IHVudGlsIHRoZSBuZXh0IGFwcGxpY2F0aW9uIHJlc3RhcnQuXG4gICAgICBDaGFuZ2VzIHRvIGFscmVhZHkgZXhpc3Rpbmcgc3R5bGUgc2hlZXQgZmlsZXMgYXJlIGJlaW5nIHJlbG9hZGVkIGFzIGJlZm9yZS5gO1xuICAgICAgbG9nZ2VyLndhcm4oJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKTtcbiAgICAgIGxvZ2dlci53YXJuKHdhcm5pbmcpO1xuICAgICAgbG9nZ2VyLndhcm4oZGVzY3JpcHRpb24pO1xuICAgICAgbG9nZ2VyLndhcm4oJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKTtcbiAgICB9XG4gICAgcHJldlRoZW1lTmFtZSA9IHRoZW1lTmFtZTtcblxuICAgIGZpbmRUaGVtZUZvbGRlckFuZEhhbmRsZVRoZW1lKHRoZW1lTmFtZSwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUaGlzIGlzIG5lZWRlZCBpbiB0aGUgc2l0dWF0aW9uIHRoYXQgdGhlIHVzZXIgZGVjaWRlcyB0byBjb21tZW50IG9yXG4gICAgLy8gcmVtb3ZlIHRoZSBAVGhlbWUoLi4uKSBjb21wbGV0ZWx5IHRvIHNlZSBob3cgdGhlIGFwcGxpY2F0aW9uIGxvb2tzXG4gICAgLy8gd2l0aG91dCBhbnkgdGhlbWUuIFRoZW4gd2hlbiB0aGUgdXNlciBicmluZ3MgYmFjayBvbmUgb2YgdGhlIHRoZW1lcyxcbiAgICAvLyB0aGUgcHJldmlvdXMgdGhlbWUgc2hvdWxkIGJlIHVuZGVmaW5lZCB0byBlbmFibGUgdXMgdG8gZGV0ZWN0IHRoZSBjaGFuZ2UuXG4gICAgcHJldlRoZW1lTmFtZSA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIuZGVidWcoJ1NraXBwaW5nIFZhYWRpbiBhcHBsaWNhdGlvbiB0aGVtZSBoYW5kbGluZy4nKTtcbiAgICBsb2dnZXIudHJhY2UoJ01vc3QgbGlrZWx5IG5vIEBUaGVtZSBhbm5vdGF0aW9uIGZvciBhcHBsaWNhdGlvbiBvciBvbmx5IHRoZW1lQ2xhc3MgdXNlZC4nKTtcbiAgfVxufVxuXG4vKipcbiAqIFNlYXJjaCBmb3IgdGhlIGdpdmVuIHRoZW1lIGluIHRoZSBwcm9qZWN0IGFuZCByZXNvdXJjZSBmb2xkZXJzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZU5hbWUgbmFtZSBvZiB0aGVtZSB0byBmaW5kXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHBhcmFtIGxvZ2dlciBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbG9nZ2VyXG4gKiBAcmV0dXJuIHRydWUgb3IgZmFsc2UgZm9yIGlmIHRoZW1lIHdhcyBmb3VuZFxuICovXG5mdW5jdGlvbiBmaW5kVGhlbWVGb2xkZXJBbmRIYW5kbGVUaGVtZSh0aGVtZU5hbWUsIG9wdGlvbnMsIGxvZ2dlcikge1xuICBsZXQgdGhlbWVGb3VuZCA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVycy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHRoZW1lUHJvamVjdEZvbGRlciA9IG9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVyc1tpXTtcbiAgICBpZiAoZXhpc3RzU3luYyh0aGVtZVByb2plY3RGb2xkZXIpKSB7XG4gICAgICBsb2dnZXIuZGVidWcoXCJTZWFyY2hpbmcgdGhlbWVzIGZvbGRlciAnXCIgKyB0aGVtZVByb2plY3RGb2xkZXIgKyBcIicgZm9yIHRoZW1lICdcIiArIHRoZW1lTmFtZSArIFwiJ1wiKTtcbiAgICAgIGNvbnN0IGhhbmRsZWQgPSBoYW5kbGVUaGVtZXModGhlbWVOYW1lLCB0aGVtZVByb2plY3RGb2xkZXIsIG9wdGlvbnMsIGxvZ2dlcik7XG4gICAgICBpZiAoaGFuZGxlZCkge1xuICAgICAgICBpZiAodGhlbWVGb3VuZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiRm91bmQgdGhlbWUgZmlsZXMgaW4gJ1wiICtcbiAgICAgICAgICAgICAgdGhlbWVQcm9qZWN0Rm9sZGVyICtcbiAgICAgICAgICAgICAgXCInIGFuZCAnXCIgK1xuICAgICAgICAgICAgICB0aGVtZUZvdW5kICtcbiAgICAgICAgICAgICAgXCInLiBUaGVtZSBzaG91bGQgb25seSBiZSBhdmFpbGFibGUgaW4gb25lIGZvbGRlclwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBsb2dnZXIuZGVidWcoXCJGb3VuZCB0aGVtZSBmaWxlcyBmcm9tICdcIiArIHRoZW1lUHJvamVjdEZvbGRlciArIFwiJ1wiKTtcbiAgICAgICAgdGhlbWVGb3VuZCA9IHRoZW1lUHJvamVjdEZvbGRlcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZXhpc3RzU3luYyhvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIpKSB7XG4gICAgaWYgKHRoZW1lRm91bmQgJiYgZXhpc3RzU3luYyhyZXNvbHZlKG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciwgdGhlbWVOYW1lKSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJUaGVtZSAnXCIgK1xuICAgICAgICAgIHRoZW1lTmFtZSArXG4gICAgICAgICAgXCInc2hvdWxkIG5vdCBleGlzdCBpbnNpZGUgYSBqYXIgYW5kIGluIHRoZSBwcm9qZWN0IGF0IHRoZSBzYW1lIHRpbWVcXG5cIiArXG4gICAgICAgICAgJ0V4dGVuZGluZyBhbm90aGVyIHRoZW1lIGlzIHBvc3NpYmxlIGJ5IGFkZGluZyB7IFwicGFyZW50XCI6IFwibXktcGFyZW50LXRoZW1lXCIgfSBlbnRyeSB0byB0aGUgdGhlbWUuanNvbiBmaWxlIGluc2lkZSB5b3VyIHRoZW1lIGZvbGRlci4nXG4gICAgICApO1xuICAgIH1cbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICBcIlNlYXJjaGluZyB0aGVtZSBqYXIgcmVzb3VyY2UgZm9sZGVyICdcIiArIG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciArIFwiJyBmb3IgdGhlbWUgJ1wiICsgdGhlbWVOYW1lICsgXCInXCJcbiAgICApO1xuICAgIGhhbmRsZVRoZW1lcyh0aGVtZU5hbWUsIG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgICB0aGVtZUZvdW5kID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdGhlbWVGb3VuZDtcbn1cblxuLyoqXG4gKiBDb3BpZXMgc3RhdGljIHJlc291cmNlcyBmb3IgdGhlbWUgYW5kIGdlbmVyYXRlcy93cml0ZXMgdGhlXG4gKiBbdGhlbWUtbmFtZV0uZ2VuZXJhdGVkLmpzIGZvciB3ZWJwYWNrIHRvIGhhbmRsZS5cbiAqXG4gKiBOb3RlISBJZiBhIHBhcmVudCB0aGVtZSBpcyBkZWZpbmVkIGl0IHdpbGwgYWxzbyBiZSBoYW5kbGVkIGhlcmUgc28gdGhhdCB0aGUgcGFyZW50IHRoZW1lIGdlbmVyYXRlZCBmaWxlIGlzXG4gKiBnZW5lcmF0ZWQgaW4gYWR2YW5jZSBvZiB0aGUgdGhlbWUgZ2VuZXJhdGVkIGZpbGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBuYW1lIG9mIHRoZW1lIHRvIGhhbmRsZVxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lc0ZvbGRlciBmb2xkZXIgY29udGFpbmluZyBhcHBsaWNhdGlvbiB0aGVtZSBmb2xkZXJzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyIGluc3RhbmNlXG4gKlxuICogQHRocm93cyBFcnJvciBpZiBwYXJlbnQgdGhlbWUgZGVmaW5lZCwgYnV0IGNhbid0IGxvY2F0ZSBwYXJlbnQgdGhlbWVcbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZW1lIHdhcyBmb3VuZCBlbHNlIGZhbHNlLlxuICovXG5mdW5jdGlvbiBoYW5kbGVUaGVtZXModGhlbWVOYW1lLCB0aGVtZXNGb2xkZXIsIG9wdGlvbnMsIGxvZ2dlcikge1xuICBjb25zdCB0aGVtZUZvbGRlciA9IHJlc29sdmUodGhlbWVzRm9sZGVyLCB0aGVtZU5hbWUpO1xuICBpZiAoZXhpc3RzU3luYyh0aGVtZUZvbGRlcikpIHtcbiAgICBsb2dnZXIuZGVidWcoJ0ZvdW5kIHRoZW1lICcsIHRoZW1lTmFtZSwgJyBpbiBmb2xkZXIgJywgdGhlbWVGb2xkZXIpO1xuXG4gICAgY29uc3QgdGhlbWVQcm9wZXJ0aWVzID0gZ2V0VGhlbWVQcm9wZXJ0aWVzKHRoZW1lRm9sZGVyKTtcblxuICAgIC8vIElmIHRoZW1lIGhhcyBwYXJlbnQgaGFuZGxlIHBhcmVudCB0aGVtZSBpbW1lZGlhdGVseS5cbiAgICBpZiAodGhlbWVQcm9wZXJ0aWVzLnBhcmVudCkge1xuICAgICAgY29uc3QgZm91bmQgPSBmaW5kVGhlbWVGb2xkZXJBbmRIYW5kbGVUaGVtZSh0aGVtZVByb3BlcnRpZXMucGFyZW50LCBvcHRpb25zLCBsb2dnZXIpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJDb3VsZCBub3QgbG9jYXRlIGZpbGVzIGZvciBkZWZpbmVkIHBhcmVudCB0aGVtZSAnXCIgK1xuICAgICAgICAgICAgdGhlbWVQcm9wZXJ0aWVzLnBhcmVudCArXG4gICAgICAgICAgICBcIicuXFxuXCIgK1xuICAgICAgICAgICAgJ1BsZWFzZSB2ZXJpZnkgdGhhdCBkZXBlbmRlbmN5IGlzIGFkZGVkIG9yIHRoZW1lIGZvbGRlciBleGlzdHMuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBjb3B5U3RhdGljQXNzZXRzKHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zLnByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIGxvZ2dlcik7XG4gICAgY29weVRoZW1lUmVzb3VyY2VzKHRoZW1lRm9sZGVyLCBvcHRpb25zLnByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIGxvZ2dlcik7XG5cbiAgICB3cml0ZVRoZW1lRmlsZXModGhlbWVGb2xkZXIsIHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW1lUHJvcGVydGllcyh0aGVtZUZvbGRlcikge1xuICBjb25zdCB0aGVtZVByb3BlcnR5RmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsICd0aGVtZS5qc29uJyk7XG4gIGlmICghZXhpc3RzU3luYyh0aGVtZVByb3BlcnR5RmlsZSkpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgY29uc3QgdGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZyA9IHJlYWRGaWxlU3luYyh0aGVtZVByb3BlcnR5RmlsZSk7XG4gIGlmICh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICByZXR1cm4gSlNPTi5wYXJzZSh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nKTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0cyBjdXJyZW50IHRoZW1lIG5hbWUgZnJvbSBhdXRvLWdlbmVyYXRlZCAndGhlbWUuanMnIGZpbGUgbG9jYXRlZCBvbiBhXG4gKiBnaXZlbiBmb2xkZXIuXG4gKiBAcGFyYW0gZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIgZm9sZGVyIGluIHByb2plY3QgY29udGFpbmluZyAndGhlbWUuanMnIGZpbGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGN1cnJlbnQgdGhlbWUgbmFtZVxuICovXG5mdW5jdGlvbiBleHRyYWN0VGhlbWVOYW1lKGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyKSB7XG4gIGlmICghZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIkNvdWxkbid0IGV4dHJhY3QgdGhlbWUgbmFtZSBmcm9tICd0aGVtZS5qcycsXCIgK1xuICAgICAgICAnIGJlY2F1c2UgdGhlIHBhdGggdG8gZm9sZGVyIGNvbnRhaW5pbmcgdGhpcyBmaWxlIGlzIGVtcHR5LiBQbGVhc2Ugc2V0JyArXG4gICAgICAgICcgdGhlIGEgY29ycmVjdCBmb2xkZXIgcGF0aCBpbiBBcHBsaWNhdGlvblRoZW1lUGx1Z2luIGNvbnN0cnVjdG9yJyArXG4gICAgICAgICcgcGFyYW1ldGVycy4nXG4gICAgKTtcbiAgfVxuICBjb25zdCBnZW5lcmF0ZWRUaGVtZUZpbGUgPSByZXNvbHZlKGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCAndGhlbWUuanMnKTtcbiAgaWYgKGV4aXN0c1N5bmMoZ2VuZXJhdGVkVGhlbWVGaWxlKSkge1xuICAgIC8vIHJlYWQgdGhlbWUgbmFtZSBmcm9tIHRoZSAnZ2VuZXJhdGVkL3RoZW1lLmpzJyBhcyB0aGVyZSB3ZSBhbHdheXNcbiAgICAvLyBtYXJrIHRoZSB1c2VkIHRoZW1lIGZvciB3ZWJwYWNrIHRvIGhhbmRsZS5cbiAgICBjb25zdCB0aGVtZU5hbWUgPSBuYW1lUmVnZXguZXhlYyhyZWFkRmlsZVN5bmMoZ2VuZXJhdGVkVGhlbWVGaWxlLCB7IGVuY29kaW5nOiAndXRmOCcgfSkpWzFdO1xuICAgIGlmICghdGhlbWVOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBwYXJzZSB0aGVtZSBuYW1lIGZyb20gJ1wiICsgZ2VuZXJhdGVkVGhlbWVGaWxlICsgXCInLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoZW1lTmFtZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuLyoqXG4gKiBGaW5kcyBhbGwgdGhlIHBhcmVudCB0aGVtZXMgbG9jYXRlZCBpbiB0aGUgcHJvamVjdCB0aGVtZXMgZm9sZGVycyBhbmQgaW5cbiAqIHRoZSBKQVIgZGVwZW5kZW5jaWVzIHdpdGggcmVzcGVjdCB0byB0aGUgZ2l2ZW4gY3VzdG9tIHRoZW1lIHdpdGhcbiAqIHtAY29kZSB0aGVtZU5hbWV9LlxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBnaXZlbiBjdXN0b20gdGhlbWUgbmFtZSB0byBsb29rIHBhcmVudHMgZm9yXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHJldHVybnMge3N0cmluZ1tdfSBhcnJheSBvZiBwYXRocyB0byBmb3VuZCBwYXJlbnQgdGhlbWVzIHdpdGggcmVzcGVjdCB0byB0aGVcbiAqIGdpdmVuIGN1c3RvbSB0aGVtZVxuICovXG5mdW5jdGlvbiBmaW5kUGFyZW50VGhlbWVzKHRoZW1lTmFtZSwgb3B0aW9ucykge1xuICBjb25zdCBleGlzdGluZ1RoZW1lRm9sZGVycyA9IFtvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIsIC4uLm9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVyc10uZmlsdGVyKChmb2xkZXIpID0+XG4gICAgZXhpc3RzU3luYyhmb2xkZXIpXG4gICk7XG4gIHJldHVybiBjb2xsZWN0UGFyZW50VGhlbWVzKHRoZW1lTmFtZSwgZXhpc3RpbmdUaGVtZUZvbGRlcnMsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdFBhcmVudFRoZW1lcyh0aGVtZU5hbWUsIHRoZW1lRm9sZGVycywgaXNQYXJlbnQpIHtcbiAgbGV0IGZvdW5kUGFyZW50VGhlbWVzID0gW107XG4gIHRoZW1lRm9sZGVycy5mb3JFYWNoKChmb2xkZXIpID0+IHtcbiAgICBjb25zdCB0aGVtZUZvbGRlciA9IHJlc29sdmUoZm9sZGVyLCB0aGVtZU5hbWUpO1xuICAgIGlmIChleGlzdHNTeW5jKHRoZW1lRm9sZGVyKSkge1xuICAgICAgY29uc3QgdGhlbWVQcm9wZXJ0aWVzID0gZ2V0VGhlbWVQcm9wZXJ0aWVzKHRoZW1lRm9sZGVyKTtcblxuICAgICAgaWYgKHRoZW1lUHJvcGVydGllcy5wYXJlbnQpIHtcbiAgICAgICAgZm91bmRQYXJlbnRUaGVtZXMucHVzaCguLi5jb2xsZWN0UGFyZW50VGhlbWVzKHRoZW1lUHJvcGVydGllcy5wYXJlbnQsIHRoZW1lRm9sZGVycywgdHJ1ZSkpO1xuICAgICAgICBpZiAoIWZvdW5kUGFyZW50VGhlbWVzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiQ291bGQgbm90IGxvY2F0ZSBmaWxlcyBmb3IgZGVmaW5lZCBwYXJlbnQgdGhlbWUgJ1wiICtcbiAgICAgICAgICAgICAgdGhlbWVQcm9wZXJ0aWVzLnBhcmVudCArXG4gICAgICAgICAgICAgIFwiJy5cXG5cIiArXG4gICAgICAgICAgICAgICdQbGVhc2UgdmVyaWZ5IHRoYXQgZGVwZW5kZW5jeSBpcyBhZGRlZCBvciB0aGVtZSBmb2xkZXIgZXhpc3RzLidcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBBZGQgYSB0aGVtZSBwYXRoIHRvIHJlc3VsdCBjb2xsZWN0aW9uIG9ubHkgaWYgYSBnaXZlbiB0aGVtZU5hbWVcbiAgICAgIC8vIGlzIHN1cHBvc2VkIHRvIGJlIGEgcGFyZW50IHRoZW1lXG4gICAgICBpZiAoaXNQYXJlbnQpIHtcbiAgICAgICAgZm91bmRQYXJlbnRUaGVtZXMucHVzaCh0aGVtZUZvbGRlcik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZvdW5kUGFyZW50VGhlbWVzO1xufVxuXG5leHBvcnQgeyBwcm9jZXNzVGhlbWVSZXNvdXJjZXMsIGV4dHJhY3RUaGVtZU5hbWUsIGZpbmRQYXJlbnRUaGVtZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbWVybGlcXFxcUHJvamVrdDNTZW1lc3RlclxcXFx0ZWFtMS5mcm9udGVuZDFcXFxcdGFyZ2V0XFxcXHBsdWdpbnNcXFxcYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtZXJsaVxcXFxQcm9qZWt0M1NlbWVzdGVyXFxcXHRlYW0xLmZyb250ZW5kMVxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFxhcHBsaWNhdGlvbi10aGVtZS1wbHVnaW5cXFxcdGhlbWUtZ2VuZXJhdG9yLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9tZXJsaS9Qcm9qZWt0M1NlbWVzdGVyL3RlYW0xLmZyb250ZW5kMS90YXJnZXQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtZ2VuZXJhdG9yLmpzXCI7LypcbiAqIENvcHlyaWdodCAyMDAwLTIwMjQgVmFhZGluIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgZmlsZSBoYW5kbGVzIHRoZSBnZW5lcmF0aW9uIG9mIHRoZSAnW3RoZW1lLW5hbWVdLmpzJyB0b1xuICogdGhlIHRoZW1lcy9bdGhlbWUtbmFtZV0gZm9sZGVyIGFjY29yZGluZyB0byBwcm9wZXJ0aWVzIGZyb20gJ3RoZW1lLmpzb24nLlxuICovXG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGNoZWNrTW9kdWxlcyB9IGZyb20gJy4vdGhlbWUtY29weS5qcyc7XG5cbi8vIFNwZWNpYWwgZm9sZGVyIGluc2lkZSBhIHRoZW1lIGZvciBjb21wb25lbnQgdGhlbWVzIHRoYXQgZ28gaW5zaWRlIHRoZSBjb21wb25lbnQgc2hhZG93IHJvb3RcbmNvbnN0IHRoZW1lQ29tcG9uZW50c0ZvbGRlciA9ICdjb21wb25lbnRzJztcbi8vIFRoZSBjb250ZW50cyBvZiBhIGdsb2JhbCBDU1MgZmlsZSB3aXRoIHRoaXMgbmFtZSBpbiBhIHRoZW1lIGlzIGFsd2F5cyBhZGRlZCB0b1xuLy8gdGhlIGRvY3VtZW50LiBFLmcuIEBmb250LWZhY2UgbXVzdCBiZSBpbiB0aGlzXG5jb25zdCBkb2N1bWVudENzc0ZpbGVuYW1lID0gJ2RvY3VtZW50LmNzcyc7XG4vLyBzdHlsZXMuY3NzIGlzIHRoZSBvbmx5IGVudHJ5cG9pbnQgY3NzIGZpbGUgd2l0aCBkb2N1bWVudC5jc3MuIEV2ZXJ5dGhpbmcgZWxzZSBzaG91bGQgYmUgaW1wb3J0ZWQgdXNpbmcgY3NzIEBpbXBvcnRcbmNvbnN0IHN0eWxlc0Nzc0ZpbGVuYW1lID0gJ3N0eWxlcy5jc3MnO1xuXG5jb25zdCBDU1NJTVBPUlRfQ09NTUVOVCA9ICdDU1NJbXBvcnQgZW5kJztcbmNvbnN0IGhlYWRlckltcG9ydCA9IGBpbXBvcnQgJ2NvbnN0cnVjdC1zdHlsZS1zaGVldHMtcG9seWZpbGwnO1xuYDtcblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgW3RoZW1lTmFtZV0uanMgZmlsZSBmb3IgdGhlbWVGb2xkZXIgd2hpY2ggY29sbGVjdHMgYWxsIHJlcXVpcmVkIGluZm9ybWF0aW9uIGZyb20gdGhlIGZvbGRlci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhlbWVGb2xkZXIgZm9sZGVyIG9mIHRoZSB0aGVtZVxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBuYW1lIG9mIHRoZSBoYW5kbGVkIHRoZW1lXG4gKiBAcGFyYW0ge0pTT059IHRoZW1lUHJvcGVydGllcyBjb250ZW50IG9mIHRoZW1lLmpzb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIGJ1aWxkIG9wdGlvbnMgKGUuZy4gcHJvZCBvciBkZXYgbW9kZSlcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZW1lIGZpbGUgY29udGVudFxuICovXG5mdW5jdGlvbiB3cml0ZVRoZW1lRmlsZXModGhlbWVGb2xkZXIsIHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHByb2R1Y3Rpb25Nb2RlID0gIW9wdGlvbnMuZGV2TW9kZTtcbiAgY29uc3QgdXNlRGV2U2VydmVyT3JJblByb2R1Y3Rpb25Nb2RlID0gIW9wdGlvbnMudXNlRGV2QnVuZGxlO1xuICBjb25zdCBvdXRwdXRGb2xkZXIgPSBvcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyO1xuICBjb25zdCBzdHlsZXMgPSByZXNvbHZlKHRoZW1lRm9sZGVyLCBzdHlsZXNDc3NGaWxlbmFtZSk7XG4gIGNvbnN0IGRvY3VtZW50Q3NzRmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsIGRvY3VtZW50Q3NzRmlsZW5hbWUpO1xuICBjb25zdCBhdXRvSW5qZWN0Q29tcG9uZW50cyA9IHRoZW1lUHJvcGVydGllcy5hdXRvSW5qZWN0Q29tcG9uZW50cyA/PyB0cnVlO1xuICBjb25zdCBhdXRvSW5qZWN0R2xvYmFsQ3NzSW1wb3J0cyA9IHRoZW1lUHJvcGVydGllcy5hdXRvSW5qZWN0R2xvYmFsQ3NzSW1wb3J0cyA/PyBmYWxzZTtcbiAgY29uc3QgZ2xvYmFsRmlsZW5hbWUgPSAndGhlbWUtJyArIHRoZW1lTmFtZSArICcuZ2xvYmFsLmdlbmVyYXRlZC5qcyc7XG4gIGNvbnN0IGNvbXBvbmVudHNGaWxlbmFtZSA9ICd0aGVtZS0nICsgdGhlbWVOYW1lICsgJy5jb21wb25lbnRzLmdlbmVyYXRlZC5qcyc7XG4gIGNvbnN0IHRoZW1lRmlsZW5hbWUgPSAndGhlbWUtJyArIHRoZW1lTmFtZSArICcuZ2VuZXJhdGVkLmpzJztcblxuICBsZXQgdGhlbWVGaWxlQ29udGVudCA9IGhlYWRlckltcG9ydDtcbiAgbGV0IGdsb2JhbEltcG9ydENvbnRlbnQgPSAnLy8gV2hlbiB0aGlzIGZpbGUgaXMgaW1wb3J0ZWQsIGdsb2JhbCBzdHlsZXMgYXJlIGF1dG9tYXRpY2FsbHkgYXBwbGllZFxcbic7XG4gIGxldCBjb21wb25lbnRzRmlsZUNvbnRlbnQgPSAnJztcbiAgdmFyIGNvbXBvbmVudHNGaWxlcztcblxuICBpZiAoYXV0b0luamVjdENvbXBvbmVudHMpIHtcbiAgICBjb21wb25lbnRzRmlsZXMgPSBnbG9iU3luYygnKi5jc3MnLCB7XG4gICAgICBjd2Q6IHJlc29sdmUodGhlbWVGb2xkZXIsIHRoZW1lQ29tcG9uZW50c0ZvbGRlciksXG4gICAgICBub2RpcjogdHJ1ZVxuICAgIH0pO1xuXG4gICAgaWYgKGNvbXBvbmVudHNGaWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICBjb21wb25lbnRzRmlsZUNvbnRlbnQgKz1cbiAgICAgICAgXCJpbXBvcnQgeyB1bnNhZmVDU1MsIHJlZ2lzdGVyU3R5bGVzIH0gZnJvbSAnQHZhYWRpbi92YWFkaW4tdGhlbWFibGUtbWl4aW4vcmVnaXN0ZXItc3R5bGVzJztcXG5cIjtcbiAgICB9XG4gIH1cblxuICBpZiAodGhlbWVQcm9wZXJ0aWVzLnBhcmVudCkge1xuICAgIHRoZW1lRmlsZUNvbnRlbnQgKz0gYGltcG9ydCB7IGFwcGx5VGhlbWUgYXMgYXBwbHlCYXNlVGhlbWUgfSBmcm9tICcuL3RoZW1lLSR7dGhlbWVQcm9wZXJ0aWVzLnBhcmVudH0uZ2VuZXJhdGVkLmpzJztcXG5gO1xuICB9XG5cbiAgdGhlbWVGaWxlQ29udGVudCArPSBgaW1wb3J0IHsgaW5qZWN0R2xvYmFsQ3NzIH0gZnJvbSAnRnJvbnRlbmQvZ2VuZXJhdGVkL2phci1yZXNvdXJjZXMvdGhlbWUtdXRpbC5qcyc7XFxuYDtcbiAgdGhlbWVGaWxlQ29udGVudCArPSBgaW1wb3J0IHsgd2ViY29tcG9uZW50R2xvYmFsQ3NzSW5qZWN0b3IgfSBmcm9tICdGcm9udGVuZC9nZW5lcmF0ZWQvamFyLXJlc291cmNlcy90aGVtZS11dGlsLmpzJztcXG5gO1xuICB0aGVtZUZpbGVDb250ZW50ICs9IGBpbXBvcnQgJy4vJHtjb21wb25lbnRzRmlsZW5hbWV9JztcXG5gO1xuXG4gIHRoZW1lRmlsZUNvbnRlbnQgKz0gYGxldCBuZWVkc1JlbG9hZE9uQ2hhbmdlcyA9IGZhbHNlO1xcbmA7XG4gIGNvbnN0IGltcG9ydHMgPSBbXTtcbiAgY29uc3QgY29tcG9uZW50Q3NzSW1wb3J0cyA9IFtdO1xuICBjb25zdCBnbG9iYWxGaWxlQ29udGVudCA9IFtdO1xuICBjb25zdCBnbG9iYWxDc3NDb2RlID0gW107XG4gIGNvbnN0IHNoYWRvd09ubHlDc3MgPSBbXTtcbiAgY29uc3QgY29tcG9uZW50Q3NzQ29kZSA9IFtdO1xuICBjb25zdCBwYXJlbnRUaGVtZSA9IHRoZW1lUHJvcGVydGllcy5wYXJlbnQgPyAnYXBwbHlCYXNlVGhlbWUodGFyZ2V0KTtcXG4nIDogJyc7XG4gIGNvbnN0IHBhcmVudFRoZW1lR2xvYmFsSW1wb3J0ID0gdGhlbWVQcm9wZXJ0aWVzLnBhcmVudFxuICAgID8gYGltcG9ydCAnLi90aGVtZS0ke3RoZW1lUHJvcGVydGllcy5wYXJlbnR9Lmdsb2JhbC5nZW5lcmF0ZWQuanMnO1xcbmBcbiAgICA6ICcnO1xuXG4gIGNvbnN0IHRoZW1lSWRlbnRpZmllciA9ICdfdmFhZGludGhlbWVfJyArIHRoZW1lTmFtZSArICdfJztcbiAgY29uc3QgbHVtb0Nzc0ZsYWcgPSAnX3ZhYWRpbnRoZW1lbHVtb2ltcG9ydHNfJztcbiAgY29uc3QgZ2xvYmFsQ3NzRmxhZyA9IHRoZW1lSWRlbnRpZmllciArICdnbG9iYWxDc3MnO1xuICBjb25zdCBjb21wb25lbnRDc3NGbGFnID0gdGhlbWVJZGVudGlmaWVyICsgJ2NvbXBvbmVudENzcyc7XG5cbiAgaWYgKCFleGlzdHNTeW5jKHN0eWxlcykpIHtcbiAgICBpZiAocHJvZHVjdGlvbk1vZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc3R5bGVzLmNzcyBmaWxlIGlzIG1pc3NpbmcgYW5kIGlzIG5lZWRlZCBmb3IgJyR7dGhlbWVOYW1lfScgaW4gZm9sZGVyICcke3RoZW1lRm9sZGVyfSdgKTtcbiAgICB9XG4gICAgd3JpdGVGaWxlU3luYyhcbiAgICAgIHN0eWxlcyxcbiAgICAgICcvKiBJbXBvcnQgeW91ciBhcHBsaWNhdGlvbiBnbG9iYWwgY3NzIGZpbGVzIGhlcmUgb3IgYWRkIHRoZSBzdHlsZXMgZGlyZWN0bHkgdG8gdGhpcyBmaWxlICovJyxcbiAgICAgICd1dGY4J1xuICAgICk7XG4gIH1cblxuICAvLyBzdHlsZXMuY3NzIHdpbGwgYWx3YXlzIGJlIGF2YWlsYWJsZSBhcyB3ZSB3cml0ZSBvbmUgaWYgaXQgZG9lc24ndCBleGlzdC5cbiAgbGV0IGZpbGVuYW1lID0gYmFzZW5hbWUoc3R5bGVzKTtcbiAgbGV0IHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcblxuICAvKiBMVU1PICovXG4gIGNvbnN0IGx1bW9JbXBvcnRzID0gdGhlbWVQcm9wZXJ0aWVzLmx1bW9JbXBvcnRzIHx8IFsndHlwb2dyYXBoeScsICdjb2xvcicsICdzcGFjaW5nJywgJ2JhZGdlJywgJ3V0aWxpdHknXSA7XG4gIGlmIChsdW1vSW1wb3J0cykge1xuICAgIGx1bW9JbXBvcnRzLmZvckVhY2goKGx1bW9JbXBvcnQpID0+IHtcbiAgICAgIGltcG9ydHMucHVzaChgaW1wb3J0IHsgJHtsdW1vSW1wb3J0fSB9IGZyb20gJ0B2YWFkaW4vdmFhZGluLWx1bW8tc3R5bGVzLyR7bHVtb0ltcG9ydH0uanMnO1xcbmApO1xuICAgICAgaWYgKGx1bW9JbXBvcnQgPT09ICd1dGlsaXR5JyB8fCBsdW1vSW1wb3J0ID09PSAnYmFkZ2UnIHx8IGx1bW9JbXBvcnQgPT09ICd0eXBvZ3JhcGh5JyB8fCBsdW1vSW1wb3J0ID09PSAnY29sb3InKSB7XG4gICAgICAgIC8vIEluamVjdCBpbnRvIG1haW4gZG9jdW1lbnQgdGhlIHNhbWUgd2F5IGFzIG90aGVyIEx1bW8gc3R5bGVzIGFyZSBpbmplY3RlZFxuICAgICAgICAvLyBMdW1vIGltcG9ydHMgZ28gdG8gdGhlIHRoZW1lIGdsb2JhbCBpbXBvcnRzIGZpbGUgdG8gcHJldmVudCBzdHlsZSBsZWFrc1xuICAgICAgICAvLyB3aGVuIHRoZSB0aGVtZSBpcyBhcHBsaWVkIHRvIGFuIGVtYmVkZGVkIGNvbXBvbmVudFxuICAgICAgICBnbG9iYWxGaWxlQ29udGVudC5wdXNoKGBpbXBvcnQgJ0B2YWFkaW4vdmFhZGluLWx1bW8tc3R5bGVzLyR7bHVtb0ltcG9ydH0tZ2xvYmFsLmpzJztcXG5gKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGx1bW9JbXBvcnRzLmZvckVhY2goKGx1bW9JbXBvcnQpID0+IHtcbiAgICAgIC8vIEx1bW8gaXMgaW5qZWN0ZWQgdG8gdGhlIGRvY3VtZW50IGJ5IEx1bW8gaXRzZWxmXG4gICAgICBzaGFkb3dPbmx5Q3NzLnB1c2goYHJlbW92ZXJzLnB1c2goaW5qZWN0R2xvYmFsQ3NzKCR7bHVtb0ltcG9ydH0uY3NzVGV4dCwgJycsIHRhcmdldCwgdHJ1ZSkpO1xcbmApO1xuICAgIH0pO1xuICB9XG5cbiAgLyogVGhlbWUgKi9cbiAgaWYgKHVzZURldlNlcnZlck9ySW5Qcm9kdWN0aW9uTW9kZSkge1xuICAgIGdsb2JhbEZpbGVDb250ZW50LnB1c2gocGFyZW50VGhlbWVHbG9iYWxJbXBvcnQpO1xuICAgIGdsb2JhbEZpbGVDb250ZW50LnB1c2goYGltcG9ydCAndGhlbWVzLyR7dGhlbWVOYW1lfS8ke2ZpbGVuYW1lfSc7XFxuYCk7XG5cbiAgICBpbXBvcnRzLnB1c2goYGltcG9ydCAke3ZhcmlhYmxlfSBmcm9tICd0aGVtZXMvJHt0aGVtZU5hbWV9LyR7ZmlsZW5hbWV9P2lubGluZSc7XFxuYCk7XG4gICAgc2hhZG93T25seUNzcy5wdXNoKGByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke3ZhcmlhYmxlfS50b1N0cmluZygpLCAnJywgdGFyZ2V0KSk7XFxuICAgIGApO1xuICB9XG4gIGlmIChleGlzdHNTeW5jKGRvY3VtZW50Q3NzRmlsZSkpIHtcbiAgICBmaWxlbmFtZSA9IGJhc2VuYW1lKGRvY3VtZW50Q3NzRmlsZSk7XG4gICAgdmFyaWFibGUgPSBjYW1lbENhc2UoZmlsZW5hbWUpO1xuXG4gICAgaWYgKHVzZURldlNlcnZlck9ySW5Qcm9kdWN0aW9uTW9kZSkge1xuICAgICAgZ2xvYmFsRmlsZUNvbnRlbnQucHVzaChgaW1wb3J0ICd0aGVtZXMvJHt0aGVtZU5hbWV9LyR7ZmlsZW5hbWV9JztcXG5gKTtcblxuICAgICAgaW1wb3J0cy5wdXNoKGBpbXBvcnQgJHt2YXJpYWJsZX0gZnJvbSAndGhlbWVzLyR7dGhlbWVOYW1lfS8ke2ZpbGVuYW1lfT9pbmxpbmUnO1xcbmApO1xuICAgICAgc2hhZG93T25seUNzcy5wdXNoKGByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke3ZhcmlhYmxlfS50b1N0cmluZygpLCcnLCBkb2N1bWVudCkpO1xcbiAgICBgKTtcbiAgICB9XG4gIH1cblxuICBsZXQgaSA9IDA7XG4gIGlmICh0aGVtZVByb3BlcnRpZXMuZG9jdW1lbnRDc3MpIHtcbiAgICBjb25zdCBtaXNzaW5nTW9kdWxlcyA9IGNoZWNrTW9kdWxlcyh0aGVtZVByb3BlcnRpZXMuZG9jdW1lbnRDc3MpO1xuICAgIGlmIChtaXNzaW5nTW9kdWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgXCJNaXNzaW5nIG5wbSBtb2R1bGVzIG9yIGZpbGVzICdcIiArXG4gICAgICAgICAgbWlzc2luZ01vZHVsZXMuam9pbihcIicsICdcIikgK1xuICAgICAgICAgIFwiJyBmb3IgZG9jdW1lbnRDc3MgbWFya2VkIGluICd0aGVtZS5qc29uJy5cXG5cIiArXG4gICAgICAgICAgXCJJbnN0YWxsIG9yIHVwZGF0ZSBwYWNrYWdlKHMpIGJ5IGFkZGluZyBhIEBOcG1QYWNrYWdlIGFubm90YXRpb24gb3IgaW5zdGFsbCBpdCB1c2luZyAnbnBtL3BucG0vYnVuIGknXCJcbiAgICAgICk7XG4gICAgfVxuICAgIHRoZW1lUHJvcGVydGllcy5kb2N1bWVudENzcy5mb3JFYWNoKChjc3NJbXBvcnQpID0+IHtcbiAgICAgIGNvbnN0IHZhcmlhYmxlID0gJ21vZHVsZScgKyBpKys7XG4gICAgICBpbXBvcnRzLnB1c2goYGltcG9ydCAke3ZhcmlhYmxlfSBmcm9tICcke2Nzc0ltcG9ydH0/aW5saW5lJztcXG5gKTtcbiAgICAgIC8vIER1ZSB0byBjaHJvbWUgYnVnIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTMzNjg3NiBmb250LWZhY2Ugd2lsbCBub3Qgd29ya1xuICAgICAgLy8gaW5zaWRlIHNoYWRvd1Jvb3Qgc28gd2UgbmVlZCB0byBpbmplY3QgaXQgdGhlcmUgYWxzby5cbiAgICAgIGdsb2JhbENzc0NvZGUucHVzaChgaWYodGFyZ2V0ICE9PSBkb2N1bWVudCkge1xuICAgICAgICByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke3ZhcmlhYmxlfS50b1N0cmluZygpLCAnJywgdGFyZ2V0KSk7XG4gICAgfVxcbiAgICBgKTtcbiAgICAgIGdsb2JhbENzc0NvZGUucHVzaChcbiAgICAgICAgYHJlbW92ZXJzLnB1c2goaW5qZWN0R2xvYmFsQ3NzKCR7dmFyaWFibGV9LnRvU3RyaW5nKCksICcke0NTU0lNUE9SVF9DT01NRU5UfScsIGRvY3VtZW50KSk7XFxuICAgIGBcbiAgICAgICk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKHRoZW1lUHJvcGVydGllcy5pbXBvcnRDc3MpIHtcbiAgICBjb25zdCBtaXNzaW5nTW9kdWxlcyA9IGNoZWNrTW9kdWxlcyh0aGVtZVByb3BlcnRpZXMuaW1wb3J0Q3NzKTtcbiAgICBpZiAobWlzc2luZ01vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgIFwiTWlzc2luZyBucG0gbW9kdWxlcyBvciBmaWxlcyAnXCIgK1xuICAgICAgICAgIG1pc3NpbmdNb2R1bGVzLmpvaW4oXCInLCAnXCIpICtcbiAgICAgICAgICBcIicgZm9yIGltcG9ydENzcyBtYXJrZWQgaW4gJ3RoZW1lLmpzb24nLlxcblwiICtcbiAgICAgICAgICBcIkluc3RhbGwgb3IgdXBkYXRlIHBhY2thZ2UocykgYnkgYWRkaW5nIGEgQE5wbVBhY2thZ2UgYW5ub3RhdGlvbiBvciBpbnN0YWxsIGl0IHVzaW5nICducG0vcG5wbS9idW4gaSdcIlxuICAgICAgKTtcbiAgICB9XG4gICAgdGhlbWVQcm9wZXJ0aWVzLmltcG9ydENzcy5mb3JFYWNoKChjc3NQYXRoKSA9PiB7XG4gICAgICBjb25zdCB2YXJpYWJsZSA9ICdtb2R1bGUnICsgaSsrO1xuICAgICAgZ2xvYmFsRmlsZUNvbnRlbnQucHVzaChgaW1wb3J0ICcke2Nzc1BhdGh9JztcXG5gKTtcbiAgICAgIGltcG9ydHMucHVzaChgaW1wb3J0ICR7dmFyaWFibGV9IGZyb20gJyR7Y3NzUGF0aH0/aW5saW5lJztcXG5gKTtcbiAgICAgIHNoYWRvd09ubHlDc3MucHVzaChgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwgJyR7Q1NTSU1QT1JUX0NPTU1FTlR9JywgdGFyZ2V0KSk7XFxuYCk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoYXV0b0luamVjdENvbXBvbmVudHMpIHtcbiAgICBjb21wb25lbnRzRmlsZXMuZm9yRWFjaCgoY29tcG9uZW50Q3NzKSA9PiB7XG4gICAgICBjb25zdCBmaWxlbmFtZSA9IGJhc2VuYW1lKGNvbXBvbmVudENzcyk7XG4gICAgICBjb25zdCB0YWcgPSBmaWxlbmFtZS5yZXBsYWNlKCcuY3NzJywgJycpO1xuICAgICAgY29uc3QgdmFyaWFibGUgPSBjYW1lbENhc2UoZmlsZW5hbWUpO1xuICAgICAgY29tcG9uZW50Q3NzSW1wb3J0cy5wdXNoKFxuICAgICAgICBgaW1wb3J0ICR7dmFyaWFibGV9IGZyb20gJ3RoZW1lcy8ke3RoZW1lTmFtZX0vJHt0aGVtZUNvbXBvbmVudHNGb2xkZXJ9LyR7ZmlsZW5hbWV9P2lubGluZSc7XFxuYFxuICAgICAgKTtcbiAgICAgIC8vIERvbid0IGZvcm1hdCBhcyB0aGUgZ2VuZXJhdGVkIGZpbGUgZm9ybWF0dGluZyB3aWxsIGdldCB3b25reSFcbiAgICAgIGNvbnN0IGNvbXBvbmVudFN0cmluZyA9IGByZWdpc3RlclN0eWxlcyhcbiAgICAgICAgJyR7dGFnfScsXG4gICAgICAgIHVuc2FmZUNTUygke3ZhcmlhYmxlfS50b1N0cmluZygpKVxuICAgICAgKTtcbiAgICAgIGA7XG4gICAgICBjb21wb25lbnRDc3NDb2RlLnB1c2goY29tcG9uZW50U3RyaW5nKTtcbiAgICB9KTtcbiAgfVxuXG4gIHRoZW1lRmlsZUNvbnRlbnQgKz0gaW1wb3J0cy5qb2luKCcnKTtcblxuICAvLyBEb24ndCBmb3JtYXQgYXMgdGhlIGdlbmVyYXRlZCBmaWxlIGZvcm1hdHRpbmcgd2lsbCBnZXQgd29ua3khXG4gIC8vIElmIHRhcmdldHMgY2hlY2sgdGhhdCB3ZSBvbmx5IHJlZ2lzdGVyIHRoZSBzdHlsZSBwYXJ0cyBvbmNlLCBjaGVja3MgZXhpc3QgZm9yIGdsb2JhbCBjc3MgYW5kIGNvbXBvbmVudCBjc3NcbiAgY29uc3QgdGhlbWVGaWxlQXBwbHkgPSBgXG4gIGxldCB0aGVtZVJlbW92ZXJzID0gbmV3IFdlYWtNYXAoKTtcbiAgbGV0IHRhcmdldHMgPSBbXTtcblxuICBleHBvcnQgY29uc3QgYXBwbHlUaGVtZSA9ICh0YXJnZXQpID0+IHtcbiAgICBjb25zdCByZW1vdmVycyA9IFtdO1xuICAgIGlmICh0YXJnZXQgIT09IGRvY3VtZW50KSB7XG4gICAgICAke3NoYWRvd09ubHlDc3Muam9pbignJyl9XG4gICAgICAke2F1dG9JbmplY3RHbG9iYWxDc3NJbXBvcnRzID8gYFxuICAgICAgICB3ZWJjb21wb25lbnRHbG9iYWxDc3NJbmplY3RvcigoY3NzKSA9PiB7XG4gICAgICAgICAgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoY3NzLCAnJywgdGFyZ2V0KSk7XG4gICAgICAgIH0pO1xuICAgICAgICBgIDogJyd9XG4gICAgfVxuICAgICR7cGFyZW50VGhlbWV9XG4gICAgJHtnbG9iYWxDc3NDb2RlLmpvaW4oJycpfVxuXG4gICAgaWYgKGltcG9ydC5tZXRhLmhvdCkge1xuICAgICAgdGFyZ2V0cy5wdXNoKG5ldyBXZWFrUmVmKHRhcmdldCkpO1xuICAgICAgdGhlbWVSZW1vdmVycy5zZXQodGFyZ2V0LCByZW1vdmVycyk7XG4gICAgfVxuXG4gIH1cblxuYDtcbiAgY29tcG9uZW50c0ZpbGVDb250ZW50ICs9IGBcbiR7Y29tcG9uZW50Q3NzSW1wb3J0cy5qb2luKCcnKX1cblxuaWYgKCFkb2N1bWVudFsnJHtjb21wb25lbnRDc3NGbGFnfSddKSB7XG4gICR7Y29tcG9uZW50Q3NzQ29kZS5qb2luKCcnKX1cbiAgZG9jdW1lbnRbJyR7Y29tcG9uZW50Q3NzRmxhZ30nXSA9IHRydWU7XG59XG5cbmlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgaW1wb3J0Lm1ldGEuaG90LmFjY2VwdCgobW9kdWxlKSA9PiB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9KTtcbn1cblxuYDtcblxuICB0aGVtZUZpbGVDb250ZW50ICs9IHRoZW1lRmlsZUFwcGx5O1xuICB0aGVtZUZpbGVDb250ZW50ICs9IGBcbmlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgaW1wb3J0Lm1ldGEuaG90LmFjY2VwdCgobW9kdWxlKSA9PiB7XG5cbiAgICBpZiAobmVlZHNSZWxvYWRPbkNoYW5nZXMpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldFJlZiA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRhcmdldFJlZi5kZXJlZigpO1xuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgdGhlbWVSZW1vdmVycy5nZXQodGFyZ2V0KS5mb3JFYWNoKHJlbW92ZXIgPT4gcmVtb3ZlcigpKVxuICAgICAgICAgIG1vZHVsZS5hcHBseVRoZW1lKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KTtcblxuICBpbXBvcnQubWV0YS5ob3Qub24oJ3ZpdGU6YWZ0ZXJVcGRhdGUnLCAodXBkYXRlKSA9PiB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3ZhYWRpbi10aGVtZS11cGRhdGVkJywgeyBkZXRhaWw6IHVwZGF0ZSB9KSk7XG4gIH0pO1xufVxuXG5gO1xuXG4gIGdsb2JhbEltcG9ydENvbnRlbnQgKz0gYFxuJHtnbG9iYWxGaWxlQ29udGVudC5qb2luKCcnKX1cbmA7XG5cbiAgd3JpdGVJZkNoYW5nZWQocmVzb2x2ZShvdXRwdXRGb2xkZXIsIGdsb2JhbEZpbGVuYW1lKSwgZ2xvYmFsSW1wb3J0Q29udGVudCk7XG4gIHdyaXRlSWZDaGFuZ2VkKHJlc29sdmUob3V0cHV0Rm9sZGVyLCB0aGVtZUZpbGVuYW1lKSwgdGhlbWVGaWxlQ29udGVudCk7XG4gIHdyaXRlSWZDaGFuZ2VkKHJlc29sdmUob3V0cHV0Rm9sZGVyLCBjb21wb25lbnRzRmlsZW5hbWUpLCBjb21wb25lbnRzRmlsZUNvbnRlbnQpO1xufVxuXG5mdW5jdGlvbiB3cml0ZUlmQ2hhbmdlZChmaWxlLCBkYXRhKSB7XG4gIGlmICghZXhpc3RzU3luYyhmaWxlKSB8fCByZWFkRmlsZVN5bmMoZmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSAhPT0gZGF0YSkge1xuICAgIHdyaXRlRmlsZVN5bmMoZmlsZSwgZGF0YSk7XG4gIH1cbn1cblxuLyoqXG4gKiBNYWtlIGdpdmVuIHN0cmluZyBpbnRvIGNhbWVsQ2FzZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIHN0cmluZyB0byBtYWtlIGludG8gY2FtZUNhc2VcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNhbWVsQ2FzZWQgdmVyc2lvblxuICovXG5mdW5jdGlvbiBjYW1lbENhc2Uoc3RyKSB7XG4gIHJldHVybiBzdHJcbiAgICAucmVwbGFjZSgvKD86Xlxcd3xbQS1aXXxcXGJcXHcpL2csIGZ1bmN0aW9uICh3b3JkLCBpbmRleCkge1xuICAgICAgcmV0dXJuIGluZGV4ID09PSAwID8gd29yZC50b0xvd2VyQ2FzZSgpIDogd29yZC50b1VwcGVyQ2FzZSgpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoL1xccysvZywgJycpXG4gICAgLnJlcGxhY2UoL1xcLnxcXC0vZywgJycpO1xufVxuXG5leHBvcnQgeyB3cml0ZVRoZW1lRmlsZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbWVybGlcXFxcUHJvamVrdDNTZW1lc3RlclxcXFx0ZWFtMS5mcm9udGVuZDFcXFxcdGFyZ2V0XFxcXHBsdWdpbnNcXFxcYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtZXJsaVxcXFxQcm9qZWt0M1NlbWVzdGVyXFxcXHRlYW0xLmZyb250ZW5kMVxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFxhcHBsaWNhdGlvbi10aGVtZS1wbHVnaW5cXFxcdGhlbWUtY29weS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbWVybGkvUHJvamVrdDNTZW1lc3Rlci90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luL3RoZW1lLWNvcHkuanNcIjsvKlxuICogQ29weXJpZ2h0IDIwMDAtMjAyNCBWYWFkaW4gTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90XG4gKiB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZlxuICogdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVRcbiAqIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZVxuICogTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXJcbiAqIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogVGhpcyBjb250YWlucyBmdW5jdGlvbnMgYW5kIGZlYXR1cmVzIHVzZWQgdG8gY29weSB0aGVtZSBmaWxlcy5cbiAqL1xuXG5pbXBvcnQgeyByZWFkZGlyU3luYywgc3RhdFN5bmMsIG1rZGlyU3luYywgZXhpc3RzU3luYywgY29weUZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUsIHJlbGF0aXZlLCBleHRuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InO1xuXG5jb25zdCBpZ25vcmVkRmlsZUV4dGVuc2lvbnMgPSBbJy5jc3MnLCAnLmpzJywgJy5qc29uJ107XG5cbi8qKlxuICogQ29weSB0aGVtZSBzdGF0aWMgcmVzb3VyY2VzIHRvIHN0YXRpYyBhc3NldHMgZm9sZGVyLiBBbGwgZmlsZXMgaW4gdGhlIHRoZW1lXG4gKiBmb2xkZXIgd2lsbCBiZSBjb3BpZWQgZXhjbHVkaW5nIGNzcywganMgYW5kIGpzb24gZmlsZXMgdGhhdCB3aWxsIGJlXG4gKiBoYW5kbGVkIGJ5IHdlYnBhY2sgYW5kIG5vdCBiZSBzaGFyZWQgYXMgc3RhdGljIGZpbGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZUZvbGRlciBGb2xkZXIgd2l0aCB0aGVtZSBmaWxlXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciByZXNvdXJjZXMgb3V0cHV0IGZvbGRlclxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIGNvcHlUaGVtZVJlc291cmNlcyh0aGVtZUZvbGRlciwgcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciwgbG9nZ2VyKSB7XG4gIGNvbnN0IHN0YXRpY0Fzc2V0c1RoZW1lRm9sZGVyID0gcmVzb2x2ZShwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCAndGhlbWVzJywgYmFzZW5hbWUodGhlbWVGb2xkZXIpKTtcbiAgY29uc3QgY29sbGVjdGlvbiA9IGNvbGxlY3RGb2xkZXJzKHRoZW1lRm9sZGVyLCBsb2dnZXIpO1xuXG4gIC8vIE9ubHkgY3JlYXRlIGFzc2V0cyBmb2xkZXIgaWYgdGhlcmUgYXJlIGZpbGVzIHRvIGNvcHkuXG4gIGlmIChjb2xsZWN0aW9uLmZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICBta2RpclN5bmMoc3RhdGljQXNzZXRzVGhlbWVGb2xkZXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgIC8vIGNyZWF0ZSBmb2xkZXJzIHdpdGhcbiAgICBjb2xsZWN0aW9uLmRpcmVjdG9yaWVzLmZvckVhY2goKGRpcmVjdG9yeSkgPT4ge1xuICAgICAgY29uc3QgcmVsYXRpdmVEaXJlY3RvcnkgPSByZWxhdGl2ZSh0aGVtZUZvbGRlciwgZGlyZWN0b3J5KTtcbiAgICAgIGNvbnN0IHRhcmdldERpcmVjdG9yeSA9IHJlc29sdmUoc3RhdGljQXNzZXRzVGhlbWVGb2xkZXIsIHJlbGF0aXZlRGlyZWN0b3J5KTtcblxuICAgICAgbWtkaXJTeW5jKHRhcmdldERpcmVjdG9yeSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgfSk7XG5cbiAgICBjb2xsZWN0aW9uLmZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlRmlsZSA9IHJlbGF0aXZlKHRoZW1lRm9sZGVyLCBmaWxlKTtcbiAgICAgIGNvbnN0IHRhcmdldEZpbGUgPSByZXNvbHZlKHN0YXRpY0Fzc2V0c1RoZW1lRm9sZGVyLCByZWxhdGl2ZUZpbGUpO1xuICAgICAgY29weUZpbGVJZkFic2VudE9yTmV3ZXIoZmlsZSwgdGFyZ2V0RmlsZSwgbG9nZ2VyKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbGxlY3QgYWxsIGZvbGRlcnMgd2l0aCBjb3B5YWJsZSBmaWxlcyBhbmQgYWxsIGZpbGVzIHRvIGJlIGNvcGllZC5cbiAqIEZvbGVkIHdpbGwgbm90IGJlIGFkZGVkIGlmIG5vIGZpbGVzIGluIGZvbGRlciBvciBzdWJmb2xkZXJzLlxuICpcbiAqIEZpbGVzIHdpbGwgbm90IGNvbnRhaW4gZmlsZXMgd2l0aCBpZ25vcmVkIGV4dGVuc2lvbnMgYW5kIGZvbGRlcnMgb25seSBjb250YWluaW5nIGlnbm9yZWQgZmlsZXMgd2lsbCBub3QgYmUgYWRkZWQuXG4gKlxuICogQHBhcmFtIGZvbGRlclRvQ29weSBmb2xkZXIgd2Ugd2lsbCBjb3B5IGZpbGVzIGZyb21cbiAqIEBwYXJhbSBsb2dnZXIgcGx1Z2luIGxvZ2dlclxuICogQHJldHVybiB7e2RpcmVjdG9yaWVzOiBbXSwgZmlsZXM6IFtdfX0gb2JqZWN0IGNvbnRhaW5pbmcgZGlyZWN0b3JpZXMgdG8gY3JlYXRlIGFuZCBmaWxlcyB0byBjb3B5XG4gKi9cbmZ1bmN0aW9uIGNvbGxlY3RGb2xkZXJzKGZvbGRlclRvQ29weSwgbG9nZ2VyKSB7XG4gIGNvbnN0IGNvbGxlY3Rpb24gPSB7IGRpcmVjdG9yaWVzOiBbXSwgZmlsZXM6IFtdIH07XG4gIGxvZ2dlci50cmFjZSgnZmlsZXMgaW4gZGlyZWN0b3J5JywgcmVhZGRpclN5bmMoZm9sZGVyVG9Db3B5KSk7XG4gIHJlYWRkaXJTeW5jKGZvbGRlclRvQ29weSkuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgIGNvbnN0IGZpbGVUb0NvcHkgPSByZXNvbHZlKGZvbGRlclRvQ29weSwgZmlsZSk7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChzdGF0U3luYyhmaWxlVG9Db3B5KS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnR29pbmcgdGhyb3VnaCBkaXJlY3RvcnknLCBmaWxlVG9Db3B5KTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29sbGVjdEZvbGRlcnMoZmlsZVRvQ29weSwgbG9nZ2VyKTtcbiAgICAgICAgaWYgKHJlc3VsdC5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3Rvcmllcy5wdXNoKGZpbGVUb0NvcHkpO1xuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQWRkaW5nIGRpcmVjdG9yeScsIGZpbGVUb0NvcHkpO1xuICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0b3JpZXMucHVzaC5hcHBseShjb2xsZWN0aW9uLmRpcmVjdG9yaWVzLCByZXN1bHQuZGlyZWN0b3JpZXMpO1xuICAgICAgICAgIGNvbGxlY3Rpb24uZmlsZXMucHVzaC5hcHBseShjb2xsZWN0aW9uLmZpbGVzLCByZXN1bHQuZmlsZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFpZ25vcmVkRmlsZUV4dGVuc2lvbnMuaW5jbHVkZXMoZXh0bmFtZShmaWxlVG9Db3B5KSkpIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdBZGRpbmcgZmlsZScsIGZpbGVUb0NvcHkpO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbGVzLnB1c2goZmlsZVRvQ29weSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGhhbmRsZU5vU3VjaEZpbGVFcnJvcihmaWxlVG9Db3B5LCBlcnJvciwgbG9nZ2VyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gY29sbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBDb3B5IGFueSBzdGF0aWMgbm9kZV9tb2R1bGVzIGFzc2V0cyBtYXJrZWQgaW4gdGhlbWUuanNvbiB0b1xuICogcHJvamVjdCBzdGF0aWMgYXNzZXRzIGZvbGRlci5cbiAqXG4gKiBUaGUgdGhlbWUuanNvbiBjb250ZW50IGZvciBhc3NldHMgaXMgc2V0IHVwIGFzOlxuICoge1xuICogICBhc3NldHM6IHtcbiAqICAgICBcIm5vZGVfbW9kdWxlIGlkZW50aWZpZXJcIjoge1xuICogICAgICAgXCJjb3B5LXJ1bGVcIjogXCJ0YXJnZXQvZm9sZGVyXCIsXG4gKiAgICAgfVxuICogICB9XG4gKiB9XG4gKlxuICogVGhpcyB3b3VsZCBtZWFuIHRoYXQgYW4gYXNzZXQgd291bGQgYmUgYnVpbHQgYXM6XG4gKiBcIkBmb3J0YXdlc29tZS9mb250YXdlc29tZS1mcmVlXCI6IHtcbiAqICAgXCJzdmdzL3JlZ3VsYXIvKipcIjogXCJmb3J0YXdlc29tZS9pY29uc1wiXG4gKiB9XG4gKiBXaGVyZSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLWZyZWUnIGlzIHRoZSBucG0gcGFja2FnZSwgJ3N2Z3MvcmVndWxhci8qKicgaXMgd2hhdCBzaG91bGQgYmUgY29waWVkXG4gKiBhbmQgJ2ZvcnRhd2Vzb21lL2ljb25zJyBpcyB0aGUgdGFyZ2V0IGRpcmVjdG9yeSB1bmRlciBwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyIHdoZXJlIHRoaW5nc1xuICogd2lsbCBnZXQgY29waWVkIHRvLlxuICpcbiAqIE5vdGUhIHRoZXJlIGNhbiBiZSBtdWx0aXBsZSBjb3B5LXJ1bGVzIHdpdGggdGFyZ2V0IGZvbGRlcnMgZm9yIG9uZSBucG0gcGFja2FnZSBhc3NldC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhlbWVOYW1lIG5hbWUgb2YgdGhlIHRoZW1lIHdlIGFyZSBjb3B5aW5nIGFzc2V0cyBmb3JcbiAqIEBwYXJhbSB7anNvbn0gdGhlbWVQcm9wZXJ0aWVzIHRoZW1lIHByb3BlcnRpZXMganNvbiB3aXRoIGRhdGEgb24gYXNzZXRzXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciBwcm9qZWN0IG91dHB1dCBmb2xkZXIgd2hlcmUgd2UgY29weSBhc3NldHMgdG8gdW5kZXIgdGhlbWUvW3RoZW1lTmFtZV1cbiAqIEBwYXJhbSB7b2JqZWN0fSBsb2dnZXIgcGx1Z2luIGxvZ2dlclxuICovXG5mdW5jdGlvbiBjb3B5U3RhdGljQXNzZXRzKHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCBsb2dnZXIpIHtcbiAgY29uc3QgYXNzZXRzID0gdGhlbWVQcm9wZXJ0aWVzWydhc3NldHMnXTtcbiAgaWYgKCFhc3NldHMpIHtcbiAgICBsb2dnZXIuZGVidWcoJ25vIGFzc2V0cyB0byBoYW5kbGUgbm8gc3RhdGljIGFzc2V0cyB3ZXJlIGNvcGllZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG1rZGlyU3luYyhwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCB7XG4gICAgcmVjdXJzaXZlOiB0cnVlXG4gIH0pO1xuICBjb25zdCBtaXNzaW5nTW9kdWxlcyA9IGNoZWNrTW9kdWxlcyhPYmplY3Qua2V5cyhhc3NldHMpKTtcbiAgaWYgKG1pc3NpbmdNb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBFcnJvcihcbiAgICAgIFwiTWlzc2luZyBucG0gbW9kdWxlcyAnXCIgK1xuICAgICAgICBtaXNzaW5nTW9kdWxlcy5qb2luKFwiJywgJ1wiKSArXG4gICAgICAgIFwiJyBmb3IgYXNzZXRzIG1hcmtlZCBpbiAndGhlbWUuanNvbicuXFxuXCIgK1xuICAgICAgICBcIkluc3RhbGwgcGFja2FnZShzKSBieSBhZGRpbmcgYSBATnBtUGFja2FnZSBhbm5vdGF0aW9uIG9yIGluc3RhbGwgaXQgdXNpbmcgJ25wbS9wbnBtL2J1biBpJ1wiXG4gICAgKTtcbiAgfVxuICBPYmplY3Qua2V5cyhhc3NldHMpLmZvckVhY2goKG1vZHVsZSkgPT4ge1xuICAgIGNvbnN0IGNvcHlSdWxlcyA9IGFzc2V0c1ttb2R1bGVdO1xuICAgIE9iamVjdC5rZXlzKGNvcHlSdWxlcykuZm9yRWFjaCgoY29weVJ1bGUpID0+IHtcbiAgICAgIGNvbnN0IG5vZGVTb3VyY2VzID0gcmVzb2x2ZSgnbm9kZV9tb2R1bGVzLycsIG1vZHVsZSwgY29weVJ1bGUpO1xuICAgICAgY29uc3QgZmlsZXMgPSBnbG9iU3luYyhub2RlU291cmNlcywgeyBub2RpcjogdHJ1ZSB9KTtcbiAgICAgIGNvbnN0IHRhcmdldEZvbGRlciA9IHJlc29sdmUocHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciwgJ3RoZW1lcycsIHRoZW1lTmFtZSwgY29weVJ1bGVzW2NvcHlSdWxlXSk7XG5cbiAgICAgIG1rZGlyU3luYyh0YXJnZXRGb2xkZXIsIHtcbiAgICAgICAgcmVjdXJzaXZlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgY29uc3QgY29weVRhcmdldCA9IHJlc29sdmUodGFyZ2V0Rm9sZGVyLCBiYXNlbmFtZShmaWxlKSk7XG4gICAgICAgIGNvcHlGaWxlSWZBYnNlbnRPck5ld2VyKGZpbGUsIGNvcHlUYXJnZXQsIGxvZ2dlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrTW9kdWxlcyhtb2R1bGVzKSB7XG4gIGNvbnN0IG1pc3NpbmcgPSBbXTtcblxuICBtb2R1bGVzLmZvckVhY2goKG1vZHVsZSkgPT4ge1xuICAgIGlmICghZXhpc3RzU3luYyhyZXNvbHZlKCdub2RlX21vZHVsZXMvJywgbW9kdWxlKSkpIHtcbiAgICAgIG1pc3NpbmcucHVzaChtb2R1bGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG1pc3Npbmc7XG59XG5cbi8qKlxuICogQ29waWVzIGdpdmVuIGZpbGUgdG8gYSBnaXZlbiB0YXJnZXQgcGF0aCwgaWYgdGFyZ2V0IGZpbGUgZG9lc24ndCBleGlzdCBvciBpZlxuICogZmlsZSB0byBjb3B5IGlzIG5ld2VyLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVUb0NvcHkgcGF0aCBvZiB0aGUgZmlsZSB0byBjb3B5XG4gKiBAcGFyYW0ge3N0cmluZ30gY29weVRhcmdldCBwYXRoIG9mIHRoZSB0YXJnZXQgZmlsZVxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIGNvcHlGaWxlSWZBYnNlbnRPck5ld2VyKGZpbGVUb0NvcHksIGNvcHlUYXJnZXQsIGxvZ2dlcikge1xuICB0cnkge1xuICAgIGlmICghZXhpc3RzU3luYyhjb3B5VGFyZ2V0KSB8fCBzdGF0U3luYyhjb3B5VGFyZ2V0KS5tdGltZSA8IHN0YXRTeW5jKGZpbGVUb0NvcHkpLm10aW1lKSB7XG4gICAgICBsb2dnZXIudHJhY2UoJ0NvcHlpbmc6ICcsIGZpbGVUb0NvcHksICc9PicsIGNvcHlUYXJnZXQpO1xuICAgICAgY29weUZpbGVTeW5jKGZpbGVUb0NvcHksIGNvcHlUYXJnZXQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBoYW5kbGVOb1N1Y2hGaWxlRXJyb3IoZmlsZVRvQ29weSwgZXJyb3IsIGxvZ2dlcik7XG4gIH1cbn1cblxuLy8gSWdub3JlcyBlcnJvcnMgZHVlIHRvIGZpbGUgbWlzc2luZyBkdXJpbmcgdGhlbWUgcHJvY2Vzc2luZ1xuLy8gVGhpcyBtYXkgaGFwcGVuIGZvciBleGFtcGxlIHdoZW4gYW4gSURFIGNyZWF0ZXMgYSB0ZW1wb3JhcnkgZmlsZVxuLy8gYW5kIHRoZW4gaW1tZWRpYXRlbHkgZGVsZXRlcyBpdFxuZnVuY3Rpb24gaGFuZGxlTm9TdWNoRmlsZUVycm9yKGZpbGUsIGVycm9yLCBsb2dnZXIpIHtcbiAgaWYgKGVycm9yLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgbG9nZ2VyLndhcm4oJ0lnbm9yaW5nIG5vdCBleGlzdGluZyBmaWxlICcgKyBmaWxlICsgJy4gRmlsZSBtYXkgaGF2ZSBiZWVuIGRlbGV0ZWQgZHVyaW5nIHRoZW1lIHByb2Nlc3NpbmcuJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuZXhwb3J0IHsgY2hlY2tNb2R1bGVzLCBjb3B5U3RhdGljQXNzZXRzLCBjb3B5VGhlbWVSZXNvdXJjZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbWVybGlcXFxcUHJvamVrdDNTZW1lc3RlclxcXFx0ZWFtMS5mcm9udGVuZDFcXFxcdGFyZ2V0XFxcXHBsdWdpbnNcXFxcdGhlbWUtbG9hZGVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtZXJsaVxcXFxQcm9qZWt0M1NlbWVzdGVyXFxcXHRlYW0xLmZyb250ZW5kMVxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFx0aGVtZS1sb2FkZXJcXFxcdGhlbWUtbG9hZGVyLXV0aWxzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9tZXJsaS9Qcm9qZWt0M1NlbWVzdGVyL3RlYW0xLmZyb250ZW5kMS90YXJnZXQvcGx1Z2lucy90aGVtZS1sb2FkZXIvdGhlbWUtbG9hZGVyLXV0aWxzLmpzXCI7aW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGdsb2JTeW5jIH0gZnJvbSAnZ2xvYic7XG5cbi8vIENvbGxlY3QgZ3JvdXBzIFt1cmwoXSBbJ3xcIl1vcHRpb25hbCAnLi98Li4vJywgb3RoZXIgJy4uLycgc2VnbWVudHMgb3B0aW9uYWwsIGZpbGUgcGFydCBhbmQgZW5kIG9mIHVybFxuLy8gVGhlIGFkZGl0aW9uYWwgZG90IHNlZ21lbnRzIGNvdWxkIGJlIFVSTCByZWZlcmVuY2luZyBhc3NldHMgaW4gbmVzdGVkIGltcG9ydGVkIENTU1xuLy8gV2hlbiBWaXRlIGlubGluZXMgQ1NTIGltcG9ydCBpdCBkb2VzIG5vdCByZXdyaXRlIHJlbGF0aXZlIFVSTCBmb3Igbm90LXJlc29sdmFibGUgcmVzb3VyY2Vcbi8vIHNvIHRoZSBmaW5hbCBDU1MgZW5kcyB1cCB3aXRoIHdyb25nIHJlbGF0aXZlIFVSTHMgKHIuZy4gLi4vLi4vcGtnL2ljb24uc3ZnKVxuLy8gSWYgdGhlIFVSTCBpcyByZWxhdGl2ZSwgd2Ugc2hvdWxkIHRyeSB0byBjaGVjayBpZiBpdCBpcyBhbiBhc3NldCBieSBpZ25vcmluZyB0aGUgYWRkaXRpb25hbCBkb3Qgc2VnbWVudHNcbmNvbnN0IHVybE1hdGNoZXIgPSAvKHVybFxcKFxccyopKFxcJ3xcXFwiKT8oXFwuXFwvfFxcLlxcLlxcLykoKD86XFwzKSopPyhcXFMqKShcXDJcXHMqXFwpKS9nO1xuXG5mdW5jdGlvbiBhc3NldHNDb250YWlucyhmaWxlVXJsLCB0aGVtZUZvbGRlciwgbG9nZ2VyKSB7XG4gIGNvbnN0IHRoZW1lUHJvcGVydGllcyA9IGdldFRoZW1lUHJvcGVydGllcyh0aGVtZUZvbGRlcik7XG4gIGlmICghdGhlbWVQcm9wZXJ0aWVzKSB7XG4gICAgbG9nZ2VyLmRlYnVnKCdObyB0aGVtZSBwcm9wZXJ0aWVzIGZvdW5kLicpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBhc3NldHMgPSB0aGVtZVByb3BlcnRpZXNbJ2Fzc2V0cyddO1xuICBpZiAoIWFzc2V0cykge1xuICAgIGxvZ2dlci5kZWJ1ZygnTm8gZGVmaW5lZCBhc3NldHMgaW4gdGhlbWUgcHJvcGVydGllcycpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBHbyB0aHJvdWdoIGVhY2ggYXNzZXQgbW9kdWxlXG4gIGZvciAobGV0IG1vZHVsZSBvZiBPYmplY3Qua2V5cyhhc3NldHMpKSB7XG4gICAgY29uc3QgY29weVJ1bGVzID0gYXNzZXRzW21vZHVsZV07XG4gICAgLy8gR28gdGhyb3VnaCBlYWNoIGNvcHkgcnVsZVxuICAgIGZvciAobGV0IGNvcHlSdWxlIG9mIE9iamVjdC5rZXlzKGNvcHlSdWxlcykpIHtcbiAgICAgIC8vIGlmIGZpbGUgc3RhcnRzIHdpdGggY29weVJ1bGUgdGFyZ2V0IGNoZWNrIGlmIGZpbGUgd2l0aCBwYXRoIGFmdGVyIGNvcHkgdGFyZ2V0IGNhbiBiZSBmb3VuZFxuICAgICAgaWYgKGZpbGVVcmwuc3RhcnRzV2l0aChjb3B5UnVsZXNbY29weVJ1bGVdKSkge1xuICAgICAgICBjb25zdCB0YXJnZXRGaWxlID0gZmlsZVVybC5yZXBsYWNlKGNvcHlSdWxlc1tjb3B5UnVsZV0sICcnKTtcbiAgICAgICAgY29uc3QgZmlsZXMgPSBnbG9iU3luYyhyZXNvbHZlKCdub2RlX21vZHVsZXMvJywgbW9kdWxlLCBjb3B5UnVsZSksIHsgbm9kaXI6IHRydWUgfSk7XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgIGlmIChmaWxlLmVuZHNXaXRoKHRhcmdldEZpbGUpKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW1lUHJvcGVydGllcyh0aGVtZUZvbGRlcikge1xuICBjb25zdCB0aGVtZVByb3BlcnR5RmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsICd0aGVtZS5qc29uJyk7XG4gIGlmICghZXhpc3RzU3luYyh0aGVtZVByb3BlcnR5RmlsZSkpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgY29uc3QgdGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZyA9IHJlYWRGaWxlU3luYyh0aGVtZVByb3BlcnR5RmlsZSk7XG4gIGlmICh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICByZXR1cm4gSlNPTi5wYXJzZSh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nKTtcbn1cblxuZnVuY3Rpb24gcmV3cml0ZUNzc1VybHMoc291cmNlLCBoYW5kbGVkUmVzb3VyY2VGb2xkZXIsIHRoZW1lRm9sZGVyLCBsb2dnZXIsIG9wdGlvbnMpIHtcbiAgc291cmNlID0gc291cmNlLnJlcGxhY2UodXJsTWF0Y2hlciwgZnVuY3Rpb24gKG1hdGNoLCB1cmwsIHF1b3RlTWFyaywgcmVwbGFjZSwgYWRkaXRpb25hbERvdFNlZ21lbnRzLCBmaWxlVXJsLCBlbmRTdHJpbmcpIHtcbiAgICBsZXQgYWJzb2x1dGVQYXRoID0gcmVzb2x2ZShoYW5kbGVkUmVzb3VyY2VGb2xkZXIsIHJlcGxhY2UsIGFkZGl0aW9uYWxEb3RTZWdtZW50cyB8fCAnJywgZmlsZVVybCk7XG4gICAgbGV0IGV4aXN0aW5nVGhlbWVSZXNvdXJjZSA9IGFic29sdXRlUGF0aC5zdGFydHNXaXRoKHRoZW1lRm9sZGVyKSAmJiBleGlzdHNTeW5jKGFic29sdXRlUGF0aCk7XG4gICAgaWYgKCFleGlzdGluZ1RoZW1lUmVzb3VyY2UgJiYgYWRkaXRpb25hbERvdFNlZ21lbnRzKSB7XG4gICAgICAvLyBUcnkgdG8gcmVzb2x2ZSBwYXRoIHdpdGhvdXQgZG90IHNlZ21lbnRzIGFzIGl0IG1heSBiZSBhbiB1bnJlc29sdmFibGVcbiAgICAgIC8vIHJlbGF0aXZlIFVSTCBmcm9tIGFuIGlubGluZWQgbmVzdGVkIENTU1xuICAgICAgYWJzb2x1dGVQYXRoID0gcmVzb2x2ZShoYW5kbGVkUmVzb3VyY2VGb2xkZXIsIHJlcGxhY2UsIGZpbGVVcmwpO1xuICAgICAgZXhpc3RpbmdUaGVtZVJlc291cmNlID0gYWJzb2x1dGVQYXRoLnN0YXJ0c1dpdGgodGhlbWVGb2xkZXIpICYmIGV4aXN0c1N5bmMoYWJzb2x1dGVQYXRoKTtcbiAgICB9XG4gICAgY29uc3QgaXNBc3NldCA9IGFzc2V0c0NvbnRhaW5zKGZpbGVVcmwsIHRoZW1lRm9sZGVyLCBsb2dnZXIpO1xuICAgIGlmIChleGlzdGluZ1RoZW1lUmVzb3VyY2UgfHwgaXNBc3NldCkge1xuICAgICAgLy8gQWRkaW5nIC4vIHdpbGwgc2tpcCBjc3MtbG9hZGVyLCB3aGljaCBzaG91bGQgYmUgZG9uZSBmb3IgYXNzZXQgZmlsZXNcbiAgICAgIC8vIEluIGEgcHJvZHVjdGlvbiBidWlsZCwgdGhlIGNzcyBmaWxlIGlzIGluIFZBQURJTi9idWlsZCBhbmQgc3RhdGljIGZpbGVzIGFyZSBpbiBWQUFESU4vc3RhdGljLCBzbyAuLi9zdGF0aWMgbmVlZHMgdG8gYmUgYWRkZWRcbiAgICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gb3B0aW9ucy5kZXZNb2RlID8gJy4vJyA6ICcuLi9zdGF0aWMvJztcblxuICAgICAgY29uc3Qgc2tpcExvYWRlciA9IGV4aXN0aW5nVGhlbWVSZXNvdXJjZSA/ICcnIDogcmVwbGFjZW1lbnQ7XG4gICAgICBjb25zdCBmcm9udGVuZFRoZW1lRm9sZGVyID0gc2tpcExvYWRlciArICd0aGVtZXMvJyArIGJhc2VuYW1lKHRoZW1lRm9sZGVyKTtcbiAgICAgIGxvZ2dlci5sb2coXG4gICAgICAgICdVcGRhdGluZyB1cmwgZm9yIGZpbGUnLFxuICAgICAgICBcIidcIiArIHJlcGxhY2UgKyBmaWxlVXJsICsgXCInXCIsXG4gICAgICAgICd0byB1c2UnLFxuICAgICAgICBcIidcIiArIGZyb250ZW5kVGhlbWVGb2xkZXIgKyAnLycgKyBmaWxlVXJsICsgXCInXCJcbiAgICAgICk7XG4gICAgICAvLyBhc3NldHMgYXJlIGFsd2F5cyByZWxhdGl2ZSB0byB0aGVtZSBmb2xkZXJcbiAgICAgIGNvbnN0IHBhdGhSZXNvbHZlZCA9IGlzQXNzZXQgPyAnLycgKyBmaWxlVXJsXG4gICAgICAgICAgOiBhYnNvbHV0ZVBhdGguc3Vic3RyaW5nKHRoZW1lRm9sZGVyLmxlbmd0aCkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gICAgICAvLyBrZWVwIHRoZSB1cmwgdGhlIHNhbWUgZXhjZXB0IHJlcGxhY2UgdGhlIC4vIG9yIC4uLyB0byB0aGVtZXMvW3RoZW1lRm9sZGVyXVxuICAgICAgcmV0dXJuIHVybCArIChxdW90ZU1hcmsgPz8gJycpICsgZnJvbnRlbmRUaGVtZUZvbGRlciArIHBhdGhSZXNvbHZlZCArIGVuZFN0cmluZztcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGV2TW9kZSkge1xuICAgICAgbG9nZ2VyLmxvZyhcIk5vIHJld3JpdGUgZm9yICdcIiwgbWF0Y2gsIFwiJyBhcyB0aGUgZmlsZSB3YXMgbm90IGZvdW5kLlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSW4gcHJvZHVjdGlvbiwgdGhlIGNzcyBpcyBpbiBWQUFESU4vYnVpbGQgYnV0IHRoZSB0aGVtZSBmaWxlcyBhcmUgaW4gLlxuICAgICAgcmV0dXJuIHVybCArIChxdW90ZU1hcmsgPz8gJycpICsgJy4uLy4uLycgKyBmaWxlVXJsICsgZW5kU3RyaW5nO1xuICAgIH1cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH0pO1xuICByZXR1cm4gc291cmNlO1xufVxuXG5leHBvcnQgeyByZXdyaXRlQ3NzVXJscyB9O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtZXJsaVxcXFxQcm9qZWt0M1NlbWVzdGVyXFxcXHRlYW0xLmZyb250ZW5kMVxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFxyZWFjdC1mdW5jdGlvbi1sb2NhdGlvbi1wbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG1lcmxpXFxcXFByb2pla3QzU2VtZXN0ZXJcXFxcdGVhbTEuZnJvbnRlbmQxXFxcXHRhcmdldFxcXFxwbHVnaW5zXFxcXHJlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpblxcXFxyZWFjdC1mdW5jdGlvbi1sb2NhdGlvbi1wbHVnaW4uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL21lcmxpL1Byb2pla3QzU2VtZXN0ZXIvdGVhbTEuZnJvbnRlbmQxL3RhcmdldC9wbHVnaW5zL3JlYWN0LWZ1bmN0aW9uLWxvY2F0aW9uLXBsdWdpbi9yZWFjdC1mdW5jdGlvbi1sb2NhdGlvbi1wbHVnaW4uanNcIjtpbXBvcnQgKiBhcyB0IGZyb20gJ0BiYWJlbC90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRGdW5jdGlvbkNvbXBvbmVudFNvdXJjZUxvY2F0aW9uQmFiZWwoKSB7XG4gIGZ1bmN0aW9uIGlzUmVhY3RGdW5jdGlvbk5hbWUobmFtZSkge1xuICAgIC8vIEEgUmVhY3QgY29tcG9uZW50IGZ1bmN0aW9uIGFsd2F5cyBzdGFydHMgd2l0aCBhIENhcGl0YWwgbGV0dGVyXG4gICAgcmV0dXJuIG5hbWUgJiYgbmFtZS5tYXRjaCgvXltBLVpdLiovKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcml0ZXMgZGVidWcgaW5mbyBhcyBOYW1lLl9fZGVidWdTb3VyY2VEZWZpbmU9ey4uLn0gYWZ0ZXIgdGhlIGdpdmVuIHN0YXRlbWVudCAoXCJwYXRoXCIpLlxuICAgKiBUaGlzIGlzIHVzZWQgdG8gbWFrZSB0aGUgc291cmNlIGxvY2F0aW9uIG9mIHRoZSBmdW5jdGlvbiAoZGVmaW5lZCBieSB0aGUgbG9jIHBhcmFtZXRlcikgYXZhaWxhYmxlIGluIHRoZSBicm93c2VyIGluIGRldmVsb3BtZW50IG1vZGUuXG4gICAqIFRoZSBuYW1lIF9fZGVidWdTb3VyY2VEZWZpbmUgaXMgcHJlZml4ZWQgYnkgX18gdG8gbWFyayB0aGlzIGlzIG5vdCBhIHB1YmxpYyBBUEkuXG4gICAqL1xuICBmdW5jdGlvbiBhZGREZWJ1Z0luZm8ocGF0aCwgbmFtZSwgZmlsZW5hbWUsIGxvYykge1xuICAgIGNvbnN0IGxpbmVOdW1iZXIgPSBsb2Muc3RhcnQubGluZTtcbiAgICBjb25zdCBjb2x1bW5OdW1iZXIgPSBsb2Muc3RhcnQuY29sdW1uICsgMTtcbiAgICBjb25zdCBkZWJ1Z1NvdXJjZU1lbWJlciA9IHQubWVtYmVyRXhwcmVzc2lvbih0LmlkZW50aWZpZXIobmFtZSksIHQuaWRlbnRpZmllcignX19kZWJ1Z1NvdXJjZURlZmluZScpKTtcbiAgICBjb25zdCBkZWJ1Z1NvdXJjZURlZmluZSA9IHQub2JqZWN0RXhwcmVzc2lvbihbXG4gICAgICB0Lm9iamVjdFByb3BlcnR5KHQuaWRlbnRpZmllcignZmlsZU5hbWUnKSwgdC5zdHJpbmdMaXRlcmFsKGZpbGVuYW1lKSksXG4gICAgICB0Lm9iamVjdFByb3BlcnR5KHQuaWRlbnRpZmllcignbGluZU51bWJlcicpLCB0Lm51bWVyaWNMaXRlcmFsKGxpbmVOdW1iZXIpKSxcbiAgICAgIHQub2JqZWN0UHJvcGVydHkodC5pZGVudGlmaWVyKCdjb2x1bW5OdW1iZXInKSwgdC5udW1lcmljTGl0ZXJhbChjb2x1bW5OdW1iZXIpKVxuICAgIF0pO1xuICAgIGNvbnN0IGFzc2lnbm1lbnQgPSB0LmV4cHJlc3Npb25TdGF0ZW1lbnQodC5hc3NpZ25tZW50RXhwcmVzc2lvbignPScsIGRlYnVnU291cmNlTWVtYmVyLCBkZWJ1Z1NvdXJjZURlZmluZSkpO1xuICAgIGNvbnN0IGNvbmRpdGlvbiA9IHQuYmluYXJ5RXhwcmVzc2lvbihcbiAgICAgICc9PT0nLFxuICAgICAgdC51bmFyeUV4cHJlc3Npb24oJ3R5cGVvZicsIHQuaWRlbnRpZmllcihuYW1lKSksXG4gICAgICB0LnN0cmluZ0xpdGVyYWwoJ2Z1bmN0aW9uJylcbiAgICApO1xuICAgIGNvbnN0IGlmRnVuY3Rpb24gPSB0LmlmU3RhdGVtZW50KGNvbmRpdGlvbiwgdC5ibG9ja1N0YXRlbWVudChbYXNzaWdubWVudF0pKTtcbiAgICBwYXRoLmluc2VydEFmdGVyKGlmRnVuY3Rpb24pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB2aXNpdG9yOiB7XG4gICAgICBWYXJpYWJsZURlY2xhcmF0aW9uKHBhdGgsIHN0YXRlKSB7XG4gICAgICAgIC8vIEZpbmRzIGRlY2xhcmF0aW9ucyBzdWNoIGFzXG4gICAgICAgIC8vIGNvbnN0IEZvbyA9ICgpID0+IDxkaXYvPlxuICAgICAgICAvLyBleHBvcnQgY29uc3QgQmFyID0gKCkgPT4gPHNwYW4vPlxuXG4gICAgICAgIC8vIGFuZCB3cml0ZXMgYSBGb28uX19kZWJ1Z1NvdXJjZURlZmluZT0gey4ufSBhZnRlciBpdCwgcmVmZXJyaW5nIHRvIHRoZSBzdGFydCBvZiB0aGUgZnVuY3Rpb24gYm9keVxuICAgICAgICBwYXRoLm5vZGUuZGVjbGFyYXRpb25zLmZvckVhY2goKGRlY2xhcmF0aW9uKSA9PiB7XG4gICAgICAgICAgaWYgKGRlY2xhcmF0aW9uLmlkLnR5cGUgIT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBuYW1lID0gZGVjbGFyYXRpb24/LmlkPy5uYW1lO1xuICAgICAgICAgIGlmICghaXNSZWFjdEZ1bmN0aW9uTmFtZShuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IGZpbGVuYW1lID0gc3RhdGUuZmlsZS5vcHRzLmZpbGVuYW1lO1xuICAgICAgICAgIGlmIChkZWNsYXJhdGlvbj8uaW5pdD8uYm9keT8ubG9jKSB7XG4gICAgICAgICAgICBhZGREZWJ1Z0luZm8ocGF0aCwgbmFtZSwgZmlsZW5hbWUsIGRlY2xhcmF0aW9uLmluaXQuYm9keS5sb2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuXG4gICAgICBGdW5jdGlvbkRlY2xhcmF0aW9uKHBhdGgsIHN0YXRlKSB7XG4gICAgICAgIC8vIEZpbmRzIGRlY2xhcmF0aW9ucyBzdWNoIGFzXG4gICAgICAgIC8vIGZ1bmN0aW8gRm9vKCkgeyByZXR1cm4gPGRpdi8+OyB9XG4gICAgICAgIC8vIGV4cG9ydCBmdW5jdGlvbiBCYXIoKSB7IHJldHVybiA8c3Bhbj5IZWxsbzwvc3Bhbj47fVxuXG4gICAgICAgIC8vIGFuZCB3cml0ZXMgYSBGb28uX19kZWJ1Z1NvdXJjZURlZmluZT0gey4ufSBhZnRlciBpdCwgcmVmZXJyaW5nIHRvIHRoZSBzdGFydCBvZiB0aGUgZnVuY3Rpb24gYm9keVxuICAgICAgICBjb25zdCBub2RlID0gcGF0aC5ub2RlO1xuICAgICAgICBjb25zdCBuYW1lID0gbm9kZT8uaWQ/Lm5hbWU7XG4gICAgICAgIGlmICghaXNSZWFjdEZ1bmN0aW9uTmFtZShuYW1lKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmaWxlbmFtZSA9IHN0YXRlLmZpbGUub3B0cy5maWxlbmFtZTtcbiAgICAgICAgaWYgKG5vZGUuYm9keS5sb2MpIHtcbiAgICAgICAgICBhZGREZWJ1Z0luZm8ocGF0aCwgbmFtZSwgZmlsZW5hbWUsIG5vZGUuYm9keS5sb2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuIiwgIntcbiAgXCJmcm9udGVuZEZvbGRlclwiOiBcIkM6L1VzZXJzL21lcmxpL1Byb2pla3QzU2VtZXN0ZXIvdGVhbTEuZnJvbnRlbmQxLy4vc3JjL21haW4vZnJvbnRlbmRcIixcbiAgXCJ0aGVtZUZvbGRlclwiOiBcInRoZW1lc1wiLFxuICBcInRoZW1lUmVzb3VyY2VGb2xkZXJcIjogXCJDOi9Vc2Vycy9tZXJsaS9Qcm9qZWt0M1NlbWVzdGVyL3RlYW0xLmZyb250ZW5kMS8uL3NyYy9tYWluL2Zyb250ZW5kL2dlbmVyYXRlZC9qYXItcmVzb3VyY2VzXCIsXG4gIFwic3RhdGljT3V0cHV0XCI6IFwiQzovVXNlcnMvbWVybGkvUHJvamVrdDNTZW1lc3Rlci90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L2NsYXNzZXMvTUVUQS1JTkYvVkFBRElOL3dlYmFwcC9WQUFESU4vc3RhdGljXCIsXG4gIFwiZ2VuZXJhdGVkRm9sZGVyXCI6IFwiZ2VuZXJhdGVkXCIsXG4gIFwic3RhdHNPdXRwdXRcIjogXCJDOlxcXFxVc2Vyc1xcXFxtZXJsaVxcXFxQcm9qZWt0M1NlbWVzdGVyXFxcXHRlYW0xLmZyb250ZW5kMVxcXFx0YXJnZXRcXFxcY2xhc3Nlc1xcXFxNRVRBLUlORlxcXFxWQUFESU5cXFxcY29uZmlnXCIsXG4gIFwiZnJvbnRlbmRCdW5kbGVPdXRwdXRcIjogXCJDOlxcXFxVc2Vyc1xcXFxtZXJsaVxcXFxQcm9qZWt0M1NlbWVzdGVyXFxcXHRlYW0xLmZyb250ZW5kMVxcXFx0YXJnZXRcXFxcY2xhc3Nlc1xcXFxNRVRBLUlORlxcXFxWQUFESU5cXFxcd2ViYXBwXCIsXG4gIFwiZGV2QnVuZGxlT3V0cHV0XCI6IFwiQzovVXNlcnMvbWVybGkvUHJvamVrdDNTZW1lc3Rlci90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L2Rldi1idW5kbGUvd2ViYXBwXCIsXG4gIFwiZGV2QnVuZGxlU3RhdHNPdXRwdXRcIjogXCJDOi9Vc2Vycy9tZXJsaS9Qcm9qZWt0M1NlbWVzdGVyL3RlYW0xLmZyb250ZW5kMS90YXJnZXQvZGV2LWJ1bmRsZS9jb25maWdcIixcbiAgXCJqYXJSZXNvdXJjZXNGb2xkZXJcIjogXCJDOi9Vc2Vycy9tZXJsaS9Qcm9qZWt0M1NlbWVzdGVyL3RlYW0xLmZyb250ZW5kMS8uL3NyYy9tYWluL2Zyb250ZW5kL2dlbmVyYXRlZC9qYXItcmVzb3VyY2VzXCIsXG4gIFwidGhlbWVOYW1lXCI6IFwibXktYXBwXCIsXG4gIFwiY2xpZW50U2VydmljZVdvcmtlclNvdXJjZVwiOiBcIkM6XFxcXFVzZXJzXFxcXG1lcmxpXFxcXFByb2pla3QzU2VtZXN0ZXJcXFxcdGVhbTEuZnJvbnRlbmQxXFxcXHRhcmdldFxcXFxzdy50c1wiLFxuICBcInB3YUVuYWJsZWRcIjogZmFsc2UsXG4gIFwib2ZmbGluZUVuYWJsZWRcIjogZmFsc2UsXG4gIFwib2ZmbGluZVBhdGhcIjogXCInb2ZmbGluZS5odG1sJ1wiXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxtZXJsaVxcXFxQcm9qZWt0M1NlbWVzdGVyXFxcXHRlYW0xLmZyb250ZW5kMVxcXFx0YXJnZXRcXFxccGx1Z2luc1xcXFxyb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LWN1c3RvbVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbWVybGlcXFxcUHJvamVrdDNTZW1lc3RlclxcXFx0ZWFtMS5mcm9udGVuZDFcXFxcdGFyZ2V0XFxcXHBsdWdpbnNcXFxccm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC1jdXN0b21cXFxccm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbWVybGkvUHJvamVrdDNTZW1lc3Rlci90ZWFtMS5mcm9udGVuZDEvdGFyZ2V0L3BsdWdpbnMvcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC1jdXN0b20vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC5qc1wiOy8qKlxuICogTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDE5IFVtYmVydG8gUGVwYXRvXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiAqL1xuLy8gVGhpcyBpcyBodHRwczovL2dpdGh1Yi5jb20vdW1ib3BlcGF0by9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0IDIuMC4wICsgaHR0cHM6Ly9naXRodWIuY29tL3VtYm9wZXBhdG8vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC9wdWxsLzU0XG4vLyB0byBtYWtlIGl0IHdvcmsgd2l0aCBWaXRlIDNcbi8vIE9uY2UgLyBpZiBodHRwczovL2dpdGh1Yi5jb20vdW1ib3BlcGF0by9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0L3B1bGwvNTQgaXMgbWVyZ2VkIHRoaXMgc2hvdWxkIGJlIHJlbW92ZWQgYW5kIHJvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQgc2hvdWxkIGJlIHVzZWQgaW5zdGVhZFxuXG5pbXBvcnQgeyBjcmVhdGVGaWx0ZXIgfSBmcm9tICdAcm9sbHVwL3BsdWdpbnV0aWxzJztcbmltcG9ydCB0cmFuc2Zvcm1Bc3QgZnJvbSAndHJhbnNmb3JtLWFzdCc7XG5cbmNvbnN0IGFzc2V0VXJsUkUgPSAvX19WSVRFX0FTU0VUX18oW1xcdyRdKylfXyg/OlxcJF8oLio/KV9fKT8vZ1xuXG5jb25zdCBlc2NhcGUgPSAoc3RyKSA9PlxuICBzdHJcbiAgICAucmVwbGFjZShhc3NldFVybFJFLCAnJHt1bnNhZmVDU1NUYWcoXCJfX1ZJVEVfQVNTRVRfXyQxX18kMlwiKX0nKVxuICAgIC5yZXBsYWNlKC9gL2csICdcXFxcYCcpXG4gICAgLnJlcGxhY2UoL1xcXFwoPyFgKS9nLCAnXFxcXFxcXFwnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcG9zdGNzc0xpdChvcHRpb25zID0ge30pIHtcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgaW5jbHVkZTogJyoqLyoue2Nzcyxzc3MscGNzcyxzdHlsLHN0eWx1cyxzYXNzLHNjc3MsbGVzc30nLFxuICAgIGV4Y2x1ZGU6IG51bGwsXG4gICAgaW1wb3J0UGFja2FnZTogJ2xpdCdcbiAgfTtcblxuICBjb25zdCBvcHRzID0geyAuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuICBjb25zdCBmaWx0ZXIgPSBjcmVhdGVGaWx0ZXIob3B0cy5pbmNsdWRlLCBvcHRzLmV4Y2x1ZGUpO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3Bvc3Rjc3MtbGl0JyxcbiAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XG4gICAgICBpZiAoIWZpbHRlcihpZCkpIHJldHVybjtcbiAgICAgIGNvbnN0IGFzdCA9IHRoaXMucGFyc2UoY29kZSwge30pO1xuICAgICAgLy8gZXhwb3J0IGRlZmF1bHQgY29uc3QgY3NzO1xuICAgICAgbGV0IGRlZmF1bHRFeHBvcnROYW1lO1xuXG4gICAgICAvLyBleHBvcnQgZGVmYXVsdCAnLi4uJztcbiAgICAgIGxldCBpc0RlY2xhcmF0aW9uTGl0ZXJhbCA9IGZhbHNlO1xuICAgICAgY29uc3QgbWFnaWNTdHJpbmcgPSB0cmFuc2Zvcm1Bc3QoY29kZSwgeyBhc3Q6IGFzdCB9LCAobm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJykge1xuICAgICAgICAgIGRlZmF1bHRFeHBvcnROYW1lID0gbm9kZS5kZWNsYXJhdGlvbi5uYW1lO1xuXG4gICAgICAgICAgaXNEZWNsYXJhdGlvbkxpdGVyYWwgPSBub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdMaXRlcmFsJztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghZGVmYXVsdEV4cG9ydE5hbWUgJiYgIWlzRGVjbGFyYXRpb25MaXRlcmFsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1hZ2ljU3RyaW5nLndhbGsoKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKGRlZmF1bHRFeHBvcnROYW1lICYmIG5vZGUudHlwZSA9PT0gJ1ZhcmlhYmxlRGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgY29uc3QgZXhwb3J0ZWRWYXIgPSBub2RlLmRlY2xhcmF0aW9ucy5maW5kKChkKSA9PiBkLmlkLm5hbWUgPT09IGRlZmF1bHRFeHBvcnROYW1lKTtcbiAgICAgICAgICBpZiAoZXhwb3J0ZWRWYXIpIHtcbiAgICAgICAgICAgIGV4cG9ydGVkVmFyLmluaXQuZWRpdC51cGRhdGUoYGNzc1RhZ1xcYCR7ZXNjYXBlKGV4cG9ydGVkVmFyLmluaXQudmFsdWUpfVxcYGApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0RlY2xhcmF0aW9uTGl0ZXJhbCAmJiBub2RlLnR5cGUgPT09ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbi5lZGl0LnVwZGF0ZShgY3NzVGFnXFxgJHtlc2NhcGUobm9kZS5kZWNsYXJhdGlvbi52YWx1ZSl9XFxgYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbWFnaWNTdHJpbmcucHJlcGVuZChgaW1wb3J0IHtjc3MgYXMgY3NzVGFnLCB1bnNhZmVDU1MgYXMgdW5zYWZlQ1NTVGFnfSBmcm9tICcke29wdHMuaW1wb3J0UGFja2FnZX0nO1xcbmApO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogbWFnaWNTdHJpbmcudG9TdHJpbmcoKSxcbiAgICAgICAgbWFwOiBtYWdpY1N0cmluZy5nZW5lcmF0ZU1hcCh7XG4gICAgICAgICAgaGlyZXM6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH07XG4gICAgfVxuICB9O1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbWVybGlcXFxcUHJvamVrdDNTZW1lc3RlclxcXFx0ZWFtMS5mcm9udGVuZDFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG1lcmxpXFxcXFByb2pla3QzU2VtZXN0ZXJcXFxcdGVhbTEuZnJvbnRlbmQxXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9tZXJsaS9Qcm9qZWt0M1NlbWVzdGVyL3RlYW0xLmZyb250ZW5kMS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IFVzZXJDb25maWdGbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgb3ZlcnJpZGVWYWFkaW5Db25maWcgfSBmcm9tICcuL3ZpdGUuZ2VuZXJhdGVkJztcblxuY29uc3QgY3VzdG9tQ29uZmlnOiBVc2VyQ29uZmlnRm4gPSAoZW52KSA9PiAoe1xuICAvLyBIZXJlIHlvdSBjYW4gYWRkIGN1c3RvbSBWaXRlIHBhcmFtZXRlcnNcbiAgLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBvdmVycmlkZVZhYWRpbkNvbmZpZyhjdXN0b21Db25maWcpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQU1BLE9BQU8sVUFBVTtBQUNqQixTQUFTLGNBQUFBLGFBQVksYUFBQUMsWUFBVyxlQUFBQyxjQUFhLGdCQUFBQyxlQUFjLGlCQUFBQyxzQkFBNEI7QUFDdkYsU0FBUyxrQkFBa0I7QUFDM0IsWUFBWSxTQUFTOzs7QUNXckIsU0FBUyxjQUFBQyxhQUFZLGdCQUFBQyxxQkFBb0I7QUFDekMsU0FBUyxXQUFBQyxnQkFBZTs7O0FDRHhCLFNBQVMsWUFBQUMsaUJBQWdCO0FBQ3pCLFNBQVMsV0FBQUMsVUFBUyxZQUFBQyxpQkFBZ0I7QUFDbEMsU0FBUyxjQUFBQyxhQUFZLGNBQWMscUJBQXFCOzs7QUNGeEQsU0FBUyxhQUFh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eW5jIiwgInJlYWRkaXJTeW5jIiwgInJlYWRGaWxlU3luYyIsICJ3cml0ZUZpbGVTeW5jIiwgImV4aXN0c1N5bmMiLCAicmVhZEZpbGVTeW5jIiwgInJlc29sdmUiLCAiZ2xvYlN5bmMiLCAicmVzb2x2ZSIsICJiYXNlbmFtZSIsICJleGlzdHNTeW5jIiwgInRoZW1lRm9sZGVyIiwgInRoZW1lRm9sZGVyIiwgInJlc29sdmUiLCAiZ2xvYlN5bmMiLCAiZXhpc3RzU3luYyIsICJiYXNlbmFtZSIsICJ2YXJpYWJsZSIsICJmaWxlbmFtZSIsICJleGlzdHNTeW5jIiwgInJlc29sdmUiLCAidGhlbWVGb2xkZXIiLCAicmVhZEZpbGVTeW5jIiwgImV4aXN0c1N5bmMiLCAicmVhZEZpbGVTeW5jIiwgInJlc29sdmUiLCAiYmFzZW5hbWUiLCAiZ2xvYlN5bmMiLCAidGhlbWVGb2xkZXIiLCAiZ2V0VGhlbWVQcm9wZXJ0aWVzIiwgImdsb2JTeW5jIiwgInJlc29sdmUiLCAiZXhpc3RzU3luYyIsICJyZWFkRmlsZVN5bmMiLCAicmVwbGFjZSIsICJiYXNlbmFtZSIsICJwYXRoIiwgInJlcXVpcmUiLCAiZXhpc3RzU3luYyIsICJyZWFkRmlsZVN5bmMiLCAibWtkaXJTeW5jIiwgImJ1bmRsZSIsICJyZWFkZGlyU3luYyIsICJ0aGVtZUZvbGRlciIsICJ3cml0ZUZpbGVTeW5jIiwgImUiLCAicGF0aCIsICJjdXN0b21Db25maWciXQp9Cg==
