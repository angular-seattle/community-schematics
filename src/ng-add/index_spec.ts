import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('@ng-seattle/community-schematics', () => {
  it('works', () => {
    const runner = new SchematicTestRunner('schematics', collectionPath);
    const tree = runner.runSchematicAsync(
      'ng-add',
      { orgName: 'my-org' },
      Tree.empty()
    );
    tree.subscribe(result => expect(result.files).toBe([]));
  });
});
