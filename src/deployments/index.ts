import {
  Rule,
  SchematicContext,
  Tree,
  externalSchematic
} from '@angular-devkit/schematics';
import { Schema } from './schema.model';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function deployments(_options: Schema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    if (_options.deployment === 'None') {
      _context.logger.info(
        'No deployment selected. You can add one later by running `ng g @ng-seattle/community-schematics:deployments`.'
      );
      return tree;
    }
    switch (_options.deployment) {
      case 'Azure':
        return externalSchematic('@azure/ng-deploy', 'install', {
          telemetry: false
        });

      case 'Github Pages':
        return externalSchematic('angular-cli-ghpages', 'install', {});

      case 'Netlify':
        return externalSchematic('@netlify-builder/deploy', 'install', {});

      case 'Now':
        return externalSchematic('@zeit/ng-deploy', 'install', {});

      default:
        break;
    }
    return tree;
  };
}
