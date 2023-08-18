import { createRouter, createWebHashHistory } from 'vue-router';
import HomeWeather from './pages/HomeWeather.vue';

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: HomeWeather,
			component: HomeWeather,
		}
	]
});

export default router;