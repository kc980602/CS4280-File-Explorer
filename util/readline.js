const fe = require('./fe')
const path = require('path')
const readline = require('readline');

const appDir = path.dirname(require.main.filename);
const root = '/'
let currPath = []

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line', (input) => {
    const cmdParts = input.split(' ')
    console.log(cmdParts)
    switch (cmdParts[0]) {
        case 'dir':
            cmdReadDir(cmdParts)
            break
        case 'rename':
            break
        case 'del':
            break
        case 'quit':
            process.exit(0);
            break
        default:
            console.log('invalid command:\ndir [path]\ndel path\nrename path1 path2\nquit')
            break
    }
})

async function cmdReadDir(cmdParts) {
    let target
    if (cmdParts[1] !== undefined)
        target = cmdParts[1].replace('%20', ' ').substr(0).replace('/', '')

    if (target === '..'){
        target = currPath.length === 0 ? '' : path.dirname(target)
        console.log(target)
    }
    currPath.push(target)
    var x = path.join(...currPath)
    console.log(x)
    const data = await fe.readDir(x)
    if (data === false) {
        currPath.pop()
        console.log('cmdReadDir fail', data)
    } else {

        fe.printDir(data)
    }
    console.log(currPath, root, target, x)
}
