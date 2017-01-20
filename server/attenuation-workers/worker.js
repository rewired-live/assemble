const action = require('./action')
const { distance } = require('../utils')
const log = require('debug')('assemble:attenuation-worker')
const panic = err => {throw err}

process.on('message', ({room, uid}) => {
  action({room, uid})
  .then(() =>
    process.send('done')
  )
  .catch(panic)
})
