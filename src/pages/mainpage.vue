<template>
    <div class="main-container">
        <h1 v-if="!isEarthLoaded" class="loading-text">Loading Main Page...</h1>
        <!-- 3D地球容器 -->
        <div ref="earthContainer" class="earth-container"></div>
        <!-- 导航菜单 -->
        <nav class="main-nav">
            <button v-for="btn in navButtons" :key="btn.mode" @click="enterMode(btn.mode)" class="nav-btn">
                <span class="callig-text">{{ btn.text }}</span>
            </button>
        </nav>
        <!-- 标题 -->
        <h1 class="main-title">
            <span class="callig-text">长城·千秋</span>
        </h1>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const earthContainer = ref(null)
const isEarthLoaded = ref(false)

// 导航按钮配置
const navButtons = [
    { mode: 'timeline', text: '岁月年轮' },
    { mode: 'map', text: '雄关漫道' },
    { mode: 'story', text: '史诗传颂' }
]

// Three.js相关变量
const scene = ref(null)
const camera = ref(null)
const renderer = ref(null)
const earth = ref(null)
const chinaMarker = ref(null)
const animationId = ref(null)

// 初始化3D地球
onMounted(() => {
    initThreeJS()
    initEarth()
    initLights()
    initChinaMarker()
    initAnimation()

    window.addEventListener('resize', handleResize)
    isEarthLoaded.value = true
})

// 组件卸载时清理
onUnmounted(() => {
    cancelAnimationFrame(animationId.value)
    window.removeEventListener('resize', handleResize)
    if (renderer.value) {
        renderer.value.dispose()
    }
})

function initThreeJS() {
    // 初始化场景
    scene.value = new THREE.Scene()
    scene.value.background = null

    // 初始化相机
    camera.value = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.value.position.z = 10

    // 初始化渲染器
    renderer.value = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    })
    renderer.value.setPixelRatio(window.devicePixelRatio)
    renderer.value.setSize(
        earthContainer.value.clientWidth,
        earthContainer.value.clientHeight
    )
    earthContainer.value.appendChild(renderer.value.domElement)
}

function initEarth() {
    // 创建地球
    const geometry = new THREE.SphereGeometry(5, 128, 128)
    const texture = new THREE.TextureLoader().load('/textures/earth-dark.jpg')
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        specular: new THREE.Color(0x111111),
        shininess: 5
    })
    earth.value = new THREE.Mesh(geometry, material)
    scene.value.add(earth.value)
}

function initLights() {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040)
    scene.value.add(ambientLight)

    // 点光源
    const pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(10, 10, 10)
    scene.value.add(pointLight)
}

function initChinaMarker() {
    // 更精确的中国区域标记
    const group = new THREE.Group()

    // 中国轮廓（简化版）
    const shape = new THREE.Shape()
    shape.moveTo(0.5, 0.3)
    shape.lineTo(0.7, 0.35)
    shape.lineTo(0.8, 0.5)
    shape.lineTo(0.75, 0.65)
    shape.lineTo(0.6, 0.7)
    shape.lineTo(0.5, 0.6)
    shape.lineTo(0.4, 0.65)
    shape.lineTo(0.3, 0.55)
    shape.lineTo(0.35, 0.4)
    shape.lineTo(0.5, 0.3)

    const extrudeSettings = {
        depth: 0.1,
        bevelEnabled: false
    }
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    const material = new THREE.MeshPhongMaterial({
        color: 0x8B4513,
        transparent: true,
        opacity: 0.8,
        emissive: 0x8B4513,
        emissiveIntensity: 0.2,
        shininess: 30
    })

    chinaMarker.value = new THREE.Mesh(geometry, material)
    chinaMarker.value.scale.set(8, 8, 8)
    chinaMarker.value.position.set(-3, 1, 0)
    chinaMarker.value.rotation.y = -0.5

    group.add(chinaMarker.value)
    scene.value.add(group)
}

function initAnimation() {
    // 初始动画：聚焦中国
    new TWEEN.Tween(camera.value.position)
        .to({ x: -3, y: 1, z: 8 }, 2500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
        .onComplete(() => {
            // 动画完成后开始缓慢旋转
            animate()
        })
}

function animate() {
    animationId.value = requestAnimationFrame(animate)
    TWEEN.update()

    // 更平滑的旋转
    earth.value.rotation.y += 0.0005

    // 中国标记的脉动效果
    if (chinaMarker.value) {
        chinaMarker.value.scale.x = 8 + Math.sin(Date.now() * 0.001) * 0.1
        chinaMarker.value.scale.y = 8 + Math.sin(Date.now() * 0.001) * 0.1
    }

    renderer.value.render(scene.value, camera.value)
}

function handleResize() {
    camera.value.aspect = earthContainer.value.clientWidth / earthContainer.value.clientHeight;
    camera.value.updateProjectionMatrix();
    renderer.value.setSize(
        earthContainer.value.clientWidth,
        earthContainer.value.clientHeight
    );
}
function enterMode(mode) {
    // 添加转场动画
    new TWEEN.Tween(camera.value.position)
        .to({ z: 20 }, 800)
        .easing(TWEEN.Easing.Quadratic.In)
        .start()
        .onComplete(() => {
            router.push(`/${mode}`)
        })
}
</script>

<style scoped>
.main-container {
    position: fixed;
    /* 改为fixed定位 */
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: linear-gradient(to right, #1a1a1a, #2d1e0f);
}

.loading-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #e6d5b8;
    font-size: 2rem;
    z-index: 10;
}

.earth-container {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: v-bind('isEarthLoaded ? 1 : 0');
    transition: opacity 0.5s ease;
}

.main-nav {
    position: absolute;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 2rem;
    z-index: 100;
}

.nav-btn {
    background: rgba(90, 70, 50, 0.3);
    border: 1px solid #8B4513;
    color: #e6d5b8;
    padding: 0.8rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 1rem;
    backdrop-filter: blur(5px);
    min-width: 120px;
}

.nav-btn:hover {
    background: rgba(139, 69, 19, 0.6);
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.main-title {
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
    color: #e6d5b8;
    font-size: clamp(2rem, 5vw, 4rem);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    letter-spacing: 0.5rem;
    opacity: 0.9;
    animation: fadeIn 2s ease-in-out;
}

.callig-text {
    font-family: 'STXingkai', 'KaiTi', 'SimSun', serif;
    font-weight: 400;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -20px);
    }

    to {
        opacity: 0.9;
        transform: translate(-50%, 0);
    }
}

@media (max-width: 768px) {
    .main-nav {
        flex-direction: column;
        gap: 1rem;
        bottom: 10%;
    }

    .nav-btn {
        padding: 0.6rem 1rem;
        min-width: 100px;
    }
}
</style>