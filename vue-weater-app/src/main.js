import { createApp } from 'vue';
import router from './routers.js'
import App from './App.vue';

import store from './store/index.js';

const app = createApp(App);

app.use(router);

app.use(store);

app.mount('#app');