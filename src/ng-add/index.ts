import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  noop
} from '@angular-devkit/schematics';
import { Schema } from './schema.model';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export default function(_options: Schema): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([noop()]);
  };
}
