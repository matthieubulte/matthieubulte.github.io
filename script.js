
// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const canvas = document.querySelector('#my-canvas');
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#my-canvas') });
renderer.setClearColor( 0xffffff ); // set the background color to white

// Set up the cube's geometry and material
// const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const geometry = new THREE.TorusGeometry( 1, 0.4, 16, 100 );

const material = new THREE.MeshBasicMaterial({
    color: 0x000000,  // Green color
    transparent: true,  // Allow transparency
    opacity: 0.5,  // Set transparency to 50%
    wireframe: true  // Show wireframe
});
// Create the cube and add it to the scene
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

let camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
camera.position.z = 1;

// Render the scene
renderer.render(scene, camera);

// Animate the cube
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // renderer.setSize(window.innerWidth, canvas.height);
    renderer.setSize(window.innerWidth, window.innerHeight);

    let camera = new THREE.PerspectiveCamera(75, canvas.getBoundingClientRect().width / canvas.getBoundingClientRect().height, 0.1, 1000);
    camera.position.z = 1;

    // Render the scene
    renderer.render(scene, camera);
}

// Start the animation loop
animate();
