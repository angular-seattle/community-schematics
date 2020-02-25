import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic,
  noop,
  schematic
} from '@angular-devkit/schematics';

import { Schema } from '../ng-add/schema.model';
import { addFiles } from '../utils/file-utils';
import {
  addPropertyToPackageJson,
  getFileAsJson
} from '../utils/package-json-utils';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function ngAddSetupProject(options: Schema): Rule {
  return (_: Tree, _context: SchematicContext) => {
    return chain([
      generateLibrary(),
      options.meetupName.length > 0 ? addMeetup(options) : noop(),
      addDeployment(options.deployment),
      addMaterial(options),
      addFiles(options),
      updateScripts(options)
    ]);
  };
}

/**
 * A Rule factory that adds Angular Material to the project
 */
function addMaterial(options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return externalSchematic('@angular/material', 'install', {
      options
    });
  };
}

function addMeetup(options: Schema): Rule {
  const meetupName = options.meetupName;

  return (_: Tree, _context: SchematicContext) => {
    return schematic('meetup', { meetupName });
  };
}

/**
 * Calls the Angular CLI schematic to create a library project to handle state of the app.
 */
function generateLibrary(): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return externalSchematic('@schematics/angular', 'library', {
      name: 'state'
    });
  };
}

/**
 * Updates scripts in the package.json file to work with the new project setup.
 */
function updateScripts(options: Schema): Rule {
  let buildScript = 'npm run build:lib && ng build --prod --progress=false';
  return (_tree: Tree, _context: SchematicContext) => {
    if (options.deployment === 'Github Pages') {
      const workspace = getFileAsJson(_tree, 'angular.json');
      buildScript += ` --base-href=/${options.project ||
        workspace.defaultProject}/`;
    }

    addPropertyToPackageJson(_tree, _context, 'scripts', {
      start: 'npm run build:lib && ng serve',
      build: buildScript,
      'build:lib': 'ng build state'
    });
    return _tree;
  };
}

function addDeployment(deployment: string): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return schematic('deployments', { deployment });
  };
}
