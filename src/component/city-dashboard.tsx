import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Chart } from '../module/chart';
import { Data, Hourly, Weather } from '../module/response';
import { getHistoricalData, getInfo } from '../service/weather-details';
import LineChart from './line-chart';
import * as d3 from 'd3';
import { Button, Card, Divider, Segmented, Select, Space, Spin, Table, Tabs } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getDaysByMonth, months, years } from '../module/data';
import { SegmentedValue } from 'antd/lib/segmented';

const { TabPane } = Tabs;
const { Option } = Select;

const gridStyle: React.CSSProperties = {
    width: '178px',
    textAlign: 'center',
    borderRadius: '10px',
    margin: 5,
    background: 'rgb(235 238 240 / 20%)'
    // display: 'flex',
    // justifyContent: 'center'
};


const columns = [
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
    },
    {
        title: 'Conditions',
        dataIndex: 'Conditions',
        key: 'Conditions',
        render: (item: any) => {

            return <> <img alt='' src={item.img} width="40px" /> <span>  {item.val} </span></>
        }
    },
    {
        title: 'Temp.',
        dataIndex: 'temp',
        key: 'temp',

    },
    {
        title: 'Feels Like',
        dataIndex: 'Feels',
        key: 'Feels',
    },
    {
        title: 'Precip',
        dataIndex: 'Precip',
        key: 'Precip',
    },
    {
        title: 'Cloud Cover',
        dataIndex: 'Cloud',
        key: 'Cloud',
    },
    {
        title: 'Humidity',
        dataIndex: 'Humidity',
        key: 'Humidity',
    },
    {
        title: 'Wind',
        dataIndex: 'wind',
        key: 'wind',
    },
    {
        title: 'Pressure',
        dataIndex: 'Pressure',
        key: 'Pressure',
    },
];




function Dashboard(props: { country: string }) {

    let { city_name } = useParams();
    const [weather, setWeather] = useState<Data>()
    const [hoursData, seHours] = useState<any[]>()
    const [load, setLoad] = useState(false)
    const [chartData, setChartData] = useState<{ history: any[], weekly: Chart[], monthly: any[], weeklyData: Weather[] }>({ history: [], weekly: [], monthly: [], weeklyData: [] })
    const [category, setCategory] = useState<SegmentedValue>("Daily")
    const [date, setDate] = useState({ day: "1", month: "June", year: "2022" })


    console.log(chartData);

    const parseTime = d3.timeParse("%Y-%m-%d");
    // console.log(parseTime("2022-05-31")); // Tue Jun 30 2015 00:00:00 GMT-0700 (PDT)

    useEffect(() => {

        setLoad(true)

        async function getData() {
            let weatherInfo = await getInfo(city_name, props.country, 7)

            if (weatherInfo) {
                setWeather(weatherInfo)

                let _list: any[] = []

                let data = weatherInfo.weather.map(x => x.hourly)
                let date = new Date().toTimeString().split(' ')[0]

                let i = 0;
                let count = 0;
                while (_list.length < 10) {

                    // console.log(_list, Number(data[i][count].time) > Number(date.replace(':', '').substring(0, 4)));
                    if ((Number(data[i][count].time) > Number(date.replace(':', '').substring(0, 4)) && i === 0) || i !== 0) {
                        _list.push({
                            key: Math.random(),
                            time: data[i][count].time === "0" ? "12:00 AM" : moment(data[i][count].time, 'hmm').format('hh:mm A'),
                            Conditions: {
                                img: data[i][count].weatherDesc[0].value === "Sunny" ? "https://clipart.world/wp-content/uploads/2020/09/Bright-sun-png.png" :
                                    data[i][count].weatherDesc[0].value === "Clear" ? "https://www.wunderground.com/static/i/c/v4/31.svg"
                                        : data[i][count].weatherIconUrl[0].value, val: data[i][count].weatherDesc[0].value
                            },
                            temp: data[i][count].tempC + " °C",
                            Feels: `🌡️ ${data[i][count].FeelsLikeC} °C`,
                            Precip: data[i][count].precipInches + ' in',
                            Cloud: '☁ ' + data[i][count].cloudcover + " %",
                            Humidity: data[i][count].humidity + " %",
                            wind: '💨' + data[i][count].windspeedKmph + " km/h",
                            Pressure: data[i][count].precipInches + " in",
                        })
                    }


                    count++;

                    if (count === 8 && _list.length !== 10) {
                        i = 1;
                        count = 0;
                    }
                }

                console.log(_list);

                seHours(_list)

                // chart data 

                let list: any[] = []
                let list2: any[] = []

                let parseTime = d3.timeParse("%Y-%m-%d");

                for (let i = 0; i < weatherInfo.weather.length; i++) {
                    list.push({
                        // date: parseTime(weatherInfo.weather[i].date),
                        date: weatherInfo.weather[i].date,
                        temp: Number(weatherInfo.weather[i].avgtempC)
                    })
                }

                for (let i = 0; i < weatherInfo.ClimateAverages[0].month.length; i++) {
                    list2.push({
                        date: weatherInfo.ClimateAverages[0].month[i].name,
                        temp: Number(weatherInfo.ClimateAverages[0].month[i].absMaxTemp)
                    })
                }

                console.log(list, list2);

                setChartData(prev => {
                    return {
                        ...prev,
                        weekly: list,
                        monthly: list2
                    }
                })

                setLoad(false)
            }
        }

        getData()

    }, [props.country, city_name])


    const handleChange = (value: string, type: string) => {
        if (type === 'month') {
            setDate(prev => {
                return {
                    ...prev,
                    month: value
                }
            })

        } else if (type === 'year') {
            setDate(prev => {
                return {
                    ...prev,
                    year: value
                }
            })

        } else {
            setDate(prev => {
                return {
                    ...prev,
                    day: value
                }
            })
        }
    };


    return (
        <div className='container'>

            <Card >
                <Space style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}>
                    <div>
                        <h3 > {moment().format('dddd hh:mm A')}  </h3>


                        <Space size='middle' style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%', marginTop: 5 }}>

                            <img width={60}
                                src={weather?.current_condition[0].weatherDesc[0].value === "Sunny" ? "https://www.wunderground.com/static/i/c/v4/32.svg" :
                                    weather?.current_condition[0].weatherDesc[0].value === "Clear" ? "https://www.wunderground.com/static/i/c/v4/31.svg"
                                        : weather?.current_condition[0].weatherIconUrl[0].value} alt="" />
                            <span style={{ fontSize: 20, fontWeight: '500' }}> {weather?.weather[0].maxtempC}°C  </span>
                            {/* <span>  {weather?.weather[0].mintempC}°C </span> */}
                            <Divider type='vertical' style={{ height: 60, width: 5 }} className="ant-col ant-col-xs-0 ant-col-sm-0 ant-col-md-2 ant-col-lg-2 ant-col-xl-2" />

                            <div className='dashboard-header ant-col ant-col-xs-0 ant-col-sm-0 ant-col-md-24 ant-col-lg-24 ant-col-xl-24'>

                                <h4> Feel like: {weather?.current_condition[0].FeelsLikeC} °C  </h4>
                                <h4> Humidity: {weather?.current_condition[0].humidity}% </h4>
                                <h4> Wind Speed: {weather?.current_condition[0].windspeedKmph} km/h </h4>
                            </div>
                        </Space>

                    </div>
                    <div>
                        <h1> {weather?.request[0].query} </h1>

                        <Space style={{ marginTop: 10 }}>
                            <div>
                                <h3 style={{ marginBottom: 0 }}> Sunrise  </h3>
                                <span> {weather?.weather[0].astronomy[0].sunrise} </span>
                            </div>

                            <div>
                                <h3 style={{ marginBottom: 0 }}> Sunset  </h3>
                                <span> {weather?.weather[0].astronomy[0].sunset} </span>
                            </div>

                        </Space>
                    </div>

                </Space>

            </Card>


            <div className="card-container">

                <Tabs defaultActiveKey="1" type='card'>

                    <TabPane tab="Hourly" key="1">
                        <h2 style={{ textAlign: 'left', marginTop: 20 }}> Hourly Forecast for Today </h2>

                        <Table dataSource={hoursData} columns={columns} scroll={{ x: true }} />;
                    </TabPane>

                    <TabPane tab="Weekly" key="2">
                        <h2 style={{ textAlign: 'left' }}> Weekly Forecast </h2>

                        {chartData.weekly.length > 0 && <LineChart data={chartData.weekly} type="date" />}

                    </TabPane>

                    <TabPane tab="Monthly" key="3">
                        <h2 style={{ textAlign: 'left' }}> Monthly Forecast </h2>
                        {chartData.monthly.length > 0 && <LineChart data={chartData.monthly} type="Monthly" />}
                    </TabPane>

                    <TabPane tab="History" key="4">

                        <Segmented options={['Daily', 'Weekly', 'Monthly']}
                            onChange={e => {
                                setCategory(e)
                                console.log(e);
                                setChartData(prev => {
                                    return {
                                        ...prev,
                                        history: []
                                    }
                                })

                            }}
                            style={{ marginBottom: 10 }}
                        />
                        <br />
                        <Space wrap>
                            {category !== "Monthly" &&
                                <Select defaultValue="lucy" style={{ width: 120 }}
                                    onChange={e => handleChange(e, 'day')}
                                    options={getDaysByMonth(date.month)}
                                    value={date.day}
                                >
                                </Select>}
                            <Select defaultValue={moment().format('MMMM')} style={{ width: 120 }} onChange={e => handleChange(e, 'month')}
                                options={months}
                                value={date.month}
                            >

                            </Select>
                            <Select defaultValue={'2022'} style={{ width: 120 }} onChange={e => handleChange(e, 'year')}
                                options={years()} value={date.year}
                            >
                            </Select>

                            <Button type="primary" onClick={async () => {

                                setChartData(prev => {
                                    return {
                                        ...prev,
                                        history: []
                                    }
                                })
                                setLoad(true)


                                let monthD = getDaysByMonth(date.month);

                                let start = category === "Monthly" ? moment(`${date.year} ${date.month} 1`, "YYYY MMMM DD").format('yyyy-MM-DD') : moment(`${date.year} ${date.month} ${date.day}`, "YYYY MMMM DD").format('yyyy-MM-DD');

                                let end = category === "Monthly" ? moment(`${date.year} ${date.month} ${monthD[monthD.length - 1].value}`, "YYYY MMMM DD").format('yyyy-MM-DD') :
                                    category === "Daily" ? start : moment(`${date.year} ${date.month} ${date.day}`, "YYYY MMMM DD").add(7, 'days').format('yyyy-MM-DD')


                                let data = await getHistoricalData(city_name ?? "", props.country, start, end)

                                if (data) {
                                    let list: any[] = []

                                    if (category === "Daily") {
                                        for (let i = 0; i < data.weather[0].hourly.length; i++) {
                                            list.push({
                                                humidity: data.weather[0].hourly[i].humidity + "%",
                                                date: data.weather[0].hourly[i].time === "0" ? "12:00 AM" : moment(data.weather[0].hourly[i].time, 'hmm').format('hh:mm A'),
                                                temp: Number(data.weather[0].hourly[i].tempC),
                                                pressure: data.weather[0].hourly[i].pressureInches + " in",
                                                wind: data.weather[0].hourly[i].windspeedKmph + " km/h",

                                            })
                                        }

                                    } else {
                                        for (let i = 0; i < data.weather.length; i++) {
                                            list.push({
                                                date: data.weather[i].date,
                                                temp: Number(data.weather[i].maxtempC)
                                            })
                                        }
                                    }

                                    console.log(list);

                                    setChartData(prev => {
                                        return {
                                            ...prev,
                                            history: list
                                        }
                                    })
                                }

                                setLoad(false)

                            }}> view </Button>

                        </Space>

                        {
                            chartData.history.length > 0 && category === "Daily" ?

                                <Card style={{ background: 'transparent', display: 'flex', justifyContent: 'center', marginTop: 20 }} bordered={false} >

                                    {
                                        chartData.history.map((day, index) => {
                                            if (index !== 0)
                                                return <Card.Grid style={gridStyle} key={index}>
                                                    <h3> {day.date}</h3>
                                                    {/* <img src={day.hourly[5].weatherIconUrl[0].value} alt='' /> */}

                                                    <h2> 🌡️ {day.temp} </h2>
                                                    <h3> 💨 {day.wind}  </h3>
                                                    <h3> 💦 {day.humidity} </h3>
                                                    {/* <p> {day.hourly[5].weatherDesc[0].value} </p> */}
                                                </Card.Grid>
                                        })
                                    }

                                </Card>
                                :
                                chartData.history.length > 0 && <LineChart data={chartData.history} type={"Weekly"} />
                        }




                    </TabPane>
                </Tabs>
            </div>

            <Spin spinning={load}
                indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
            >
            </Spin>
        </div>
    )
}

export default Dashboard