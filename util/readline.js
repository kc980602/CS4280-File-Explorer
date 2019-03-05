const fe = require('./fe')
const path = require('path')
const readline = require('readline');

const appDir = path.dirname(require.main.filename);

const baseFolderURL = `${appDir}/../share`

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line',(input) => {
    console.log(`Received: ${input}`)
    // const data = await readDir(baseFolderURL)
    // printDir(data)

})

async function readDir(path) {
    const data = await readDir()
    console.log('// Directory Content')
    printDir(data)
}
