import { join } from 'path'
import { Drone } from './drone'

const drone = new Drone()

const express = require('express')
const app = express()

const http = require('http').Server(app)
const io = require('socket.io')(http)

app.use(express.static(join(__dirname, '../public')))
app.use(express.static(join(__dirname, '../node_modules/three/build')))

app.get('/', function (req, res) {
  res.sendFile(join(__dirname, '../public/index.html'))
})

let pitchAndRollMultiplier = 1

http.setPitchAndRollMultiplier = (factor) => {
  pitchAndRollMultiplier = clamp(Number(factor), 0, 1)
}

function clamp (value, min, max) {
  return Math.min(1, Math.max(0, value))
}

io.on('connection', function (socket) {
  drone.idle()

  socket.on('keys', (keys) => {
    if (keys.includes('p')) return drone.start()
    if (keys.includes('o')) return drone.stop()

    let throttle = 0
    let roll = 0
    let pitch = 0
    let yaw = 0

    if (keys.includes('w')) throttle += 1
    if (keys.includes('s')) throttle -= 1

    if (keys.includes('d')) yaw += 1
    if (keys.includes('a')) yaw -= 1
    console.log(pitchAndRollMultiplier)
    if (keys.includes('ArrowUp')) pitch += pitchAndRollMultiplier
    if (keys.includes('ArrowDown')) pitch -= pitchAndRollMultiplier

    if (keys.includes('ArrowRight')) roll += pitchAndRollMultiplier
    if (keys.includes('ArrowLeft')) roll -= pitchAndRollMultiplier

    drone.setState(throttle, roll, pitch, yaw)

    io.emit('drone-state', { throttle, roll, pitch, yaw })
  })
})

export default http
