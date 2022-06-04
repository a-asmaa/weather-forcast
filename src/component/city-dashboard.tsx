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
                                img: data[i][count].weatherDesc[0].value === "Sunny" ? "https://www.wunderground.com/static/i/c/v4/32.svg" :
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

                        {/* <h3> Humidity: {weather?.current_condition[0].humidity}% </h3> */}
                        <br />
                        {/* <Space style={{ marginTop: 20 }}>
                            <div>
                                <h3 style={{ marginBottom: 0 }}> Sunrise  </h3>
                                <span> {weather?.weather[0].astronomy[0].sunrise} </span>
                            </div>

                            <div>
                                <h3 style={{ marginBottom: 0 }}> Sunset  </h3>
                                <span> {weather?.weather[0].astronomy[0].sunset} </span>
                            </div>

                        </Space> */}
                    </div>
                    <div>
                        <h1> {weather?.request[0].query} </h1>

                        {/* <img src={weather?.current_condition[0].weatherIconUrl[0].value} alt="" />
                        <h4 style={{ textAlign: 'center' }}> {weather?.current_condition[0].weatherDesc[0].value}</h4> */}
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


            {/* <h2 style={{ textAlign: 'left', marginTop: 20 }}> Hourly Forecast </h2>
            <Card style={{ marginTop: 20 }} >

                {hoursData &&
                    hoursData.slice(0, 6).map((day: Hourly) => {

                        return <Card.Grid style={gridStyle}>
                            <h3> {moment(day.time, 'hmm').format('hh:mm A')} </h3>
                            <img src={day.weatherIconUrl[0].value} alt={day.weatherDesc[0].value} style={{ marginBottom: 10 }} />
                            <h2> {day.tempC} °C </h2>

                           // <h4 style={{ marginTop: '10px' }}>  🌧️ {day.chanceofrain} %  </h4>
                        </Card.Grid>
                    })
                }

            </Card> */}

            <div className="card-container">

                <Tabs defaultActiveKey="1" type='card'>

                    <TabPane tab="Hourly" key="1">
                        <h2 style={{ textAlign: 'left', marginTop: 20 }}> Hourly Forecast for Today </h2>

                        {/* <Space style={{ margin: '20px 0', gap: 50, alignItems: 'start' }} >
                            <Space size={'large'}>
                                <span style={{ fontSize: 30 }}>   </span>
                                <div>
                                    <h2 style={{ marginBottom: 5 }}> Sun  </h2>

                                    <Space style={{ marginRight: 10 }}>
                                        <svg className="Icon--icon--3wCKh SunriseSunset--sunIcon--TG205" name="sunrise-line" data-testid="Icon" aria-hidden="true" role="img" viewBox="0 0 24 24"><title>Sun Rise</title><path d="M10.862 6.052v5.329a.75.75 0 0 0 1.5 0V6.036l1.772 1.534a.75.75 0 0 0 .982-1.134l-3.003-2.601a.75.75 0 0 0-.982 0L8.128 6.436A.75.75 0 0 0 9.11 7.57l1.752-1.518zM21 19.128a.75.75 0 0 0 0-1.5H3.167a.75.75 0 1 0 0 1.5H21z"></path></svg>
                                        <span>{weather?.weather[0].astronomy[0].sunrise} </span>
                                    </Space>
                                    <Space>
                                        <svg className="Icon--icon--3wCKh SunriseSunset--sunIcon--TG205" name="sunset-line" data-testid="Icon" aria-hidden="true" role="img" viewBox="0 0 24 24"><title>Sunset</title><path d="M10.862 9.853L9.044 8.278a.75.75 0 1 0-.982 1.134l3.003 2.602a.75.75 0 0 0 .982 0l3.004-2.602a.75.75 0 0 0-.983-1.134l-1.706 1.478V4a.75.75 0 0 0-1.5 0v5.853zM21 19.075a.75.75 0 1 0 0-1.5H3.167a.75.75 0 1 0 0 1.5H21z"></path></svg>
                                        <span>{weather?.weather[0].astronomy[0].sunset} </span>
                                    </Space>
                                </div>
                            </Space>

                            <Space size={'large'}>
                                <span style={{ fontSize: 30 }}> 🌑️  </span>
                                <div>
                                    <h2 style={{ marginBottom: 0 }}> Moon  </h2>

                                    <Space style={{ marginRight: 10 }}>
                                        <svg className="Icon--icon--3wCKh moon" name="sunrise-line" data-testid="Icon" aria-hidden="true" role="img" viewBox="0 0 24 24"><title>Sun Rise</title><path d="M10.862 6.052v5.329a.75.75 0 0 0 1.5 0V6.036l1.772 1.534a.75.75 0 0 0 .982-1.134l-3.003-2.601a.75.75 0 0 0-.982 0L8.128 6.436A.75.75 0 0 0 9.11 7.57l1.752-1.518zM21 19.128a.75.75 0 0 0 0-1.5H3.167a.75.75 0 1 0 0 1.5H21z"></path></svg>
                                        <span>{weather?.weather[0].astronomy[0].moonrise} </span>
                                    </Space>
                                    <Space>
                                        <svg className="Icon--icon--3wCKh moon" name="sunset-line" data-testid="Icon" aria-hidden="true" role="img" viewBox="0 0 24 24"><title>Sunset</title><path d="M10.862 9.853L9.044 8.278a.75.75 0 1 0-.982 1.134l3.003 2.602a.75.75 0 0 0 .982 0l3.004-2.602a.75.75 0 0 0-.983-1.134l-1.706 1.478V4a.75.75 0 0 0-1.5 0v5.853zM21 19.075a.75.75 0 1 0 0-1.5H3.167a.75.75 0 1 0 0 1.5H21z"></path></svg>
                                        <span>{weather?.weather[0].astronomy[0].moonset} </span>


                                    </Space>
                                    <br />
                                    <span>{weather?.weather[0].astronomy[0].moon_phase} </span>
                                </div>
                            </Space>

                        </Space> */}

                        <Table dataSource={hoursData} columns={columns} scroll={{ x: true }} />;
                    </TabPane>

                    <TabPane tab="Weekly" key="2">
                        <h2 style={{ textAlign: 'left' }}> Weekly Forecast </h2>

                        {chartData.weekly.length > 0 && <LineChart data={chartData.weekly} type="date" />}
                        {/* <div className='divide-content'>
                        

                        <div>
                            <h3> Feel like: {chartData.weeklyData[0].maxtempC} {chartData.weeklyData[0].mintempC} °C  </h3>
                            <h3> Humidity: {chartData.weeklyData[0].humidity}% </h3>
                            <h3>Air Pressure: {props.weather?.current_condition[0].pressure} mb</h3>
                            <h3>Wind Speed: {props.weather?.current_condition[0].windspeedKmph} km/h </h3> 
    
                        </div>
                    </div> */}


                    </TabPane>

                    <TabPane tab="Monthly" key="3">
                        <h2 style={{ textAlign: 'left' }}> Monthly Forecast </h2>
                        {chartData.monthly.length > 0 && <LineChart data={chartData.monthly} type="Monthly" />}
                    </TabPane>

                    <TabPane tab="Historically" key="4">

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
                        <Space>
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
                                                date: data.weather[0].hourly[i].time === "0" ? "000" : data.weather[0].hourly[i].time,
                                                temp: Number(data.weather[0].hourly[i].tempC)
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

                        {chartData.history.length > 0 && <LineChart data={chartData.history} type={category === "Daily" ? "Daily" : "Weekly"} />}

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