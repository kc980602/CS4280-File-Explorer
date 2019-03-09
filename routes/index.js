const express = require('express');
const feService = require('../service/fe')
const path = require('path')
const errorHandler = require('../util/errorHandler')
var multer = require('multer')
const router = express.Router()
var upload = multer({dest: 'uploads/'})

const appDir = path.dirname(require.main.filename);
const baseFolderURL = `${appDir}/../share/`

router.get('/api/dir', async (req, res, next) => {
    const path = req.query.path
    const json = await feService.readDirectory(path)
    res.json(json)
})

router.post('/api/dir', errorHandler(async (req, res, next) => {
    const path = req.body.path.trim()
    const json = await feService.addDirectory(path)
    res.json(json)
}))

router.delete('/api/dir', errorHandler(async (req, res, next) => {
    const path = req.query.path.split('%20').join(' ')
    const json = await feService.removeItem(path)
    res.json()
}))

router.patch('/api/dir', errorHandler(async (req, res, next) => {
    const json = await feService.renameDirectory(req.body.oldName, req.body.newName)
    res.json(json)
}))

router.post('/api/dir/upload', upload.single('file'), errorHandler(async function (req, res, next) {
    const json = await feService.writeFile(req.body.path, req.file)
    res.json(json)
}))

router.get('/api/dir/download', function(req, res){
    const file = baseFolderURL + req.query.file.split('%20').join(' ')
    res.download(file)
});


module.exports = router
