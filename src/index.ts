#!/usr/bin/env node

import program from 'commander'
import server from './server'
const pkg = require('../package')

const description = `
  Running elfiejs will launch a local web server which hosts a
  browser application. The app will capture your keyboard and send
  the keystrokes to the server part, which in turn will control the
  ELFIE drone. Make sure that your computer is connected to your
  drone's wireless network before running elfiejs.
`

let port = 3000

program
  .version(pkg.version, '-v, --version')
  .description(description.trim())
  .usage('[options]')
  .option('-p, --port <number>', 'port number of the web server', setPort)
  .parse(process.argv)

function setPort (val) {
  port = Number(val)
}

server.listen(port, function () {
  console.log('Open http://localhost:' + port, 'to control your drone')
})
