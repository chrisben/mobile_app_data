const types = require('./types')
const {isFloat} = require('./utils')
const _ = require('lodash')

const processNode = (node, currentPath, dict) => {
  if (typeof dict[currentPath] == 'undefined') {
    dict[currentPath] = {}
  }

  if (node == null) {
    dict[currentPath].isOptional = true
  } else {
    switch (typeof node) {
      case 'object':
        if (Array.isArray(node)) {
          dict[currentPath].type = types.ARRAY
          node.forEach(element => {
            processNode(element, currentPath + "._subitem", dict)
          })
        } else {
          dict[currentPath].type = types.STRUCT
          let firstPass = false
          if (typeof dict[currentPath].fields == 'undefined') {
            dict[currentPath].fields = []
            firstPass = true
          }
          for (let key in node) {
            let newPath = currentPath + "." + key

            processNode(node[key], newPath, dict)

            if (typeof dict[currentPath].fields[key] == 'undefined') {
              if (!firstPass) {
                dict[newPath].isOptional = true
              }
              dict[currentPath].fields[key] = true
            }
          }
          for (let field in dict[currentPath].fields) {
            if (typeof node[field] == 'undefined') {
              let newPath = currentPath + "." + field
              dict[newPath].isOptional = true
            }
          }
        }
        break
    case 'string':
      dict[currentPath].type = types.STRING
      break
    case 'number':
      dict[currentPath].type = types.NUMBER
      dict[currentPath].isFloat = dict[currentPath].isFloat || isFloat(node)
      break
    case 'boolean':
      dict[currentPath].type = types.BOOLEAN
      break
    default:
      console.error("unknown type", typeof node)
      break
    }
  }
}

const generateDocument = (dict, path) => {
  let node = dict[path]
  let element = _.pick(node, ['type', 'isFloat', 'isOptional'])
  let names = path.split(".")
  element.name = names[names.length - 1]
  if (element.name == "_subitem") {
    element.name = names[names.length - 2]
  }
  switch (node.type) {
    case types.STRUCT:
      element.fields = []
      Object.keys(node.fields).forEach((key) => {
        element.fields.push(generateDocument(dict, path + "." + key))
      })
      break
    case types.ARRAY:
      element.subItem = generateDocument(dict, path + "._subitem")
      break
    default:
      // all other types: nothing more to do here
      break
  }

  return element
}

const processTree = (tree, name) => {
  let dict = []

  processNode(tree, name, dict)

  return generateDocument(dict, name)
}


module.exports = processTree
