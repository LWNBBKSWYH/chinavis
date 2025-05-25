import { createApp } from 'vue';
import App from './App.vue';  // 确保路径正确
import router from './router';
import './assets/main.css';

const app = createApp(App);
app.use(router);
app.mount('#app');