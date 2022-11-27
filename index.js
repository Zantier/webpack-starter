const child_process = require('child_process');
const fs = require('fs/promises');
const mustache = require('mustache');
const path = require('path');
const process = require('process');
const { hideBin } = require('yargs/helpers')
const yargs = require('yargs/yargs');

// Parameters for generating a react project
class ProjectParams {
  constructor(argv, commandLine) {
    argv.jsx = argv.react || argv.preact;
    this.params = {
      startername: process.env.npm_package_name,
      starterversion: process.env.npm_package_version,
      startercommandline: commandLine,
      ...argv,
    };
    for (let arg in argv) {
      if (argv[arg] === false)
        this.params['no_' + arg] = true;
    }
    console.log(this.params);
  }

  // Recursively write all the files from the template directory to the destination directory
  async writeFiles(sourceDir, destDir) {
    const sourceFiles = await fs.readdir(sourceDir);
    for (let sourceFile of sourceFiles) {
      const newSourcePath = path.join(sourceDir, sourceFile);
      const newDestPath = path.join(destDir, sourceFile);
      const stat = await fs.stat(newSourcePath);
      if (stat.isDirectory()) {
        await fs.mkdir(newDestPath);
        this.writeFiles(newSourcePath, newDestPath);
      } else {
        const encoding = 'utf8';
        const contents = await fs.readFile(newSourcePath, encoding);
        const newContents = mustache.render(contents, this.params);
        // Don't write the file if empty
        if (newContents) {
          await fs.writeFile(newDestPath, newContents, encoding);
        }
      }
    }
  }
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .command('*', 'Create a new minimal react project. Mustache template files in `/template` are rendered to `/dist`, using the given command-line options.')
    .option('name',{
      describe: 'Name of the project',
      type: 'string',
      default: 'myapp',
    })
    .option('css_modules',{
      describe: 'Use CSS modules',
      type: 'boolean',
      default: false,
    })
    .option('preact',{
      describe: 'Use preact',
      type: 'boolean',
      default: false,
    })
    .option('react',{
      describe: 'Use react',
      type: 'boolean',
      default: false,
    })
    .option('typescript',{
      describe: 'Use typescript, rather than javascript',
      type: 'boolean',
      default: false,
    })
    .strict()
    .argv;

  const params = new ProjectParams(argv, `npm start -- ${hideBin(process.argv).join(' ')}`);

  const templateDir = path.join(__dirname, "template");
  const destDir = path.join(__dirname, "dist");
  // Delete destination directory, if it exists
  try {
    await fs.rm(destDir, {
      recursive: true,
    });
  } catch (err) {
  }
  await fs.mkdir(destDir);
  await params.writeFiles(templateDir, destDir);
}

main();
