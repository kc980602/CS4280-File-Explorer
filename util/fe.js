const fs = require('fs')
const path = require('path')
const moment = require('moment')
const FileItem = require('../data/DataClass')
const columnify = require('columnify');

const appDir = path.dirname(require.main.filename);
const baseFolderURL = `${appDir}/../share/`

async function init() {
    await checkShareFolder()
    printDir(await readDir())
}

async function checkShareFolder() {
    if (!fs.existsSync(baseFolderURL)) {
        console.log('share folder created')
        makeDir()
    }
}

function checkFolderExist(path) {
    return fs.existsSync(path)
}

function checkIsSubConFolder(target) {
    const relative = path.relative(baseFolderURL, target);
    return !!relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

async function readDir(target = '') {
    const records = []
    let targetDir = baseFolderURL + target
    if (!await checkFolderExist(targetDir)) {
        return false
    }
    if (!checkIsSubConFolder(targetDir))
        targetDir = baseFolderURL

    const files = fs.readdirSync(targetDir)
    files.forEach(file => {
        records.push(() => fileStat(targetDir, file))
    })
    const recPromises = records.map(task => task())
    return Promise.all(recPromises).then(result => {
        return result
    })
}

function fileStat(basePath, file) {
    return new Promise(resolve => {
        fs.stat(basePath + '/' + file, (err, stats) => {
            resolve(new FileItem(file, stats.isFile() ? '-f' : '-d', stats.size, moment(stats.mtimeMs).format('DD-MM-YYYY hh:mm:ss'), path.join(basePath.replace(baseFolderURL, ''), file), []))
        })
    })
}

function makeDir(path = '') {
    fs.mkdir(baseFolderURL + path, {recursive: true}, (err) => {
        return !err
    })
}
async function createDirectory(path = '') {
    return new Promise(async (resolve, reject) => {
        fs.mkdir(baseFolderURL + path, {recursive: true}, (err) => {
            if (err) reject(err)
            else resolve()
        })
    }).then(() => true, err => false)

}

async function removeItem(path) {
    return new Promise(async (resolve, reject) => {
        if (!path) reject()
        fs.stat(baseFolderURL + path, (err, stats) => {
            if (stats.isDirectory()) {
                fs.rmdir(baseFolderURL + path, (err) => {
                    console.log(err)
                    if (err) reject(err)
                    else resolve()
                })
            } else {
                fs.unlink(baseFolderURL + path, (err) => {
                    console.log(err)
                    if (err) reject(err)
                    else resolve()
                })
            }
        })
    }).then(() => true, err => false)
}

async function renameDirectory(oldPath, newPath) {
    return new Promise(async (resolve, reject) => {
        if (!oldPath && !newPath) reject()
        fs.rename(baseFolderURL + oldPath, baseFolderURL + newPath, (err) => {
            console.log(err)
            if (err) reject(err);
            else resolve();
        })
    }).then(() => true, err => false)
}

async function writeFile(target = '', file) {
    return new Promise(async (resolve, reject) => {
        fs.readFile(file.path, function (err, data) {
            console.log('sdfsdf', baseFolderURL + path.join(target, file.originalname))
            fs.writeFile(baseFolderURL + path.join(target, file.originalname), data, function (err) {
                if (err) reject(err);
                else resolve();
            });
        })

    }).then(() => true, err => false)
}

function printDir(records) {
    console.log('// Directory Content')
    console.log(columnify(records, {
        include: ['type', 'name', 'size', 'dateModified']
    }))
}

module.exports = {
    init,
    checkShareFolder,
    checkFolderExist,
    readDir,
    makeDir,
    createDirectory,
    renameDirectory,
    writeFile,
    removeItem,
    printDir
}
