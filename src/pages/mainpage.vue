<template>
    <div class="main-container">
        <!-- 长城背景层 -->
        <div class="great-wall-bg"></div>
        <!-- 加载动画 -->
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
import * as TWEEN from '@tweenjs/tween.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const earthContainer = ref(null)
const isEarthLoaded = ref(false)
const tweenGroup = new TWEEN.Group()
// 导航按钮配置
const navButtons = [
    { mode: 'TimeLine', text: '岁月年轮' },
    { mode: 'MapExplorer', text: '雄关漫道' },
    { mode: 'StoryView', text: '史诗传颂' }
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
    tweenGroup.removeAll() // <-- 清理所有动画
    window.removeEventListener('resize', handleResize)
    if (renderer.value) renderer.value.dispose()
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
    // 修改后的Tween创建（添加tweenGroup参数）
    new TWEEN.Tween(camera.value.position, tweenGroup) // <-- 这里传入tweenGroup
        .to({ x: -3, y: 1, z: 8 }, 2500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
        .onComplete(() => animate())
}

function enterMode(mode) {
    // console.log(`Attempting to navigate to: ${mode}`);
    // new Promise((resolve) => {
    //     console.log('Starting tween animation...');
    //     new TWEEN.Tween(camera.value.position, tweenGroup)
    //         .to({ z: 20 }, 800)
    //         .easing(TWEEN.Easing.Quadratic.In)
    //         .onComplete(() => {
    //             console.log('Tween animation completed');
    //             resolve();
    //         })
    //         .start();
    // })
    // .then(() => {
    //     console.log('Attempting navigation to:', mode);
    //     return router.push({ name: mode });
    // })
    // .then(() => console.log('Navigation succeeded'))
    // .catch(err => {
    //     console.error('Navigation error:', err);
    //     if (err.name === 'NavigationDuplicated') {
    //         console.log('Navigation duplicated, ignoring');
    //     }
    // });
    console.log('Direct navigation attempt');
    router.push({ name: mode })
        .then(() => console.log('Direct navigation succeeded'))
        .catch(err => console.error('Direct navigation error:', err));
}

function animate(time) {
    console.log('Animating frame...');
    animationId.value = requestAnimationFrame(animate)
    console.log('TWEEN group has', tweenGroup.getAll().length, 'active tweens');
    tweenGroup.update(time) // <-- 使用组实例更新
    
    earth.value.rotation.y += 0.0005
    
    if (chinaMarker.value) {
        const pulse = performance.now() * 0.001
        chinaMarker.value.scale.set(
            8 + Math.sin(pulse) * 0.1,
            8 + Math.sin(pulse) * 0.1,
            8
        )
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
    opacity: v-bind('isEarthLoaded ? 0.9 : 0');
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
.great-wall-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: url('/greetwalk.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    z-index: -1; /* 确保在3D地球下方 */
    
    /* 添加滤镜效果使背景更融合 */
    filter: 
        brightness(0.4) 
        contrast(1.2) 
        sepia(30%) 
        hue-rotate(-5deg);
    
    /* 渐变遮罩使顶部和底部更暗 */
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.8) 100%
        );
    }
}
/* 响应式调整 */
@media (max-width: 768px) {
    .mini-map-container {
        width: 120px;
        height: 90px;
        right: 10px;
        bottom: 80px; /* 避免与导航按钮重叠 */
    }
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