// modified from https://github.com/schuchard/prettier-schematic/blob/master/src/utility/util.ts
import {
  Tree,
  SchematicsException,
  SchematicContext
} from '@angular-devkit/schematics';
import {
  JsonParseMode,
  JsonAstObject,
  parseJsonAst
} from '@angular-devkit/core';
import {
  findPropertyInAstObject,
  insertPropertyInAstObjectInOrder,
  appendPropertyInAstObject
} from './json-utils';

export enum Config {
  PackageJsonPath = 'package.json',
  JsonIndentLevel = 4
}

export function getFileAsJson(host: Tree, path: string) {
  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const content = configBuffer.toString();

  return JSON.parse(content);
}

export function addPropertyToPackageJson(
  tree: Tree,
  context: SchematicContext,
  propertyName: string,
  propertyValue: { [key: string]: any }
) {
  const packageJsonAst = readPackageJson(tree);
  const pkgNode = findPropertyInAstObject(packageJsonAst, propertyName);
  const recorder = tree.beginUpdate('package.json');

  if (!pkgNode) {
    // outer node missing, add key/value
    appendPropertyInAstObject(
      recorder,
      packageJsonAst,
      propertyName,
      propertyValue,
      Config.JsonIndentLevel
    );
  } else if (pkgNode.kind === 'object') {
    // property exists, update values
    for (let [key, value] of Object.entries(propertyValue)) {
      const innerNode = findPropertyInAstObject(pkgNode, key);

      if (!innerNode) {
        // script not found, add it
        context.logger.debug(`creating ${key} with ${value}`);

        insertPropertyInAstObjectInOrder(
          recorder,
          pkgNode,
          key,
          value,
          Config.JsonIndentLevel
        );
      } else {
        // script found, overwrite value
        context.logger.debug(`overwriting ${key} with ${value}`);

        const { end, start } = innerNode;

        recorder.remove(start.offset, end.offset - start.offset);
        recorder.insertRight(start.offset, JSON.stringify(value));
      }
    }
  }

  tree.commitUpdate(recorder);
}

export function readPackageJson(tree: Tree): JsonAstObject {
  const buffer = tree.read(Config.PackageJsonPath);
  if (buffer === null) {
    throw new SchematicsException('Could not read package.json.');
  }
  const content = buffer.toString();

  const packageJson = parseJsonAst(content, JsonParseMode.Strict);
  if (packageJson.kind != 'object') {
    throw new SchematicsException(
      'Invalid package.json. Was expecting an object'
    );
  }

  return packageJson;
}
