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

module.exports = {
    readDirectory,
    addDirectory
}
