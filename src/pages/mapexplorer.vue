<template>
    <div class="map-explorer">
        <!-- 主地图 -->
        <div ref="mapContainer" class="main-map"></div>

        <!-- 详情面板 -->
        <div class="detail-panel" v-if="selectedSite">
            <h3 class="callig-text">{{ selectedSite.name }}</h3>
            <div class="comparison">
                <img :src="selectedSite.historicImage" class="historic">
                <img :src="selectedSite.currentImage" class="current">
            </div>
            <p>{{ selectedSite.description }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import mapboxgl from 'mapbox-gl'

// 类似实现...
</script>