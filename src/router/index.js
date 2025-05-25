import { createRouter, createWebHistory } from 'vue-router';
import mainpage from '../pages/mainpage.vue';           
import mapexplorer from '../pages/mapexplorer.vue';
import Story from '../pages/Story.vue';  
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
        path: '/Story',
        name: 'Story',
        component: Story,
    },
    {
        path: '/timeline',
        name: 'Timeline',
        component: timeline,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;