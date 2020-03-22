import {
  Rule,
  SchematicContext,
  Tree,
  chain
} from '@angular-devkit/schematics';
import { Schema } from './schema.model';
import { addPackageJsonDependencies, JsonDependency } from '../utils/npmjs';
import {
  NodePackageInstallTask,
  RunSchematicTask
} from '@angular-devkit/schematics/tasks';

/**
 * Entry point for the schematic
 * @param _options The options that the user declared
 */
export default function(options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([prepareDependencies(options), setupProject(options)]);
  };
}

/**
 * Determines which dependencies need to be installed and adds them to `package.json`
 * @param options The options the user selected
 */
function prepareDependencies(options: Schema): Rule {
  const deps: JsonDependency[] = [
    { name: '@angular/material', version: '^8.2.3' }
  ];

  if (options.addPrettier) {
    deps.push('@schuchard/prettier');
  }

  switch (options.deployment) {
    case 'Azure':
      deps.push('@azure/ng-deploy');
      break;

    case 'Github Pages':
      deps.push('angular-cli-ghpages');
      break;

    case 'Netlify':
      deps.push('@netlify-builder/deploy');
      break;

    case 'Now':
      deps.push('@zeit/ng-deploy');
      break;

    default:
      break;
  }

  return (_tree: Tree, _context: SchematicContext) => {
    return addPackageJsonDependencies(...deps);
  };
}

/**
 * Add a task to install dependencies, then calls the ng-add-setup-project schematic
 * @param options The user options passed in from the schematic
 */
function setupProject(options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const installTaskId = _context.addTask(new NodePackageInstallTask());
    _context.addTask(new RunSchematicTask('ng-add-setup-project', options), [
      installTaskId
    ]);
    return _tree;
  };
}
