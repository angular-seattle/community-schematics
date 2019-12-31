[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Community Schematics

Angular Schematics that generate a starter website for community groups.

:white_check_mark: Generates a starter website, built with Angular 8, for your group  
:white_check_mark: Uses Angular Material  
:white_check_mark: Allows links to video hosting services and twitter  
:white_check_mark: Displays events from your groups Meetup.com page

## Getting Started

First generate a new Angular project:

```bash
$ ng new my-community-site
```

Then use `ng add` and follow the prompts to setup the project and you're good to go!

```bash
$ ng add @ng-seattle/community-schematics
```

## Future Feature Plans

- [ ] Easy (and private) contact sharing to help network with people you meet at group events
- [ ] PWA and Angular Universal support
- [ ] Self hosted blogs for groups
- [ ] Calendar management without Meetup.com
- [ ] Email list support
- [ ] Github Pages Support
- Have an idea? Open an issue!

## Developing

This project comes with a sandbox Angular application that you can use to test your changes with. Before starting development run `npm run link:schematic` to ensure that your local schematic can be used in the sandbox.

### Testing

To test locally, install `@angular-devkit/schematics-cli` globally and use the `schematics` command line tool. That tool acts the same as the `generate` command of the Angular CLI, but also has a debug mode. For convienience, there is a script that will clean the project, build it, and run the command line argouments to test. Simply run `npm test` to execture.

Check the documentation with

```bash
schematics --help
```

### Publishing

To publish, simply do:

```bash
npm run build
npm publish
```

That's it!
