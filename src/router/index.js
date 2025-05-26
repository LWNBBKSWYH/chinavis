import { createRouter, createWebHistory } from 'vue-router';
import mainpage from '../pages/mainpage.vue';           
import mapexplorer from '../pages/mapexplorer.vue';
import storyview from '../pages/storyview.vue';  
import timeline from '../pages/timeline.vue';

const routes = [
    { 
        path: '/',
        redirect: '/mainpage',
    },
    {
        path: '/mainpage',
        name: 'MainPage',
        component: mainpage,
    },
    {
        path: '/mapexplorer',
        name: 'MapExplorer',
        component: mapexplorer,
    },
    {
        path: '/storyview',
        name: 'StoryView',
        component: storyview,
    },
    {
        path: '/timeline',
        name: 'TimeLine',
        component: timeline,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;