<template>
	<div class="leftContainer">
		<div id="cityNameBox">
			<div class="cityName">
				<p>{{ cityName }}</p>
				<p>{{ currentTime }}</p>
			</div>
		</div>
		<div id="contentsBox">
			<div class="buttonBox">
				<div class="buttonBackground">
					<button class="forecast">Forecast</button>
					<button class="airquality">Airquality</button>
				</div>
			</div>
			<div class="weatherBox">
				<div class="wertherDegree">
					<p>{{ currentTemp }}&deg;</p>
				</div>
				<div class="weatherIcon">
					<img src="@/assets/images/43.png" alt="MainLogo">
				</div>
				<div class="weatherData">
					<div v-for="Temporary in TemporaryData" :key="Temporary.title" class="detailData">
						<p>{{ Temporary.title }}</p>
						<p>{{ Temporary.value }}</p>
					</div>
				</div>
			</div>

		</div>
		<div id="todayWeather">
			<div class="textBox">
				<p>시간대별 날씨 정보</p>
				<p>이번주 날씨 보기</p>
			</div>
			<div class="timelyWeatherBox">
				<div class="timelyWeather" v-for="(temp, index) in arrayTemps" :key="index">
					<div class="icon">
						<img src="@/assets/images/29.png" alt="#">
					</div>
					<div class="data">
						<p class="time">{{ Unix_timestemp(temp.dt) }}</p>
						<p class="currentDegree">{{ Math.round(temp.temp) }}&deg;</p>
						<div>
							<img src="@/assets/images/drop.png" alt="#">
							<p class="fall">{{ temp.humidity }}%</p>
						</div>
					</div>
				</div>

			</div>
		</div>
		<nav>
			<i class="fa-solid fa-house-chimney"></i>
			<i class="fa-solid fa-magnifying-glass-plus"></i>
			<i class="fa-solid fa-chart-line"></i>
			<i class="fa-solid fa-gear"></i>
		</nav>
	</div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko'
dayjs.locale("ko");

export default {
	data() {
		return {
			//현재 시간을 나타내기 위한 Day.js 플러그인 사용
			currentTime: dayjs().format("YYYY, MM, DD ddd"),
		}
	},
	async created() {
		//초기 데이터 선언을 위한 코드 작성
		//Vuex Store의 Mutations를 호출할 때는 commit() 메서드를 사용한다.
		//Vuex Store의 Actice를 호출할 때는 dispatch() 메서드를 사용한다.
		await this.$store.dispatch("OpenWeatherApi/FETCH_OPENWEATHER_API");
		const { currentTemp, currentHumidity, currentWindSpeed, currentFeelsLike } = this.$store.state.OpenWeatherApi.currentWeahter;

		this.currentTemp = currentTemp;
		this.TemporaryData[0].value = currentHumidity + "%";
		this.TemporaryData[1].value = currentWindSpeed + "m/s";
		this.TemporaryData[2].value = currentFeelsLike + "도";
		this.arrayTemps = this.$store.state.OpenWeatherApi.hourlyWeather;
		this.arrayIcons = this.$store.state.OpenWeatherApi.images;
	},
	computed: {
		// 마커를 선택했을 때, 레이아웃에 보여지는 도시이름
		cityName() {
			return this.$store.state.OpenWeatherApi.cityName;
		},
		
		// 현재 시간에 따른 현재온도데이터
		currentTemp() {
			
		}
	},
	methods: {
		Unix_timestemp(dt) {
			let date = new Date(dt * 1000);
			let hour = "0" + date.getHours();
			return hour.substring(-2) + "시";
		}
	}
}
</script>

<style lang="scss" scoped>
@import "@/scss/index.scss";

.leftContainer {
	width: 324px;
	height: 700px;
	border-radius: 50px;
	background: linear-gradient(#16455f, #0e1239);
	box-shadow: 5px 5px 10px gray;

	#cityNameBox {
		width: 100%;
		height: 10%;

		.cityName {
			@include c-center;
			width: 100%;
			height: 100%;

			p {
				color: #fff;
				font-family: 'Poppins', sans-serif;
				line-height: 2.5;
				text-align: center;

				&:first-child {
					width: 241px;
					height: 33px;
					font-size: 1.35rem;
				}

				&:last-child {
					width: 160px;
					height: 19px;
					font-size: 0.9rem;
					font-weight: 100;
				}
			}
		}
	}

	#contentsBox {
		width: 100%;
		height: 62.5%;

		.buttonBox {
			@include center;
			width: 100%;
			height: 20%;

			.buttonBackground {
				width: 224px;
				height: 35px;
				background-color: #052137;
				border-radius: 10px;
				display: flex;

				button {
					width: 112px;
					height: 35px;
					border: 0;
					border: 7.5px;
					outline: 0;
					cursor: pointer;

					&.forecast {
						background-color: #0889ff;
						color: #fff;
					}

					&.airquality {
						background: transparent;
						color: #467599;
					}
				}
			}
		}

		.weatherBox {
			width: 100%;
			height: 80%;

			.wertherDegree {
				@include center;
				width: 100%;
				height: 15%;

				p {
					font-size: 3.5rem;
					font-weight: 500;
					font-family: 'Be Vietnam Pro', sans-serif;
					color: #fff;
				}
			}

			.weatherIcon {
				@include center;
				width: 100%;
				height: 60%;

				img {
					width: 168px;
					height: 160px;
				}
			}

			.weatherData {
				display: flex;
				width: 100%;
				height: 25%;

				.detailData {
					@include c-center;
					width: 33.33%;
					height: 100%;

					//레이아웃이 3개이기 때문에 동일한 레이아웃을 반복할 수 있다.
					&:nth-child(1) {
						margin-left: 10px;
					}

					&:nth-child(2) {
						margin-left: 0 -10px;
					}

					&:nth-child(3) {
						margin-right: 10px;
					}

					p {
						line-height: 1.5;
						color: #fff;

						&:first-child {
							font-size: 1rem;
							font-weight: 300;
							font-family: 'Noto Sans KR', sans-serif;
							color: #799ed0;
						}

						&:last-child {
							font-size: 1rem;
							font-weight: 200;
							font-family: 'Poppins', sans-serif;
						}
					}
				}
			}
		}
	}

	#todayWeather {
		width: 100%;
		height: 17.5%;

		.textBox {
			@include center-sb;
			width: calc(100% - 70px);
			height: 35%;
			padding: 0 35px;
			font-family: 'Noto Sans KR', sans-serif;

			p {
				font-weight: 400;
				font-size: 0.8rem;
				color: #fff;
				text-align: center;

				&:last-child {
					font-weight: 400;
					font-size: 0.8rem;
					color: #0085ff;
					cursor: pointer;
					margin-bottom: 2px;
				}
			}
		}

		.timelyWeatherBox {
			display: flex;
			align-items: center;
			width: calc(100% - 70px);
			height: 65%;
			padding: 0 30px;
			overflow: scroll;

			-ms-overflow-style: none; //IE and Edge
			scrollbar-width: none; // Firefox

			&::-webkit-scrollbar {
				//chrome, Safari, Opera
				display: none;
			}

			.timelyWeather {
				display: flex;
				width: 126px;
				min-width: 126px;
				height: 70px;
				background-color: #0989ff;
				border-radius: 20px;
				margin-left: 15px;

				&:first-child {
					margin-left: 0;
				}


				.icon {
					@include center;
					width: 45%;
					height: 100%;

					img {
						width: 100%;
					}
				}

				.data {
					@include c-center-se;
					width: 55%;
					height: 100%;

					p {
						color: whitesmoke;
						font-family: 'Poppins', sans-serif;
						text-align: center;

						&.time {
							font-size: 0.8rem;
							font-weight: 200;
						}

						&.currentDegree {
							font-size: 1.2rem;
						}
					}

					div {
						@include center;
						width: 100%;
						height: 33.33%;

						img {
							height: 55%;
						}

						.fall {
							font-size: 0.9rem;
							margin-left: 1.5px;
						}
					}
				}
			}
		}
	}

	nav {
		@include center-sb;
		width: calc(100% - 100px);
		height: 10%;
		padding: 0 50px;

		i {
			color: #fff;
			font-size: 1.15rem;
			cursor: pointer;
			transition: all 0.2s ease;

			&:hover {
				color: #799ed0;
			}
		}
	}
}
</style>