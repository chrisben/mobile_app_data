const _ = require('lodash')

const line = (str, level) => {
  let output = ''
  for (let i = 0; i < level; i++) {
    output += '    '
  }
  return output + str + '\n'
}
const lines = (strList, level) => {
  return strList.map((str) => line(str, level)).join('')
}
const structName = (name) => {
  return _.upperFirst(_.camelCase(name))
}
const attrName = (name) => {
  return _.camelCase(name)
}
const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0
}

module.exports = {
  structName,
  attrName,
  line,
  lines,
  isFloat
}
