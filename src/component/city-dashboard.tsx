import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Chart } from '../module/chart';
import { Data } from '../module/response';
import { getInfo } from '../service/weather-details';
import LineChart from './line-chart';
import * as d3 from 'd3';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';


function Dashboard(props: { country: string }) {

    let { city_name } = useParams();
    const [weather, setWeather] = useState<Data>()
    const [load, setLoad] = useState(false)
    const [chartData, setChartData] = useState<Chart[]>([])

    console.log(city_name);

    const parseTime = d3.timeParse("%Y-%m-%d");
    console.log(parseTime("2022-05-31")); // Tue Jun 30 2015 00:00:00 GMT-0700 (PDT)

    useEffect(() => {

        setLoad(true)

        async function getData() {
            let weatherInfo = await getInfo(city_name, props.country)

            console.log(weatherInfo);

            if (weatherInfo) {
                let list: Chart[] = []

                for (let i = 0; i < weatherInfo.weather.length; i++) {

                    list.push({
                        // date: parseTime(weatherInfo.weather[i].date),
                        date: weatherInfo.weather[i].date,
                        temp: Number(weatherInfo.weather[i].avgtempC)
                    })
                }

                console.log(list);

                setChartData(list)
                setLoad(false)
            }


        }
        getData()

        //  if (weatherInfo) setWeather(weatherInfo)
    }, [city_name])

    return (
        <div>Dashboard

            {chartData && <LineChart data={chartData} />}


            <Spin spinning={load}
                indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
            >
            </Spin>
        </div>
    )
}

export default Dashboard