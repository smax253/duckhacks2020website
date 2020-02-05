import * as THREE from "three/build/three.module"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerHeight / window.innerHeight,
  0.1,
  1000
)
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById("sun").appendChild(renderer.domElement)
renderer.domElement.style.position = "absolute"

// const sun = new THREE.PointLight(0xff0000, 1, 100)
// sun.position.set(50, 50, 50)
// scene.add(sun)

function Sun() {
  this.geometry = new THREE.SphereGeometry(1, 32, 32)
  this.material = new THREE.MeshPhongMaterial({
    color: 0xeef0b6,
    emissive: 0xeef0b6
  })
  this.mesh = new THREE.Mesh(this.geometry, this.material)
}

const sun = new Sun()
scene.add(sun.mesh)

camera.position.z = 5

const lightFront = new THREE.DirectionalLight(0xeef0b6, 0.9)
lightFront.position.set(0, 0, 200)
lightFront.castShadow = true
scene.add(lightFront)

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
