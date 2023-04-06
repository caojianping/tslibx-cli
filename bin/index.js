#!/usr/bin/env node

const program = require('commander');
const package = require('../package.json');
const init = require('./init');

program.version(package.version, '-v, --version').usage('<command> [options]');

program
  .command('init <name>')
  .description('初始化')
  .alias('i')
  .action(function (name) {
    init(name);
  });

program.parse(process.argv);

if (program.args && program.args.length == 0) {
  program.help();
}
