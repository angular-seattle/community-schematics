import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic,
  url,
  apply,
  template,
  mergeWith,
  MergeStrategy,
  FileEntry,
  forEach
} from '@angular-devkit/schematics';

import { Schema } from './schema.model';
import { strings } from '@angular-devkit/core';

/**
 * Entry point for the schematic
 * @param _options The options that the user declared
 */
export default function(_options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      generateLibrary(),
      addMaterial(_options),
      addFiles(_options)
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

/**
 * Adds required files to the new project
 * @param options The schematic options
 */
function addFiles(options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourcedTemplates = url('./files');

    const sourceParamaterizedTemplates = apply(sourcedTemplates, [
      template({ ...options, ...strings }),
      forEach((fileEntry: FileEntry) => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
          return null;
        }
        return fileEntry;
      })
    ]);
    return mergeWith(sourceParamaterizedTemplates, MergeStrategy.Overwrite);
  };
}

function generateLibrary(): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return externalSchematic('@schematics/angular', 'library', {
      name: 'state'
    });
  };
}
