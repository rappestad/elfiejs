'use strict'

const socket = io()
const keys = new Set()

document.addEventListener('keydown', (event) => { keys.add(event.key) })
document.addEventListener('keyup', (event) => { keys.delete(event.key) })

setInterval(() => {
  socket.emit('keys', Array.from(keys))
}, 50)

// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene()

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 100

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias: true})

// Configure renderer clear color
renderer.setClearColor('#dddddd')

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight)

// Append Renderer to DOM
document.body.appendChild(renderer.domElement)

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

var light = new THREE.DirectionalLight(0x999999)
light.position.set(0, 0, 1).normalize()
scene.add(light)

var ambient = new THREE.AmbientLight(0xcccccc)
scene.add(ambient)

var drone = new THREE.Group()

const x = 35
const y = 66
const z = 10

var geometry = new THREE.BoxGeometry(x, y, z)
var material = new THREE.MeshLambertMaterial({ color: '#655FA3' })
var body = new THREE.Mesh(geometry, material)
drone.add(body)

const arm1 = generateArm(new THREE.Vector3(x / 2, y / 2 - z / 10, 0), new THREE.Vector3(0, 0, -Math.PI / 2.5))
drone.add(arm1)

const arm2 = generateArm(new THREE.Vector3(-x / 2, y / 2 - z / 10, 0), new THREE.Vector3(0, 0, Math.PI / 2.5))
drone.add(arm2)

const arm3 = generateArm(new THREE.Vector3(-x / 2, -y / 2 + z / 10, 0), new THREE.Vector3(0, 0, -Math.PI / 2.5))
drone.add(arm3)

const arm4 = generateArm(new THREE.Vector3(x / 2, -y / 2 + z / 10, 0), new THREE.Vector3(0, 0, Math.PI / 2.5))
drone.add(arm4)

const rotor1 = generateRotor(new THREE.Vector3(0.90 * x, 0.55 * y, 0.25 * z))
drone.add(rotor1)
const rotor2 = generateRotor(new THREE.Vector3(-0.90 * x, 0.55 * y, 0.25 * z))
drone.add(rotor2)
const rotor3 = generateRotor(new THREE.Vector3(-0.90 * x, -0.55 * y, 0.25 * z))
drone.add(rotor3)
const rotor4 = generateRotor(new THREE.Vector3(0.90 * x, -0.55 * y, 0.25 * z))
drone.add(rotor4)

// Add cube to Scene
scene.add(drone)

// Render Loop
var render = function () {
  requestAnimationFrame(render)

  // Render the scene
  renderer.render(scene, camera)
}

render()

window.addEventListener('resize', onWindowResize, false)

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

const droneStateElement = document.querySelector('#drone-state')
socket.on('drone-state', (state) => {
  const newXRotation = drone.rotation.x - 0.5 * state.pitch * Math.PI / 4
  drone.rotation.x = (newXRotation < 0)
    ? Math.max(-state.pitch * Math.PI / 4, newXRotation)
    : Math.min(-state.pitch * Math.PI / 4, newXRotation)

  const newYRotation = drone.rotation.y + 0.5 * state.roll * Math.PI / 6
  drone.rotation.y = (newYRotation < 0)
    ? Math.max(state.roll * Math.PI / 4, newYRotation)
    : Math.min(state.roll * Math.PI / 4, newYRotation)

  const newZRotation = drone.rotation.z - 0.5 * state.yaw * Math.PI / 12
  drone.rotation.z = (newZRotation < 0)
    ? Math.max(-state.yaw * Math.PI / 12, newZRotation)
    : Math.min(-state.yaw * Math.PI / 12, newZRotation)

  rotor1.rotation.z += 0.2 + state.throttle * 0.2
  rotor2.rotation.z += 0.2 + state.throttle * 0.2
  rotor3.rotation.z += 0.2 + state.throttle * 0.2
  rotor4.rotation.z += 0.2 + state.throttle * 0.2

  droneStateElement.innerHTML = JSON.stringify(state)
})

function generateArm (position, rotation) {
  const geometry = new THREE.BoxGeometry(z / 5, y / 2, z / 5)
  const material = new THREE.MeshLambertMaterial({ color: '#655FA3' })
  const arm = new THREE.Mesh(geometry, material)

  arm.position.x = position.x
  arm.position.y = position.y
  arm.position.z = position.z

  arm.rotation.x = rotation.x
  arm.rotation.y = rotation.y
  arm.rotation.z = rotation.z

  return arm
}

function generateRotor (position) {
  const rotor = new THREE.Group()

  const geometry1 = new THREE.BoxGeometry(1, 0.65 * x, 0.25)
  const material1 = new THREE.MeshLambertMaterial({ color: '#655FA3' })
  const part1 = new THREE.Mesh(geometry1, material1)
  part1.rotation.z = Math.PI / 4
  rotor.add(part1)

  const geometry2 = new THREE.BoxGeometry(1, 0.65 * x, 0.25)
  const material2 = new THREE.MeshLambertMaterial({ color: '#655FA3' })
  const part2 = new THREE.Mesh(geometry2, material2)
  part2.rotation.z = -Math.PI / 4
  rotor.add(part2)

  rotor.position.x = position.x
  rotor.position.y = position.y
  rotor.position.z = position.z

  return rotor
}
