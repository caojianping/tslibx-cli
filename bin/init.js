/***
 * @file:
 * @author: caojianping
 * @Date: 2021-11-02 10:02:22
 */

const path = require('path');
const co = require('co');
const logSymbols = require('log-symbols');
const chalk = require('chalk');

const { TEMPLATE_KEYS } = require('../lib/constants');
const {
  pretreatDirectory,
  copyDirectory,
  selectTemplate,
  inputTemplateInfo,
  generateTemplate,
} = require('../lib/utils');

/**
 * 初始化
 * @param {*} name 名称
 * @returns void
 */
module.exports = function init(name) {
  return co(function* () {
    // 第一步：选择模板
    const template = yield selectTemplate();

    // 第二步：预处理目录
    let cname = yield pretreatDirectory(name);
    if (!cname) return;

    // 第三步：复制目录
    const templatePath = path.join(__dirname, `../templates/template-${TEMPLATE_KEYS[template]}`);
    copyDirectory(templatePath, cname);

    // 第四步：输入模板信息
    let templateInfo = yield inputTemplateInfo(cname);

    // 第五步：生成模板
    yield generateTemplate(templateInfo, templatePath, cname);

    console.log(logSymbols.success, chalk.green('构建成功'));
    console.log('');
    console.log(chalk.green('cd ' + cname));
    console.log(chalk.green('npm install or yarn install'));
    console.log(chalk.green('npm run build'));
  }).catch((error) => console.log(logSymbols.error, `init error: ${error}`));
};
