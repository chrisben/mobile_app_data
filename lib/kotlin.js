const types = require('./types')
const _ = require('lodash')
const {line, lines, structName, attrName} = require('./utils')

const elementType = (element) => {
  let type = ""
  switch (element.type) {
    case types.STRUCT:
      type = structName(element.name)
      break
    case types.ARRAY:
      type = `List<${elementType(element.subItem)}>`
      break
    case types.BOOLEAN:
      type = 'Boolean'
      break
    case types.STRING:
      type = 'String'
      break
    case types.NUMBER:
      type = element.isFloat ? 'Double' : 'Int'
      break
  }
  if (element.isOptional) {
    type += '?'
  }
  return type
}

const generateClass = (element, name, fields, level) => {
  let output = ""
  let struct = structName(name)
  let attribs = fields
    .map((attrib) => `val ${attrName(attrib.name)}: ${elementType(attrib)}`)
    .join(', ')

  let childOutput = ''
  fields.forEach(field => {
    childOutput += generateDeclaration(field, level + 1)
  })
  if (childOutput.length > 0) {
    output += line(`data class ${struct}(${attribs}) {`, level)
    output += childOutput
    output += line('}', level)
  } else {
    output += line(`data class ${struct}(${attribs})`, level)
  }

  return output
}

const generateDeclaration = (element, level) => {
  if (element.type == types.STRUCT) {
    return generateClass(element, element.name, Object.values(element.fields), level)
  } else if (element.type == types.ARRAY && element.subItem.type == types.STRUCT) {
    return generateClass(element.subItem, structName(element.subItem.name), Object.values(element.subItem.fields), level)
  }

  return ''
}

const generateConstant = (element, data) => {
  switch (element.type) {
    case types.STRING:
      return `"${data}"`
    case types.NUMBER:
      let output = `${data}`
      if (element.isFloat && !output.includes('.')) {
        output += '.toDouble()'
      }
      return output
    case types.BOOLEAN:
      return data ? 'true' : 'false'
  }
  return ''
}

const generateDefinition = (element, data, classPrefix, level) => {
  let output = ''

  if (typeof data == 'undefined' || data === null) {
    return 'null'
  }

  let indent = ''
  for (let i = 0; i < level + 1; i++) {
    indent += '    '
  }

  switch (element.type) {
    case types.STRUCT:
      let className = classPrefix + structName(element.name)
      output += `${className}(\n`
      output += element.fields.map((attrib) => {
        return indent + attrName(attrib.name)+ ' = ' + generateDefinition(attrib, data[attrib.name], className + '.', level + 1)
      }).join(',\n') + ')'
      break
    case types.ARRAY:
        output += `listOf(\n`
        output += data.map((item) => {
          return indent + generateDefinition(element.subItem, item, classPrefix, level + 1)
        }).join(', \n') + ')'
      break
    default:
      output += generateConstant(element, data)
      break
  }

  return output
}

const generateKotlin = (tree, data, package) =>
  `/* generated automatically */

package ${package}

${generateDeclaration(tree, 0)}

@Suppress("SpellCheckingInspection")
val ${attrName(tree.name)} = ${generateDefinition(tree, data, '', 0)}
`

module.exports = generateKotlin
