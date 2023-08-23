<template>
    <div class="rightContainer">
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
                <div class="airCondition">
                    <p>{{ feelingText }}</p>
                </div>
                <div class="detail">
                    <div class="title">
                        <p>상세 날씨 데이터</p>
                    </div>
                    <div class="data" v-for="(detailData, index) in subWeatherData" :key="index">
                        <div class="dataName">
                            <p></p>
                            <p>{{ detailData.name }}</p>
                        </div>
                        <div class="dataValue">
                            <p>{{ detailData.value }}<span></span></p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <MainMap></MainMap>
        <nav>
            <i class="fa-solid fa-house-chimney"></i>
            <i class="fa-solid fa-magnifying-glass-plus"></i>
            <i class="fa-solid fa-chart-line"></i>
            <i class="fa-solid fa-gear"></i>
        </nav>
    </div>
</template>

<script>
import MainMap from './MainMap.vue';
import { ref } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import "dayjs/locale/ko";
dayjs.locale("ko");

export default {
    components: {
        MainMap,
    },
    setup() {
        //화면에 보여질 데이터
        let currentTime = dayjs().format("YYYY, MM, DD ddd"), //현재시간
            cityName = ref(''), //도시 이름
            feelingText = ref(''), //현재 온도에 대한 체감을 나타내는 데이터
            subWeatherData = ref([]);

        //타임스탬프로 변환
        const Unix_timestemp = (dt) => {
            let date = new Date(dt * 1000);
            let hour = "0"  + date.getHours();
            return hour.substring(-2) + "시";
        }

        //OpenWeatherAPI 호출 함수
        const fetchOpenWeatherApi = async () => {
            //API 호출을 위한 함수 데이터
            const API_KEY = "6d33883aede182590de63214808976ce";
            let initialLat = 37.566826,
                initialLon = 126.9786567;

            try {
                const res = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`);
                console.log(res)

                let isInitialData = res.data.current, //초기데이터
                    isInitialCityName = res.data.timezone, //초기 도시이름 데이터
                    isFeelLikeTemp = isInitialData.feels_like, //초기 체감온도 데이터
                    isTimeOfSunrise = isInitialData.sunrise, // 일출시간 데이터
                    isTimeOfSunSet = isInitialData.sunset, //일몰시간 데이터
                    isLineOfSight = isInitialData.visibility; // 가시거리 데이터

                if(isFeelLikeTemp > 30) feelingText.value = "매우 더움";
                if(isFeelLikeTemp <= 30) feelingText.value = "더움";
                if(isFeelLikeTemp <= 23) feelingText.value = "보통";
                if(isFeelLikeTemp <= 17) feelingText.value = "선선함";
                if(isFeelLikeTemp <= 10) feelingText.value = "쌀쌀함";
                if(isFeelLikeTemp <= 4) feelingText.value = "추움";
                if(isFeelLikeTemp <= -10) feelingText.value = "매우추움";




                //가공할 or 가공한 데이터를 가지고 새로운 배열을 생성
                // 우리가 새로운 배열을 만들어주는 이유는 template 부분에서v-for을 좀 더 편하게 쓰기 위해서
                let isProcessedData = [
                    {name : "일출시간", value : Unix_timestemp(isTimeOfSunrise)},
                    {name : "일몰시간", value : Unix_timestemp(isTimeOfSunSet)},
                    {name : "가시거리", value : isLineOfSight.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + 'm'},
                ]

                //데이터 할당
                cityName.value = isInitialCityName.split("/")[1];
                subWeatherData.value = isProcessedData;
                
            } catch (error) {
                console.log("a")
            }
        }
        //함수 호출
        fetchOpenWeatherApi();

        return {
            currentTime,
            cityName,
            subWeatherData,
            feelingText
        }
    }
}
</script>

<style lang='scss' scoped>
@import '@/scss/index.scss';

.rightContainer {
    /* width: 40%;
    height: 100%; */
    width: 324px;
    min-width: 324px;
    height: 700px;
    border-radius: 50px;
    background: linear-gradient(#cb0000, #0e1239);
    box-shadow: 5px 5px 10px gray;

    #cityNameBox {
        width: 100%;
        height: 10%;

        .cityName {
            @include c-center;
            width: 100%;
            height: 100%;

            p {
                color: white;
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
        height: calc(45% - 16px);
        margin-top: 16px;

        .buttonBox {
            @include center;
            width: 100%;
            height: 20%;

            .buttonBackground {
                width: 224px;
                height: 35px;
                background-color: #370505;
                border-radius: 10px;
                display: flex;

                button {
                    width: 112px;
                    height: 35px;
                    border: 0;
                    border-radius: 7.5px;
                    outline: 0;
                    cursor: pointer;

                    &.forecast {
                        background-color: transparent;
                        color: #a52727;
                    }

                    &.airquality {
                        background: #ff0000;
                        color: white;
                    }
                }
            }
        }

        .weatherBox {
            width: 100%;
            height: 80%;

            .airCondition {
                @include center;
                width: 100%;
                height: 35%;

                p {
                    text-align: center;
                    font-size: 2.25rem;
                    font-weight: 500;
                    font-family: 'Be Vietnam Pro', sans-serif;
                    color: #fff;
                }
            }

            .detail {
                width: 100%;
                height: 65%;

                .title {
                    @include center;
                    width: 100%;
                    height: 25%;
                    color: white;

                    p {
                        font-family: 'LeferiPoint-WhiteObliqueA';
                    }
                }

                .data {
                    display: flex;
                    width: 100%;
                    height: 27.5%;
                    // background-color: rgb(187, 127, 255);
                    font-family: 'Be Vietnam Pro', sans-serif;

                    .dataName {
                        display: flex;
                        align-items: center;
                        width: 50%;
                        height: 100%;
                        font-family: 'Be Vietnam Pro', sans-serif;

                        p {
                            &:first-child {
                                display: block;
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                background-color: #ffde23;
                                margin-left: 50px;
                            }

                            &:last-child {
                                margin-left: 10px;
                                color: white;
                                font-weight: 300;
                                font-size: 0.9rem;
                            }
                        }
                    }

                    .dataValue {
                        display: flex;
                        align-items: center;
                        justify-content: right;
                        width: 50%;
                        height: 100%;
                        font-family: 'Be Vietnam Pro', sans-serif;

                        p {
                            color: white;
                            font-weight: 300;
                            margin-right: 50px;

                            span {
                                font-weight: 600;
                            }
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
            color: rgb(255, 255, 255);
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