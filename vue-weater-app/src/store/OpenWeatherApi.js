import axios from 'axios';

export default {
	namespaced: true,
	state: {
		cityName: "seoul",
		currentWeahter: {
			//MainView.vue에서 사용
			currentTemp: 0,
			currentHumidity: 0,
			currentWindSpeed: 0,
			currentFeelsLike: 0,
			
			//SubView.vue에서 사용
			currentSunrise: 0,
			currentSunset: 0,
			currentVisbility: 0,
		},
		hourlyWeather: [],
		images: [],
	},
	getters: {

	},
	mutations: {

	},
	actions: {
		async FETCH_OPENWEATHER_API(context) {
			const API_KEY = "6d33883aede182590de63214808976ce";
			let initialLat = 37.566826,
				initialLon = 126.9786567;

			//get() 메서드를 통해서 우리가 필요로하는 API 데이터를 호출한다.

			try {
				const res = await axios.get(
					`https://api.openweathermap.org/data/3.0/onecall?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`
				);
				
				const images = new Array();
				for(let i = 0; i < 48; i++) {
					const weatherIcon = res.data.hourly[i].weather[0].icon; //ex) "01d"
					images[i] = `@/asset/images/${weatherIcon}.png`;
				}


			} catch (error) {
				console.log(error)
			}
			// axios
			// 	.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`)
			// 	.then(response => {

			// 		let initialCityName = response.data.timezone;
			// 		let initialCurrentData = response.data.current;

			// 		this.cityName = initialCityName.split("/")[1]; // ['asia', 'seoul']

			// 		this.currentTemp = Math.round(initialCurrentData.temp); // 온도
			// 		this.TemporaryData[0].value = initialCurrentData.humidity + "%"; // 습도
			// 		this.TemporaryData[1].value = Math.round(initialCurrentData.wind_speed) + "m/s" // 풍속
			// 		this.TemporaryData[2].value = Math.round(initialCurrentData.feels_like) + "도" // 체감온도

			// 		//시간대별 날시 데이터를 제어
			// 		// this.arrayTemps = response.data.hourly;
			// 		// 24시간 데이터만 활용
			// 		for (let i = 0; i < 24; i++) {
			// 			this.arrayTemps[i] = response.data.hourly[i];
			// 		}
			// 	})
			// 	.catch(error => {
			// 		console.log(error)
			// 	})
		}
	}
}