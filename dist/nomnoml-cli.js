#! /usr/bin/env node
var fs = require('fs')
var nomnoml = require('./nomnoml.js')

var [_, _, filename, outfile, optionalMaxImportDepth] = process.argv

if (filename == '--help' || process.argv.length == 2){
  console.log(`
  Nomnoml command line utility for generating SVG diagrams.

  Load source file and send rendered svg to stdout:

  > npx nomnoml <source_file>

  Load source file and save rendered svg to <output_file>:
  
  > npx nomnoml <source_file> <output_file>`)
  return
}

var maxImportDepth = optionalMaxImportDepth || 10

var svg = nomnoml.renderSvg(nomnoml.compileFile(filename, maxImportDepth, 0))
if (outfile){
  fs.writeFileSync(outfile, svg)
}
else {
  console.log(svg)
}