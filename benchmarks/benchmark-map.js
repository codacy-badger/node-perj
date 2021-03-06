const bench = require('fastbench')
const mapLevels = new Map([
  ['fatal', 60],
  ['error', 50],
  ['warn', 40],
  ['info', 30],
  ['debug', 20],
  ['trace', 10]
])
const objLevels = {
  fatal: 60,
  error: 50,
  warn: 40,
  info: 30,
  debug: 20,
  trace: 10
}

const run = bench([
  function mapLoop (done) {
    const res = {}
    for (const [key, value] of mapLevels) {
      res[key] = value
    }
    setImmediate(done)
  },
  function objLoop (done) {
    const res = {}
    for (const prop in objLevels) {
      res[prop] = objLevels[prop]
    }
    setImmediate(done)
  }
], 10000000)

// run them two times
run(run)
