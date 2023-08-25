import { createStore } from "vuex";
import OpenWeatherApi from './OpenWeatherApi.js';

export default createStore({
	modules: {
		OpenWeatherApi,
	}
})