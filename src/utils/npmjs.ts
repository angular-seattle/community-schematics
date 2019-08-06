/**
 * Taken from https://github.com/blove/angular-fire-schematics/blob/master/src/util/npmjs.ts
 */
import { get } from 'http';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  NodeDependency,
  NodeDependencyType,
  addPackageJsonDependency
} from '@schematics/angular/utility/dependencies';
import { of, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

export interface NpmRegistryPackage {
  name: string;
  version: string;
}

/**
 * Gets the latest version number for the given package from the npm registry
 * @param packageName The package name for which the version will be checked
 */
function getLatestNodeVersion(
  packageName: string
): Promise<NpmRegistryPackage> {
  const DEFAULT_VERSION = 'latest';

  return new Promise(resolve => {
    return get(`http://registry.npmjs.org/${packageName}`, res => {
      let rawData = '';
      res.on('data', chunk => (rawData += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(rawData);
          const version = (response && response['dist-tags']) || {};

          resolve(buildPackage(response.name || packageName, version.latest));
        } catch (e) {
          resolve(buildPackage(packageName));
        }
      });
    }).on('error', () => resolve(buildPackage(packageName)));
  });

  function buildPackage(
    name: string,
    version: string = DEFAULT_VERSION
  ): NpmRegistryPackage {
    return { name, version };
  }
}

/**
 * A schematic rule factory that adds the given packages to the project's package.json dependency list.
 * @param args an array of package names to add to the project's dependencies
 */
export function addPackageJsonDependencies(...args: string[]): Rule {
  const packages = args.join(',');
  return (tree: Tree, _context: SchematicContext): Observable<Tree> => {
    if (args.length === 0) {
      return of(tree);
    }

    return of(packages).pipe(
      concatMap(name => getLatestNodeVersion(name)),
      map((npmRegistryPackage: NpmRegistryPackage) => {
        const dependency: NodeDependency = {
          type: NodeDependencyType.Default,
          name: npmRegistryPackage.name,
          version: npmRegistryPackage.version,
          overwrite: false
        };
        _context.logger.info(
          `Added ${npmRegistryPackage.name} to package.json`
        );
        addPackageJsonDependency(tree, dependency);
        return tree;
      })
    );
  };
}

/**
 * A schematic rule factory that adds a task to install dependencies listed in package.json
 */
export function installDependencies(): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    _context.addTask(new NodePackageInstallTask());
    _context.logger.info('✅️ Dependencies installed');
    return tree;
  };
}
