import {
  Rule,
  SchematicContext,
  Tree,
  url,
  apply,
  template,
  mergeWith,
  MergeStrategy,
  FileEntry,
  forEach
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

/**
 * Adds required files to the new project
 * @param options The schematic options
 */
export function addFiles(options: any): Rule {
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
