const fe = require('./fe')
const path = require('path')
const readline = require('readline')

const appDir = path.dirname(require.main.filename);
const root = '/'
let currPath = []

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on('line', (input) => {
    const cmdParts = input.split(' ')
    switch (cmdParts[0]) {
        case 'dir':
            cmdReadDir(cmdParts)
            break
        case 'rename':
            cmdRenameDir(cmdParts)
            break
        case 'del':
            cmdDeleteDir(cmdParts)
            break
        case 'quit':
            process.exit(0);
            break
        case 'ls':
            console.log('Your are in: /' + currPath.join('/'))
            break
        default:
            console.log('invalid command:\ndir [path]\ndel path\nrename path1 path2\nquit')
            break
    }
})

async function cmdReadDir(cmdParts) {
    let target
    if (cmdParts[1] !== undefined) {
        target = cmdParts[1].replace('%20', ' ')
        target = target.replace(/^\//, '')
    } else {
        console.log('Path not specified!')
        return
    }

    let pathURL = path.join(...currPath, target)
    if (target === '..' || target === '' || target.replace(/\//g, '') === '' || target === '.') {
        currPath = []
        pathURL = ''
    }

    const data = await fe.readDir(pathURL)
    if (data) {
        currPath = pathURL === '' ? [] : pathURL.split('/')
        fe.printDir(data)
    } else {
        rl.question('folder does not exist, create new folder? Y/N\n', async (answer) => {
            const ans = answer.toLowerCase()
            if (ans === 'y' || ans === 'yes') {
                let success = await fe.createDirectory(pathURL)
                console.log(success ? 'File Created!' : 'Command Not Supported!')
            }
        })

    }
}

async function cmdDeleteDir(cmdParts) {
    let target
    if (cmdParts[1] !== undefined) {
        target = cmdParts[1].replace('%20', ' ')
        target = target.replace(/^\//, '')
    } else {
        console.log('Path not specified!')
        return
    }

    let pathURL = path.join(...currPath, target)
    const data = await fe.removeDirectory(pathURL)
    if (data) {
        console.log('Directory deleted!')
        currPath = []
    } else {
        console.log('Directory is not empty or not found!')
    }
}

async function cmdRenameDir(cmdParts) {
    let oldPath, newPath
    if (cmdParts[1] !== undefined && cmdParts[2] !== undefined) {
        oldPath = cmdParts[1].replace('%20', ' ')
        oldPath = oldPath.replace(/^\//, '')
        newPath = cmdParts[2].replace('%20', ' ')
        newPath = newPath.replace(/^\//, '')
    } else {
        console.log('Path not specified!')
        return
    }

    const data = await fe.renameDirectory(path.join(...currPath, oldPath), path.join(...currPath, newPath))
    console.log(data)
    if (data) {
        console.log('Item rename success!')
        currPath = []
    } else {
        console.log('Item not found!')
    }
}

