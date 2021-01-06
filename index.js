const fs = require('fs')
const path = require('path')
const processTree = require('./lib/tree')
const generateSwift = require('./lib/swift')
const generateJava = require('./lib/java')
const generateKotlin = require('./lib/kotlin')
const {structName} = require('./lib/utils')

if (process.argv.length < 3) {
  console.log("Missing input JSON file argument")
  process.exit(1)
}
if (process.argv.length < 4) {
  console.log("Missing output folder")
  process.exit(1)
}
if (process.argv.length < 5) {
  console.log("Missing java package name")
  process.exit(1)
}

const inputFile = process.argv[2]
const outputFolder = process.argv[3]
const javaPackage = process.argv[4]
const content = fs.readFileSync(inputFile)
const jsonContent = JSON.parse(content)
const filename = path.basename(inputFile, '.json')

const tree = processTree(jsonContent, filename)

// console.log(tree)

// Swift
const swiftContent = generateSwift(tree, jsonContent, filename)
const outputSwiftFile = path.join(outputFolder, `${structName(filename)}.swift`)
fs.writeFileSync(outputSwiftFile, swiftContent)
console.log(`Swift written to: ${outputSwiftFile}`)

// Java
const javaContent = generateJava(tree, jsonContent, javaPackage)
const outputJavaFile = path.join(outputFolder, `${structName(filename)}.java`)
fs.writeFileSync(outputJavaFile, javaContent)
console.log(`Java written to: ${outputJavaFile}`)

// Kotlin
const kotlinContent = generateKotlin(tree, jsonContent, javaPackage)
const outputKotlinFile = path.join(outputFolder, `${structName(filename)}.kt`)
fs.writeFileSync(outputKotlinFile, kotlinContent)
console.log(`Kotlin written to: ${outputKotlinFile}`)
