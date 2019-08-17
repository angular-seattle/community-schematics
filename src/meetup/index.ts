import {
  Rule,
  SchematicContext,
  Tree,
  chain
} from '@angular-devkit/schematics';
import { addFiles } from '../utils/file-utils';

import { Schema } from './schema.model';

/**
 * Entry point for the schematic
 * @param _options The options that the user declared
 */
export default function(options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    _context.logger.debug('made it to meetup schematic');
    return chain([addFiles(options)]);
  };
}
