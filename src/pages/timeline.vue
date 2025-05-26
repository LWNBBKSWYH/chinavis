<template>
    <div class="timeline-container">
        <!-- 地图容器 -->
        <div ref="mapContainer" class="map-container"></div>

        <!-- 时间轴控件 -->
        <div class="timeline-control">
            <input type="range" v-model="currentYear" min="-700" max="2023" step="100" @input="updateMap"
                class="timeline-slider">
            <div class="year-display callig-text">{{ displayYear }}</div>
        </div>

        <!-- 历史事件卡片 -->
        <div class="event-card" v-if="currentEvent">
            <h3 class="callig-text">{{ currentEvent.title }}</h3>
            <p>{{ currentEvent.description }}</p>
            <img :src="currentEvent.image" alt="历史图片">
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

const mapContainer = ref(null)
const currentYear = ref(0)
const currentEvent = ref(null)
const map = ref(null) // 存储地图实例

// 朝代分段数据示例
const timelineData = [
    { year: -700, name: '春秋战国', event: '诸侯国开始修筑城墙' },
    { year: -221, name: '秦朝', event: '秦始皇连接各国长城' },
    // 其他朝代数据...
]

onMounted(() => {
    // 初始化MapLibre地图
    map.value = new maplibregl.Map({
        container: mapContainer.value,
        style: 'https://demotiles.maplibre.org/style.json', // 使用默认样式或自定义样式URL
        center: [116.4, 40.2], // 北京大致坐标
        zoom: 5
    })

    // 添加长城图层
    map.value.on('load', () => {
        updateMapSource(map.value)
    })
})

function updateMapSource(mapInstance) {
    // 这里添加或更新地图数据源和图层
    // 示例：添加长城图层
    mapInstance.addSource('great-wall', {
        type: 'geojson',
        data: 'path/to/great_wall.geojson' // 替换为实际的长城GeoJSON数据路径
    })
    
    mapInstance.addLayer({
        id: 'great-wall-layer',
        type: 'line',
        source: 'great-wall',
        paint: {
            'line-color': '#ff0000',
            'line-width': 2
        }
    })
}

function updateMap() {
    // 根据年份更新地图显示
    const period = dynasticPeriods.find(p =>
        currentYear.value >= p.start && currentYear.value <= p.end
    )
    currentEvent.value = period?.events.find(e =>
        currentYear.value >= e.start && currentYear.value <= e.end
    )
    
    // 可以根据年份更新地图样式或数据
    if (map.value) {
        // 示例：根据年份改变长城颜色
        const color = getColorByYear(currentYear.value)
        map.value.setPaintProperty('great-wall-layer', 'line-color', color)
    }
}

function getColorByYear(year) {
    // 根据年份返回不同颜色
    if (year < 0) return '#8b4513' // 公元前 - 棕色
    if (year < 1000) return '#ff4500' // 公元1-1000年 - 橙红色
    return '#ff0000' // 现代 - 红色
}

const displayYear = computed(() => {
    return currentYear.value < 0 ?
        `公元前${Math.abs(currentYear.value)}年` :
        `公元${currentYear.value}年`
})
</script>

<style scoped>
.timeline-container {
    position: relative;
    width: 100%;
    height: 100vh;
}

.map-container {
    width: 100%;
    height: 100%;
}

.timeline-control {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.8);
    padding: 10px 20px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.timeline-slider {
    width: 400px;
}

.year-display {
    min-width: 120px;
    text-align: center;
    font-size: 1.2em;
}

.event-card {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.9);
    padding: 15px;
    border-radius: 5px;
    max-width: 300px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.callig-text {
    font-family: 'STKaiti', 'KaiTi', serif;
}
</style>