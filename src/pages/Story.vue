<template>
    <div class="story-container">
        <div class="story-scroller" ref="scroller">
            <section v-for="(section, index) in storySections" :key="index">
                <h2 class="callig-text">{{ section.title }}</h2>
                <component :is="section.contentType" :data="section.content" />
            </section>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import HorizontalScroll from 'horizontal-scroll'

// 实现横向滚动...
</script>