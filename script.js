import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ==================== Global Variables ====================
let scene, camera, renderer, controls, composer, bloomPass;
let material, mesh;
let animationFrameId;

// ==================== Configuration ====================
const params = {
    // Geometry
    shape: 'Cube',
    onlyExternal: true,

    // Colors
    backgroundColor: '#141414',
    lineColor: '#5c5c5c',
    dotColor: '#33ccff',

    // Fog
    useFog: true,
    fogDensity: 0.02,

    // Bloom
    useBloom: false,
    bloomThreshold: 0.1,
    bloomStrength: 1.5,
    bloomRadius: 0.4,

    // Signal Animation
    speed: 0.1311,
    dotLength: 0.0181,
    dotDensity: 2.0,

    // Interaction
    autoRotate: true,
    autoRotateSpeed: 0.5
};

// ==================== Error Handler ====================
function showError(message) {
    console.error('🔴 Error:', message);
    const errorScreen = document.getElementById('errorScreen');
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.textContent = message;
    errorScreen.style.display = 'flex';
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
}

window.addEventListener('error', (event) => {
    showError(`${event.message} at line ${event.lineno}`);
});

window.addEventListener('unhandledrejection', (event) => {
    showError(`Promise rejection: ${event.reason}`);
});

// ==================== Scene Setup ====================
function initScene() {
    try {
        // Scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(params.backgroundColor);
        scene.fog = new THREE.FogExp2(params.backgroundColor, params.fogDensity);

        // Camera
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, -1, 30);

        // Renderer
        renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            precision: 'highp',
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 1.0;
        document.body.appendChild(renderer.domElement);

        // Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = params.autoRotate;
        controls.autoRotateSpeed = params.autoRotateSpeed;
        controls.enableZoom = true;
        controls.enablePan = true;

        // Post-processing Setup
        setupPostProcessing();

        console.log('✅ Scene initialized successfully');
    } catch (error) {
        showError(`Scene initialization failed: ${error.message}`);
    }
}

function setupPostProcessing() {
    const renderScene = new RenderPass(scene, camera);
    
    bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
    );
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
}

// ==================== Geometry Generation ====================

/**
 * Check if point is inside the mathematical volume
 */
function isPointInside(v, shapeType) {
    const x = v.x, y = v.y, z = v.z;
    const r = 12;

    switch (shapeType) {
        case 'Cube':
            return Math.abs(x) < r && Math.abs(y) < r && Math.abs(z) < r;

        case 'Sphere':
            return (x * x + y * y + z * z) < (r * r);

        case 'Pyramid':
            if (y < -r || y > r) return false;
            const scale = (r - y) / (2 * r);
            const limit = r * 2 * scale;
            return Math.abs(x) < limit && Math.abs(z) < limit;

        case 'Hexagon':
            if (Math.abs(y) > r) return false;
            const q2 = Math.abs(x);
            const r2 = Math.abs(z);
            return (q2 * 0.866 + r2 * 0.5) < r && q2 < r;

        case 'Torus':
            const tubeRadius = 4;
            const mainRadius = 10;
            const distXZ = Math.sqrt(x * x + z * z) - mainRadius;
            return (distXZ * distXZ + y * y) < (tubeRadius * tubeRadius);

        default:
            return Math.abs(x) < r && Math.abs(y) < r && Math.abs(z) < r;
    }
}

/**
 * Check if point is on the surface (boundary) of the volume
 */
function isSurface(v, shapeType, step) {
    if (!isPointInside(v, shapeType)) return false;

    const dirs = [
        new THREE.Vector3(step, 0, 0), new THREE.Vector3(-step, 0, 0),
        new THREE.Vector3(0, step, 0), new THREE.Vector3(0, -step, 0),
        new THREE.Vector3(0, 0, step), new THREE.Vector3(0, 0, -step)
    ];

    for (let d of dirs) {
        const neighbor = v.clone().add(d);
        if (!isPointInside(neighbor, shapeType)) {
            return true;
        }
    }
    return false;
}

/**
 * Find a valid starting point for the signal path
 */
function findStartPoint(shapeType, onlyExternal, step, maxAttempts = 200) {
    for (let k = 0; k < maxAttempts; k++) {
        const p = new THREE.Vector3(
            (Math.random() - 0.5) * 26,
            (Math.random() - 0.5) * 26,
            (Math.random() - 0.5) * 26
        );

        p.x = Math.round(p.x / step) * step;
        p.y = Math.round(p.y / step) * step;
        p.z = Math.round(p.z / step) * step;

        if (onlyExternal) {
            if (isSurface(p, shapeType, step)) return p;
        } else {
            if (isPointInside(p, shapeType)) return p;
        }
    }
    return new THREE.Vector3(0, 0, 0);
}

/**
 * Generate geometry for the selected shape
 */
function createShapeGeometry(shapeType, onlyExternal) {
    try {
        const positions = [];
        const attributes = [];

        const step = 2;
        const maxSegments = 6000;

        let currentPos = findStartPoint(shapeType, onlyExternal, step);
        let currentDist = 0;

        const directions = [
            new THREE.Vector3(step, 0, 0), new THREE.Vector3(-step, 0, 0),
            new THREE.Vector3(0, step, 0), new THREE.Vector3(0, -step, 0),
            new THREE.Vector3(0, 0, step), new THREE.Vector3(0, 0, -step)
        ];

        for (let i = 0; i < maxSegments; i++) {
            const dirIndex = Math.floor(Math.random() * 6);
            const direction = directions[dirIndex];
            const nextPos = currentPos.clone().add(direction);

            let isValid = false;

            if (onlyExternal) {
                if (isSurface(nextPos, shapeType, step)) {
                    isValid = true;
                }
            } else {
                if (isPointInside(nextPos, shapeType)) {
                    isValid = true;
                }
            }

            if (isValid) {
                positions.push(currentPos.x, currentPos.y, currentPos.z);
                positions.push(nextPos.x, nextPos.y, nextPos.z);

                attributes.push(currentDist);
                attributes.push(currentDist + step);

                currentDist += step;
                currentPos.copy(nextPos);
            } else {
                currentDist += 50.0;
                currentPos = findStartPoint(shapeType, onlyExternal, step);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('lineDistance', new THREE.Float32BufferAttribute(attributes, 1));
        
        console.log(`✅ Generated geometry: ${positions.length / 3} vertices`);
        return geometry;
    } catch (error) {
        showError(`Geometry generation failed: ${error.message}`);
        return new THREE.BufferGeometry();
    }
}

// ==================== Shaders ====================
const vertexShader = `
    attribute float lineDistance;
    varying float vDistance;

    void main() {
        vDistance = lineDistance;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform vec3 colorLine;
    uniform vec3 colorDot;
    uniform float uTime;
    uniform float uSpeed;
    uniform float uDotLength;
    uniform float uDotRepeat;
    uniform vec3 uFogColor;
    uniform float uFogDensity;
    uniform bool uUseFog;

    varying float vDistance;

    void main() {
        float alpha = 0.2;

        float distanceState = vDistance - uTime * uSpeed * 10.0;
        float flow = mod(distanceState, uDotRepeat * 10.0);
        float lengthVal = (uDotRepeat * 10.0) * uDotLength;

        float signal = smoothstep((uDotRepeat * 10.0) - lengthVal, (uDotRepeat * 10.0), flow);
        if (flow < (uDotRepeat * 10.0) - lengthVal) signal = 0.0;

        vec3 finalColor = mix(colorLine, colorDot, signal);
        float finalAlpha = max(alpha, signal);

        gl_FragColor = vec4(finalColor, finalAlpha);

        if (uUseFog) {
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            float fogFactor = exp2(-uFogDensity * uFogDensity * depth * depth * 1.442695);
            fogFactor = clamp(fogFactor, 0.0, 1.0);
            gl_FragColor.rgb = mix(uFogColor, gl_FragColor.rgb, fogFactor);
        }
    }
`;

// ==================== Material & Mesh ====================
function createMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            colorLine: { value: new THREE.Color(params.lineColor) },
            colorDot: { value: new THREE.Color(params.dotColor) },
            uTime: { value: 0 },
            uSpeed: { value: params.speed },
            uDotLength: { value: params.dotLength },
            uDotRepeat: { value: params.dotDensity },
            uFogColor: { value: new THREE.Color(params.backgroundColor) },
            uFogDensity: { value: params.fogDensity },
            uUseFog: { value: params.useFog }
        },
        transparent: true,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
}

function rebuildGeometry() {
    try {
        if (mesh) scene.remove(mesh);
        
        material = createMaterial();
        const geometry = createShapeGeometry(params.shape, params.onlyExternal);
        mesh = new THREE.LineSegments(geometry, material);
        scene.add(mesh);
        
        console.log('✅ Geometry rebuilt');
    } catch (error) {
        showError(`Failed to rebuild geometry: ${error.message}`);
    }
}

// ==================== GUI Setup ====================
function setupGUI() {
    try {
        const gui = new GUI({ title: 'System Core' });

        // Geometry Folder
        const fGeo = gui.addFolder('Geometry');
        fGeo.add(params, 'shape', ['Cube', 'Sphere', 'Pyramid', 'Hexagon', 'Torus'])
            .name('Form Factor')
            .onChange(rebuildGeometry);
        fGeo.add(params, 'onlyExternal')
            .name('Only External')
            .onChange(rebuildGeometry);

        // Colors Folder
        const fColors = gui.addFolder('Colors');
        fColors.addColor(params, 'backgroundColor')
            .name('Background')
            .onChange(val => {
                scene.background.set(val);
                scene.fog.color.set(val);
                material.uniforms.uFogColor.value.set(val);
            });
        fColors.addColor(params, 'lineColor')
            .name('Wire Color')
            .onChange(val => material.uniforms.colorLine.value.set(val));
        fColors.addColor(params, 'dotColor')
            .name('Signal Color')
            .onChange(val => material.uniforms.colorDot.value.set(val));

        // Signal Properties Folder
        const fSignal = gui.addFolder('Signal Props');
        fSignal.add(params, 'speed', 0.05, 2.0)
            .name('Flow Speed')
            .step(0.01)
            .onChange(val => material.uniforms.uSpeed.value = val);
        fSignal.add(params, 'dotLength', 0.01, 0.5)
            .name('Signal Tail')
            .step(0.01)
            .onChange(val => material.uniforms.uDotLength.value = val);
        fSignal.add(params, 'dotDensity', 1.0, 10.0)
            .name('Density (1/Freq)')
            .step(0.1)
            .onChange(val => material.uniforms.uDotRepeat.value = val);

        // Rendering Folder
        const fRender = gui.addFolder('Rendering');
        
        // Fog
        fRender.add(params, 'useFog')
            .name('Fog Enabled')
            .onChange(val => material.uniforms.uUseFog.value = val);
        fRender.add(params, 'fogDensity', 0.0, 0.1)
            .name('Fog Density')
            .step(0.001)
            .onChange(val => {
                scene.fog.density = val;
                material.uniforms.uFogDensity.value = val;
            });

        // Bloom
        fRender.add(params, 'useBloom')
            .name('Bloom Effect');
        fRender.add(params, 'bloomThreshold', 0.0, 1.0)
            .name('Bloom Threshold')
            .step(0.01)
            .onChange(val => bloomPass.threshold = val);
        fRender.add(params, 'bloomStrength', 0.0, 3.0)
            .name('Bloom Strength')
            .step(0.1)
            .onChange(val => bloomPass.strength = val);
        fRender.add(params, 'bloomRadius', 0.0, 1.0)
            .name('Bloom Radius')
            .step(0.01)
            .onChange(val => bloomPass.radius = val);

        // Interaction Folder
        const fInteraction = gui.addFolder('Interaction');
        fInteraction.add(params, 'autoRotate')
            .name('Auto Rotate')
            .onChange(val => controls.autoRotate = val);
        fInteraction.add(params, 'autoRotateSpeed', 0.1, 3.0)
            .name('Rotation Speed')
            .step(0.1)
            .onChange(val => controls.autoRotateSpeed = val);

        // Open first folder by default
        fGeo.open();

        console.log('✅ GUI initialized');
    } catch (error) {
        showError(`GUI setup failed: ${error.message}`);
    }
}

// ==================== Animation Loop ====================
const clock = new THREE.Clock();

function animate() {
    animationFrameId = requestAnimationFrame(animate);

    try {
        const time = clock.getElapsedTime();
        
        if (material) {
            material.uniforms.uTime.value = time;
        }

        if (controls) {
            controls.update();
        }

        // Render with or without bloom
        if (params.useBloom && composer) {
            composer.render();
        } else if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    } catch (error) {
        showError(`Animation error: ${error.message}`);
    }
}

// ==================== Window Events ====================
window.addEventListener('resize', () => {
    try {
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (camera) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        if (renderer) {
            renderer.setSize(width, height);
        }

        if (composer) {
            composer.setSize(width, height);
        }

        console.log(`✅ Resized to ${width}x${height}`);
    } catch (error) {
        console.error('Resize error:', error);
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    if (mesh && scene) {
        scene.remove(mesh);
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) mesh.material.dispose();
    }
    if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
    }
});

// ==================== Initialization ====================
async function init() {
    try {
        console.log('🚀 Starting Neural Network Core...');

        // Initialize Three.js
        initScene();

        // Create materials and geometry
        material = createMaterial();
        rebuildGeometry();

        // Setup GUI
        setupGUI();

        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 500);
        }

        // Start animation loop
        animate();

        console.log('✅ System initialized successfully!');
    } catch (error) {
        showError(`Initialization failed: ${error.message}`);
    }
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
