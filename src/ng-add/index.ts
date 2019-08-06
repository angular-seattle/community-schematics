import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  externalSchematic
} from '@angular-devkit/schematics';

import { Schema } from './schema.model';

/**
 * Entry point for the schematic
 * @param _options The options that the user declared
 */
export default function(_options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([addMaterial(_options)]);
  };
}

/**
 * A Rule factory that adds Angular Material to the project
 */
function addMaterial(_options: Schema): Rule {
  return (_: Tree, _context: SchematicContext) => {
    _context.logger.info('Setting up Angular Material...');
    return externalSchematic('@angular/material', 'install', {
      options: _options
    });
  };
}
