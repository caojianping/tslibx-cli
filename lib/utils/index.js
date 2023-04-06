/***
 * @file:
 * @author: caojianping
 * @Date: 2021-12-02 18:03:54
 */

const { pretreatDirectory, copyDirectory } = require('./directory.util');
const { selectTemplate, inputTemplateInfo, generateTemplate } = require('./template.util');

module.exports = {
  pretreatDirectory,
  copyDirectory,
  selectTemplate,
  inputTemplateInfo,
  generateTemplate,
};
