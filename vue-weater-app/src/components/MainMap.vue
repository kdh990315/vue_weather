<template>
	<div id="mapContainer">
		<div id="map"></div>
	</div>
</template>

<script>
import MapPositions from '../../public/assets/map-positions.json';

export default {
	data() {
		return {

		}
	},
	mounted() {
		if (window.kakao && window.kakao.maps) {
			this.initMap();
		} else {
			const script = document.createElement('script');
			// /* global kakao */
			script.onload = () => kakao.maps.load(this.initMap);
			script.src =
				'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=772f7df10326077d9887b3b91e7f95a4';
			document.head.appendChild(script);
		}
	},
	methods: {
		initMap() {
			const mapContainer = document.getElementById('map'), // 지도를 표시할 div
				mapOption = {
					center: new kakao.maps.LatLng(37.564343, 126.947613), // 지도의 중심좌표
					level: 13, // 지도의 확대 레벨
				};


			const map = new kakao.maps.Map(mapContainer, mapOption);
			const positions = MapPositions.map(pos => ({
				latlng: new kakao.maps.LatLng(...pos.latlng),
				cityName: pos.cityName,
			}));

			// 마커를 생성
			positions.forEach((pos) => {
				var marker = new kakao.maps.Marker({
					position: pos.latlng, //마커의 위치
				});
				//마커가 지도 위에 표시되도록 설정한다.
				marker.setMap(map);
				// 마커를 클릭했을 때, 클릭된 마커의 좌표를 vuex store에 전달하는 방법.
				kakao.maps.event.addListener(marker, "click", () => {
					// 클릭한 위도, 경도 정보를 불러온다.
					// watch로 따로 빼지 않고, 직접 vuex store에 할당
					this.$store.commit('OpenWeatherApi/SET_CITYNAME', pos.cityName);
					this.$store.commit('OpenWeatherApi/SET_LATLON', marker.getPosition());
					this.$store.dispatch('OpenWeatherApi/FETCH_OPENWEATHER_API');
				})

				// 아래 코드는 지도 위에 마커를 제거하는 코드.
				// marker.setMap(null);


			});

		}
	}
}
</script>

<style lang="scss" scoped>
@import '@/scss/index.scss';

#mapContainer {
	@include center;
	width: 100%;
	height: 35%;

	#map {
		width: 80%;
		height: 90%;
		border-radius: 10px;
	}
}
</style>