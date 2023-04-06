/***
 * @file:
 * @author: caojianping
 * @Date: 2021-12-02 17:22:29
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const inquirer = require('inquirer');
const logSymbols = require('log-symbols');
const chalk = require('chalk');

/**
 * 预处理目录
 * @param {*} name 名称
 * @returns 返回名称
 */
function pretreatDirectory(name) {
  // 遍历根目录
  const rootName = path.basename(process.cwd());
  const list = glob.sync('*');
  if (list.length) {
    let isExist =
      list.filter((item) => {
        const fileName = path.resolve(process.cwd(), path.join('.', item));
        const isDir = fs.statSync(fileName).isDirectory();
        return item.indexOf(name) !== -1 && isDir;
      }).length !== 0;
    if (isExist) {
      // 如果name目录已经存在，那么提示已经存在
      console.log(logSymbols.warning, chalk.yellow(`${name}目录已经存在`));
      return Promise.resolve(null);
    }
    return Promise.resolve(name);
  } else if (rootName === name) {
    // 当前目录与name相同，则在当前目录创建工程
    return inquirer
      .prompt([
        {
          name: 'current',
          message: chalk.blue('当前目录为空，并且目录名称和项目名称一致，是否直接在当前目录创建新项目？'),
          type: 'confirm',
          default: true,
        },
      ])
      .then((answers) => Promise.resolve(answers.current ? '.' : name));
  } else {
    return Promise.resolve(name);
  }
}

/**
 * 复制目录
 * @param {*} source 原始文件夹
 * @param {*} dest 目标文件夹
 * @returns 返回操作结果：成功/失败
 */
function copyDirectory(source, dest) {
  if (!source) return false;

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }

  let files = fs.readdirSync(source);
  files.forEach((file) => {
    let filePath = path.join(source, file),
      fileInfo = fs.statSync(filePath);
    if (fileInfo.isFile()) {
      fs.copyFileSync(filePath, path.join(dest, file));
    } else if (fileInfo.isDirectory()) {
      copyDirectory(filePath, path.join(dest, file));
    }
  });
  return true;
}

exports.pretreatDirectory = pretreatDirectory;
exports.copyDirectory = copyDirectory;
