import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic,
  noop,
  schematic
} from '@angular-devkit/schematics';
import { addFiles } from '../utils/file-utils';
import { Schema } from './schema.model';
import { addPropertyToPackageJson } from '../utils/package-json-utils';

/**
 * Entry point for the schematic
 * @param _options The options that the user declared
 */
export default function(options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    _context.logger.info(JSON.stringify(options));

    return chain([
      generateLibrary(),
      options.meetupName.length > 0 ? addMeetup(options) : noop(),
      addMaterial(options),
      addFiles(options),
      updateScripts()
    ]);
  };
}

/**
 * A Rule factory that adds Angular Material to the project
 */
function addMaterial(options: Schema): Rule {
  return (_: Tree, _context: SchematicContext) => {
    _context.logger.info('Setting up Angular Material...');
    return externalSchematic('@angular/material', 'install', {
      options
    });
  };
}

function addMeetup(options: Schema): Rule {
  const meetupName = options.meetupName;

  return (_: Tree, _context: SchematicContext) => {
    _context.logger.info('Setting up meetup...');
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
function updateScripts(): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    addPropertyToPackageJson(_tree, _context, 'scripts', {
      start: 'npm run build:lib && ng serve',
      build: 'npm run build:lib && ng build --prod --progress=false',
      'build:lib': 'ng build state'
    });
    return _tree;
  };
}
