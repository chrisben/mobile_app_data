const types = require('./types')
const _ = require('lodash')
const {line, structName, attrName, isFloat} = require('./utils')


const generateConstant = (element, item, parentVar, parentStructName, level) => {
  let output = ""

  switch (typeof item) {
    case 'object':
      if (Array.isArray(item)) {
        let childElement = element.subItem
        item.forEach((i, index) => {
          switch (typeof i) {
            case 'object':
              let variable = `v_${level}_${index}` //${parentStructName.replace(/\./g, '')}
              output += line(`{`, level)
              output += line(`${parentStructName} ${variable} = new ${parentStructName}();`, level + 1)
              output += generateConstant(childElement, i, variable, parentStructName, level + 1)
              output += line(`${parentVar}.add(${variable});`, level + 1)
              output += line(`}`, level)
              break
            case 'string':
              output += line(`${parentVar}.add("${i}");`, level)
              break
            case 'number':
              if (childElement.isFloat && !isFloat(i)) {
                output += line(`${parentVar}.add(${i}d);`, level)
              } else {
                output += line(`${parentVar}.add(${i});`, level)
              }
              break
            case 'boolean':
              output += line(`${parentVar}.add(${i ? "true" : "false"});`, level)
              break
          }
        })
      } else {
        for (let key in item) {
          let childElement = element.fields.find(elt => elt.name == key)
          console.assert(childElement)
          output += generateConstant(childElement, item[key], parentVar + "." + attrName(key), parentStructName + "." + structName(key), level)
        }
      }
      break
    case 'string':
      output += line(`${parentVar} = "${item}";`, level)
      break
    case 'number':
      if (element.isFloat && !isFloat(item)) {
        output += line(`${parentVar} = ${item}d;`, level)
      } else {
        output += line(`${parentVar} = ${item};`, level)
      }
      break
    case 'boolean':
      output += line(`${parentVar} = ${item ? "true" : "false"};`, level)
      break
    default:
      console.error("unknown type", typeof item)
      break
  }

  return output
}

const generateStruct = (element, data, name, fields, level) => {
  let output = ""
  let struct = structName(name)
  if (level == 0) {
    output += line(`public class ${struct} {`, level)
    output += line(`private static final ${struct} mInstance = new ${struct}();`, level + 1)
    output += line(`public static ${struct} shared() {`, level + 1)
    output += line(`return mInstance;`, level + 2)
    output += line(`}`, level + 1)
    output += line(`private ${struct}() {`, level + 1)
    output += generateConstant(element, data, "this", struct, level + 2)
    output += line(`}`, level + 1)
  } else {
    output += line(`public static class ${struct} {`, level)
  }
  fields.forEach(field => {
    output += generateJavaElement(field, data, level + 1)
  })
  output += line('}', level)
  return output
}


const generateJavaElement = (element, data, level) => {
  let output = ""
  switch (element.type) {
    case types.STRUCT:
      output += generateStruct(element, data, element.name, Object.values(element.fields), level)
      if (level > 0) {
        output += line(`public final ${structName(element.name)} ${attrName(element.name)} = new ${structName(element.name)}();`, level)
      }
      break
    case types.ARRAY: {
      let arrayType = "Integer"
      switch (element.subItem.type) {
        case types.STRUCT:
          arrayType = structName(element.subItem.name)
          output += generateStruct(element.subItem, data, arrayType, Object.values(element.subItem.fields), level)
          break
        case types.BOOLEAN:
          arrayType = "Boolean"
          break
        case types.NUMBER:
          let isFloat = element.subItem.isFloat
          arrayType = isFloat ? "Double" : "Integer"
          break
        case types.STRING:
          arrayType = "String"
          break
      }
      output += line(`public final List<${arrayType}> ${attrName(element.name)} = new ArrayList<>();`, level)
      break
    }
    case types.BOOLEAN:
      output += line(`public Boolean ${attrName(element.name)};`, level)
      break
    case types.STRING:
      output += line(`public String ${attrName(element.name)};`, level)
      break
    case types.NUMBER:
      let type = element.isFloat ? "Double" : "Integer"
      output += line(`public ${type} ${attrName(element.name)};`, level)
      break
  }

  return output
}

const generateJava = (tree, data, package) =>
  `/* generated automatically */

package ${package};

import java.util.ArrayList;
import java.util.List;

${generateJavaElement(tree, data, 0)}
`

module.exports = generateJava
