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
import { ref, onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'

const mapContainer = ref(null)
const currentYear = ref(0)
const currentEvent = ref(null)

// 朝代分段数据示例
const timelineData = [
    { year: -700, name: '春秋战国', event: '诸侯国开始修筑城墙' },
    { year: -221, name: '秦朝', event: '秦始皇连接各国长城' },
    // 其他朝代数据...
]

onMounted(() => {
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'
    const map = new mapboxgl.Map({
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [116.4, 40.2], // 北京大致坐标
        zoom: 5
    })

    // 添加长城图层
    map.on('load', () => {
        updateMapSource(map)
    })
})

function updateMap() {
    // 根据年份更新地图显示
    const period = dynasticPeriods.find(p =>
        currentYear.value >= p.start && currentYear.value <= p.end
    )
    currentEvent.value = period?.events.find(e =>
        currentYear.value >= e.start && currentYear.value <= e.end
    )
}

const displayYear = computed(() => {
    return currentYear.value < 0 ?
        `公元前${Math.abs(currentYear.value)}年` :
        `公元${currentYear.value}年`
})
</script>

<style scoped>
/* 时间轴特有样式 */
</style>