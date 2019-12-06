var fs = require('fs')
var typicons = require('./typicons.js')
var html = fs.readFileSync('./index.html', { encoding: 'utf8' })
for (var filename of fs.readdirSync('./webapp')) {
    if (filename[0] != '.') {
        html += fs.readFileSync('./webapp/'+filename, { encoding: 'utf8' })
    }
}
var iconTemplate = fs.readFileSync('./build/icons.ts.template', { encoding: 'utf8' })

var references = html.match(/<icon id=([^ >]*)/g).map(e => e.substr('<icon id='.length))
var iconObj = {}
for (var id of references.map(it => it.replace(/"/g, ''))) {
    if (id in typicons)
        iconObj[id] = typicons[id]
    else
        throw new Error('unknown icon ['+id+']')
}
var iconComponentSource = iconTemplate.replace('/*{{body}}*/', JSON.stringify(iconObj, null, 2))
fs.writeFileSync('./webapp/icons.ts', iconComponentSource)