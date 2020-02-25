import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js"
import { STLLoader } from "../node_modules/three/examples/jsm/loaders/STLLoader.js"

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 7
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.getElementById("ducks").appendChild(renderer.domElement)

const COLORS = {
  BUILDING: 0x911313,
  LIGHT: 0xffffff,
  DUCK: 0xf6ff00
}
const buildings = [],
  ducks = []
const gltfLoader = new GLTFLoader()
const stlLoader = new STLLoader()
let duck

// class Building {
//   static width = 1.25
//   constructor(x, y) {
//     this.width = Building.width
//     this.height = Math.random() * (4 - 1) + 1
//     this.geometry = new THREE.BoxGeometry(this.width, this.height, 1)
//     this.material = new THREE.MeshPhongMaterial({ color: COLORS.BUILDING })
//     this.mesh = new THREE.Mesh(this.geometry, this.material)
//     this.mesh.position.x = x
//     this.mesh.position.y = y + this.height / 2

//     this.mesh.rotation.x = 0.5
//     this.mesh.rotation.y = -0.5
//   }
// }
class Building {
  constructor(x, y, geometry, facingMultiplier = 1) {
    this.geometry = geometry
    this.material = new THREE.MeshPhongMaterial({ color: COLORS.BUILDING })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.x = x
    this.mesh.position.y = y

    this.scale = -0.8
    this.mesh.scale.add(new THREE.Vector3(this.scale, this.scale, this.scale))
    this.mesh.rotation.x = -1
    this.mesh.rotation.z = 3.5 * facingMultiplier
  }
}

class Duck {
  constructor(x, y, mesh) {
    this.scale = -0.9
    this.material = new THREE.MeshPhongMaterial({ color: COLORS.DUCK })
    this.mesh = mesh
    this.mesh.position.x = x
    this.mesh.position.y = y

    this.mesh.scale.add(new THREE.Vector3(this.scale, this.scale, this.scale))
    this.mesh.rotation.x = -0.75
    this.mesh.rotation.z = 1.5
  }
}

function setup() {
  gltfLoader.load("../assets/duck.gltf", gltf => {
    duck = gltf.scene
    const offset = -5
    duck.traverse(node => {
      if (node.isMesh) {
        node.material = new THREE.MeshPhongMaterial({ color: COLORS.DUCK })
      }
    })
    for (let i = 0; i < 10; i++) {
      ducks.push(new Duck(i + offset, -1, duck.clone()))
      scene.add(ducks[i].mesh)
    }
  }),
    undefined,
    error => {
      console.error("Error loading object model: ", error)
    }
  stlLoader.load("../assets/building.stl", stlGeometry => {
    const separationFactor = 1
    const offset = -5
    const halfBuildingAmount = 5
    const gapWidth = 2
    const foregroundOffset = 1
    // Left facing buildings background
    for (let i = 0; i < halfBuildingAmount; i++) {
      buildings.push(
        new Building(i * separationFactor + offset, 0, stlGeometry, -1)
      )
      scene.add(buildings[i].mesh)
    }
    // Right facing buildings background
    for (let i = halfBuildingAmount; i < halfBuildingAmount * 2; i++) {
      buildings.push(
        new Building(i * separationFactor + offset + gapWidth, 0, stlGeometry)
      )
      scene.add(buildings[i].mesh)
    }
    //Left facing buildings foreground
    for (let i = 0; i < halfBuildingAmount; i++) {
      buildings.push(
        new Building(
          i * separationFactor + offset,
          foregroundOffset,
          stlGeometry,
          -1
        )
      )
      scene.add(buildings[i].mesh)
    }
    // Right facing buildings foreground
    for (let i = halfBuildingAmount; i < halfBuildingAmount * 2; i++) {
      buildings.push(
        new Building(
          i * separationFactor + offset + gapWidth,
          foregroundOffset,
          stlGeometry
        )
      )
      scene.add(buildings[i].mesh)
    }
  })

  const lightAmbient = new THREE.AmbientLight(COLORS.LIGHT, 0.2)
  scene.add(lightAmbient)

  const lightLeft = new THREE.DirectionalLight(COLORS.LIGHT, 0.8)
  lightLeft.position.x = -2
  scene.add(lightLeft)

  const lightRight = new THREE.DirectionalLight(COLORS.LIGHT, 1)
  lightRight.position.x = 2
  scene.add(lightRight)
}

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  for (let duck of ducks) {
    duck.mesh.position.x +=
      Math.sin(((performance.now() % 5000) / 5000) * Math.PI * 2) * 0.1
    duck.mesh.rotation.z = Math.sin(
      ((performance.now() % 5000) / 5000) * Math.PI * 2
    )
  }
}

setup()
animate()
