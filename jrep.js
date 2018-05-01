const symLogAssignment = Symbol('Log Levels Function Assignment')
const symStream = Symbol('Log Stream Output Function')
const symHeaders = Symbol('Log Headers')
const symTopAsString = Symbol('Top Level Property String')

const levels = { fatal: 60, error: 50, warn: 40, info: 30, debug: 20, trace: 10 }
const optionKeys = ['level', 'stream']
const defaultOptions = { level: 'info', stream: process.stdout }
// TODO: Remove the following line:
require('console-probe').apply()

module.exports = Object.freeze({
  create (obj) {
    return new Jrep(obj)
  }
})

class Jrep {
  constructor (obj) {
    this.levels = levels
    const split = splitOptions(obj)
    this.options = split.options
    this.top = split.top
    this[symTopAsString] = split.topAsString
    this[symStream] = this.options.stream
    this[symHeaders] = {}
    this[symLogAssignment]()
  }

  [symLogAssignment] () {
    Object.keys(this.levels).forEach((level) => {
      this[symHeaders][level] = `{"ver":"1","level":"${level}","lvl":${this.levels[level]}${this[symTopAsString]},"time":`
      this[level] = function (...items) {
        if (this.levels[this.options.level] > this.levels[level]) { return }
        let text = this[symHeaders][level] + (new Date()).getTime()
        const splitItems = stringifyLogItems(items)
        text += ',"msg":' + splitItems.msg
        text += ',"data":' + splitItems.data + '}'

        // const buf = Buffer.from(text + '\n', 'utf8')
        this[symStream].write(text + '\n')
      }
    })
  }

  child (options) {
    return new Jrep(Object.assign({}, this.options, this.top, options))
  }

  stringify (obj, replacer, spacer) {
    this[symStream].write(stringify(obj, replacer, spacer))
  }

  json (data) {
    this[symStream].write(stringify(data, null, 2))
  }
}

function splitOptions (options) {
  let result = {
    options: defaultOptions,
    top: {},
    topAsString: ''
  }
  if (!options) { return result }
  result.options = Object.assign({}, defaultOptions, options)
  let topKeys = []
  for (const key in result.options) {
    if (!optionKeys.includes(key)) {
      topKeys.push(key)
    }
  }
  if (topKeys.length < 1) { return result }
  for (const topKey of topKeys) {
    result.top[topKey] = result.options[topKey]
    result.topAsString += ',"' + topKey + '":' + stringify(result.options[topKey])
    delete result.options[topKey]
  }
  return result
}

function stringifyLogItems (items) {
  let result = {msg: [], data: []}
  for (const item of items) {
    if (Object.prototype.toString.call(item) === '[object String]') {
      result.msg.push(item)
      continue
    }
    if (item instanceof Error) {
      result.data.push(serializerr(item))
      result.msg.push(item.message)
      continue
    }
    result.data.push(item)
  }

  if (result.msg.length < 1) {
    result.msg = '""'
  } else if (result.msg.length === 1) {
    result.msg = result.msg[0]
  }

  if (result.data.length < 1) {
    result.data = ''
  } else if (result.data.length === 1) {
    result.data = result.data[0]
  }

  result.msg = stringify(result.msg)
  result.data = stringify(result.data)
  return result
}

// =================================================================
// Following code is from the fast-safe-stringify package.
// =================================================================

const arr = []

// Regular stringify
function stringify (obj, replacer, spacer) {
  decirc(obj, '', [], undefined)
  const res = JSON.stringify(obj, replacer, spacer)
  while (arr.length !== 0) {
    const part = arr.pop()
    part[0][part[1]] = part[2]
  }
  return res
}
function decirc (val, k, stack, parent) {
  let i
  if (typeof val === 'object' && val !== null) {
    for (i = 0; i < stack.length; i++) {
      if (stack[i] === val) {
        parent[k] = '[Circular]'
        arr.push([parent, k, val])
        return
      }
    }
    stack.push(val)
    // Optimize for Arrays. Big arrays could kill the performance otherwise!
    if (Array.isArray(val)) {
      for (i = 0; i < val.length; i++) {
        decirc(val[i], i, stack, val)
      }
    } else {
      const keys = Object.keys(val)
      for (i = 0; i < keys.length; i++) {
        const key = keys[i]
        decirc(val[key], key, stack, val)
      }
    }
    stack.pop()
  }
}

// =================================================================
// Following code is from the serializerr package.
// =================================================================

function serializerr (obj = {}) {
  const chain = protochain(obj)
    .filter(obj => obj !== Object.prototype)
  return [obj]
    .concat(chain)
    .map(item => Object.getOwnPropertyNames(item))
    .reduce((result, names) => {
      names.forEach(name => {
        result[name] = obj[name]
      })
      return result
    }, {})
}

// =================================================================
// Following code is from the protochain package.
// =================================================================

function protochain (obj) {
  const chain = []
  let target = getPrototypeOf(obj)
  while (target) {
    chain.push(target)
    target = getPrototypeOf(target)
  }

  return chain
}

function getPrototypeOf (obj) {
  if (obj == null) return null
  return Object.getPrototypeOf(Object(obj))
}