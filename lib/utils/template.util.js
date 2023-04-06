/***
 * @file:
 * @author: caojianping
 * @Date: 2021-12-02 17:22:29
 */

const inquirer = require('inquirer');
const logSymbols = require('log-symbols');
const chalk = require('chalk');
const Metalsmith = require('metalsmith');
const Handlebars = require('handlebars');

const { TEMPLATE_NAMES } = require('../constants');

/**
 * 选择模板
 * @returns 返回已选择模板
 */
function selectTemplate() {
  return inquirer
    .prompt([
      {
        name: 'template',
        type: 'list',
        message: chalk.blue('1.请选择模板'),
        choices: [
          { name: 'TypeScript library', value: 0 },
          { name: 'Vue component library', value: 1 },
          { name: 'Vue component library for customElements', value: 2 },
        ],
      },
    ])
    .then((answers) => {
      const template = answers.template;
      console.log(logSymbols.success, chalk.green(`已选择模板: ${TEMPLATE_NAMES[template]}`));
      console.log('');
      return template;
    })
    .catch((error) => console.log(logSymbols.error, chalk.red(`selectTemplate error: ${error}`)));
}

/**
 * 输入模板信息
 * @param {*} name 名称
 * @returns 返回模板信息
 */
function inputTemplateInfo(name) {
  console.log(logSymbols.info, chalk.blue('2.请输入模板信息'));
  return inquirer
    .prompt([
      {
        name: 'name',
        message: '名称',
        default: name,
      },
      {
        name: 'version',
        message: '版本号',
        default: '1.0.0',
      },
      {
        name: 'description',
        message: '描述',
        default: `A library named ${name}`,
      },
      {
        name: 'author',
        message: '作者',
        default: '',
      },
    ])
    .then((answers) => answers)
    .catch((error) => console.log(logSymbols.error, chalk.red(`inputTemplateInfo error: ${error}`)));
}

/**
 * 生成模板
 * @param {*} metadata 元数据
 * @param {*} source 原始路径
 * @param {*} dest 目标路径
 * @returns void
 */
function generateTemplate(metadata, source, dest = '.') {
  if (!metadata) return Promise.reject(new Error('generateTemplate error: 无效的元数据'));

  if (!source) return Promise.reject(new Error('generateTemplate error: 无效的原始路径'));

  return new Promise((resolve, reject) => {
    Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(source)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata();
        const handles = ['package.json', 'README.md'];
        Object.keys(files).forEach((key) => {
          const value = files[key].contents.toString();
          if (handles.indexOf(key) > -1) {
            files[key].contents = Buffer.from(Handlebars.compile(value)(meta));
          }
        });
        done();
      })
      .build((err) => (err ? reject(err) : resolve()));
  });
}

exports.selectTemplate = selectTemplate;
exports.inputTemplateInfo = inputTemplateInfo;
exports.generateTemplate = generateTemplate;
