const express = require('express');
const feService = require('../service/fe');
const errorHandler = require('../util/errorHandler')
const router = express.Router();

// /* GET home page. */
// router.get('/', async (req, res, next) => {
//   console.log(JSON.stringify(await fe.readDir()))
//   res.render('index', {
//     title: 'Express',
//     contents: JSON.stringify(await fe.readDir())
//   })
// })

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
  const json = await feService.removeDirectory(path)
  res.json()
}))

router.patch('/api/dir', errorHandler(async (req, res, next) => {
  const json = await feService.renameDirectory(req.body.oldName, req.body.newName)
  res.json(json)
}))

module.exports = router;
