const fs = require('fs')
const path = require('path')
const moment = require('moment')
const FileItem = require('../data/DataClass')
const columnify = require('columnify');


const appDir = path.dirname(require.main.filename);

const baseFolderURL = `${appDir}/../share`

async function init() {
    const data = await readDir(baseFolderURL)
    console.log('// Directory Content')
    printDir(data)
}

async function checkShareFolder() {
    if (!fs.existsSync(baseFolderURL)) {
        console.log('share folder created')
        makeDir(baseFolderURL)
    }
}

function checkFolderExist(path = baseFolderURL) {
    return fs.existsSync(path)
}

async function readDir(path) {
    await checkShareFolder()
    const records = []
    const files = fs.readdirSync(path)
    files.forEach(file => {
        records.push(() => fileStat(path, file))
    })
    const recPromises = records.map(task => task())
    return Promise.all(recPromises).then(result => {
        return result
    })
}

function fileStat(basePath, file) {
    return new Promise(resolve => {
        fs.stat(basePath + '/' + file, (err, stats) => {
            resolve(new FileItem(stats.isFile() ? '-f' : '-d', file, stats.size, moment(stats.mtimeMs).format('DD-M-YYYY hh:mm:ss')))
        })
    })
}

function makeDir(path) {
    fs.mkdir(path, {recursive: true}, (err) => {
        if (err) console.error('Fail to create folder.', err)
    })
}

function printDir(records) {
    console.log(columnify(records))
}

module.exports = {
    init,
    checkShareFolder,
    checkFolderExist,
    readDir,
    makeDir
}
