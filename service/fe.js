const fe = require('../util/fe')

async function readDirectory(path) {
    const data = await fe.readDir(path)
    const folder = []
    const file = []
    for (const item of data) {
        item.type === '-d' ? folder.push(item) : file.push(item)
    }
    return {
        folder: folder,
        file: file
    }
}

async function addDirectory(path) {
    const data = await fe.createDirectory(path)
    if (!data) throw {code: 400, message: 'Fail to create directory!'}
    return {
        success: data
    }
}

async function removeDirectory(path) {
    const data = await fe.removeDirectory(path)
    if (!data) throw {code: 400, message: 'Fail to remove item!'}
    return {
        success: data
    }
}

async function renameDirectory(oldPath, newPath) {
    const data = await fe.renameDirectory(oldPath, newPath)
    if (!data) throw {code: 400, message: 'Fail to rename item!'}
    return {
        success: data
    }
}

module.exports = {
    readDirectory,
    addDirectory,
    removeDirectory,
    renameDirectory
}
