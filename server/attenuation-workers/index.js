const child_process = require('child_process')

const children = require('os').cpus().map(_ => ({
  process: child_process.fork('./server/attenuation-workers/worker'),
  free: true
}))

const queue = []

/* On a free worker process queued job if exists, otherwise mark as free */
children.forEach(c =>
  c.process.on('message', message => {
    const job = queue.shift()
    if (job) {
      c.process.send(job)
    } else {
      c.free = true
    }
  })
)

/* Get first free kid if one exists, otherwise undefined */
const getFirstFree = () => children.filter(c => c.free)[0]

/* Handle new jobs */
module.exports = uid => {
  const freeKid = getFirstFree()
  if (freeKid) {
    child.free = false
    child.process.send(uid)
  } else {
    queue.push(uid)
  }
}