import { Card, Col, Divider, Input, Row, Select, Space, Typography } from 'antd'
import moment from 'moment';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Data } from '../module/response'
import cities from '../module/eg.json';

const { Title } = Typography;
const { Search } = Input;

const gridStyle: React.CSSProperties = {
    width: '175px',
    textAlign: 'center',
    borderRadius: '10px',
    margin: 5,
    background: 'white'
    // display: 'flex',
    // justifyContent: 'center'
};

// const cityStyle: React.CSSProperties = {
//     width: '150px',
//     textAlign: 'center',
//     borderRadius: '10px',
//     margin: 5,
//     cursor: 'pointer',

// };


function Home(props: { weather: Data, data: { country: string, city: string } }) {

    let navigate = useNavigate();
    const [city, setCity] = useState()

    const onSearch = (value: string) => {

        console.log(value);
        //  if (value !== "") navigate(value)
    }

    return (
        <div className='container'>
            <Title level={2}>  Weather Forecast </Title>


            <Select
                showSearch
                placeholder="search by city"
                optionFilterProp="value"

                style={{ width: 360 }}
                onChange={(val: any) => {
                    setCity(val)
                    navigate(val)
                }}
                filterOption={(input, option: any) => {
                    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                options={cities}
                value={city}
            />
            {/* <Search placeholder="search by city" onSearch={onSearch} enterButton style={{ width: 500 }} /> */}




            {/* <Card>
                <Card.Grid style={cityStyle} onClick={() => navigate("Alexandria")}>Alexandria</Card.Grid>
                <Card.Grid style={cityStyle}>Giza</Card.Grid>
                <Card.Grid style={cityStyle}>Port Said</Card.Grid>
                <Card.Grid style={cityStyle}>Asyut</Card.Grid>
                <Card.Grid style={cityStyle}>Luxor</Card.Grid>
            </Card> */}

            {/* <Space style={{ margin: '20px 0' }}>
                <Card hoverable bordered={false} style={{ width: 300, padding: 20, textAlign: 'left', borderRadius: 4 }}>

                    <Space size='large' >
                        <Title level={2}> {props.data.country + ', ' + props.data.city} </Title>
                        <img src={props.weather?.current_condition[0].weatherIconUrl[0].value} alt="" />

                    </Space>

                    <h4 style={{ marginBottom: 40 }}>{moment(new Date()).format('dddd , MMMM DD')}</h4>

                    <h2> {props.weather?.current_condition[0].temp_C} °C </h2>
                    <h3> {props.weather?.current_condition[0].weatherDesc[0].value}</h3>

                </Card>

                <Card hoverable bordered={false} style={{ padding: 20 }}>

                    <Space >
                        <div style={{ width: 200, textAlign: 'left' }}>
                            <h3> Feel like: {props.weather?.current_condition[0].FeelsLikeC} °C  </h3>
                            <h3> Humidity: {props.weather?.current_condition[0].humidity}% </h3>
                            <h3>Air Pressure: {props.weather?.current_condition[0].pressure} mb</h3>
                            <h3>Wind Speed: {props.weather?.current_condition[0].windspeedKmph} km/h </h3>
                           //<p>Max Temp: {props.weather?.weather[0].maxtempC}°C </p>
                          //  <p>Min Temp: {props.weather?.weather[0].mintempC} °C</p> 
                        </div>

                        <Divider type='vertical' style={{ height: 130, width: 5 }} />

                        <div style={{ textAlign: 'left' }} >
                            <h3>Sunrise:  {props.weather?.weather[0].astronomy[0].sunrise}</h3>
                            <h3>Sunset/;  {props.weather?.weather[0].astronomy[0].sunset}</h3>
                            <h3> Moon phase:  {props.weather?.weather[0].astronomy[0].moon_phase}</h3>
                        </div>
                    </Space>


                </Card>
            </Space> */}


            <Row style={{ marginTop: 40, justifyContent: 'center', flexWrap: 'wrap' }} >
                <Col xs={20} md={6} lg={6}>
                    <Card className='main-card' bordered={false} style={{ textAlign: 'left', borderRadius: 10 }}>

                        <Space size='large' >
                            <Title level={2}> {props.data.country + ', ' + props.data.city} </Title>
                            <img src={props.weather?.current_condition[0].weatherIconUrl[0].value} alt="" />

                        </Space>

                        <h3 style={{ marginBottom: 40 }}>{moment(new Date()).format('dddd , MMMM DD')}</h3>

                        <h2> {props.weather?.current_condition[0].temp_C} °C -  {props.weather?.current_condition[0].weatherDesc[0].value} </h2>

                    </Card>
                </Col>
                <Col xs={20} md={10} lg={12} className="d-flex flex-column justify-content-between">
                    <Card bordered={false} style={{ padding: 20, borderRadius: 10 }}>

                        <Space className="ant-row" size='large'>
                            <div style={{ textAlign: 'left' }} className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24">
                                <h3> Feel like: {props.weather?.current_condition[0].FeelsLikeC} °C  </h3>
                                <h3> Humidity: {props.weather?.current_condition[0].humidity}% </h3>
                                <h3>Air Pressure: {props.weather?.current_condition[0].pressure} mb</h3>
                                <h3>Wind Speed: {props.weather?.current_condition[0].windspeedKmph} km/h </h3>

                            </div>

                            <Divider type='vertical' style={{ height: 130, width: 5 }} className="ant-col ant-col-xs-0 ant-col-sm-0 ant-col-md-2 ant-col-lg-2 ant-col-xl-2" />

                            <div style={{ textAlign: 'left' }} className="ant-col ant-col-xs-24 ant-col-sm-24 ant-col-md-24 ant-col-lg-24 ant-col-xl-24">
                                <h3>Sunrise:  {props.weather?.weather[0].astronomy[0].sunrise}</h3>
                                <h3>Sunset/;  {props.weather?.weather[0].astronomy[0].sunset}</h3>
                                <h3> Moon phase:  {props.weather?.weather[0].astronomy[0].moon_phase}</h3>
                            </div>
                        </Space>


                    </Card>

                </Col>
            </Row>

            {/* <Space style={{ margin: '20px 0' }}>
                <Card className='main-card' bordered={false} style={{ width: 300, textAlign: 'left', borderRadius: 10 }}>

                    <Space size='large' >
                        <Title level={1}> {props.data.country + ', ' + props.data.city} </Title>
                        <img src={props.weather?.current_condition[0].weatherIconUrl[0].value} alt="" />

                    </Space>

                    <h3 style={{ marginBottom: 35 }}>{moment(new Date()).format('dddd , MMMM DD')}</h3>

                    <h2> {props.weather?.current_condition[0].temp_C} °C </h2>
                    <h3> {props.weather?.current_condition[0].weatherDesc[0].value}</h3>

                </Card>

                <Card bordered={false} style={{ padding: 30, borderRadius: 10 }}>

                    <Space >
                        <div style={{ width: 200, textAlign: 'left' }}>
                            <h3> Feel like: {props.weather?.current_condition[0].FeelsLikeC} °C  </h3>
                            <h3> Humidity: {props.weather?.current_condition[0].humidity}% </h3>
                            <h3>Air Pressure: {props.weather?.current_condition[0].pressure} mb</h3>
                            <h3>Wind Speed: {props.weather?.current_condition[0].windspeedKmph} km/h </h3>

                        </div>

                        <Divider type='vertical' style={{ height: 130, width: 5 }} />

                        <div style={{ textAlign: 'left' }} >
                            <h3>Sunrise:  {props.weather?.weather[0].astronomy[0].sunrise}</h3>
                            <h3>Sunset/;  {props.weather?.weather[0].astronomy[0].sunset}</h3>
                            <h3> Moon phase:  {props.weather?.weather[0].astronomy[0].moon_phase}</h3>
                        </div>
                    </Space>


                </Card>
            </Space> */}



            {/* </Col> */}

            {/* <Card title="Hourly Forecast" >

                {props.weather &&
                    props.weather.weather[0].hourly.map(day => {

                        let date = new Date().toTimeString().split(' ')[0]
                        console.log(day.time, date.replace(':', '').substring(0, 4));


                        if (Number(day.time) > Number(date.replace(':', '').substring(0, 4))) {

                            return <Card.Grid style={gridStyle}>
                                <h3> {moment(day.time, 'hhmm').format('hh:mm a')} </h3>
                                <h2> {day.tempC} °C </h2>
                                <img src={day.weatherIconUrl[0].value} alt={day.weatherDesc[0].value} />
                                <h4 style={{ marginTop: '10px' }}>  🌧️ {day.chanceofrain} %  </h4>
                            </Card.Grid>
                        }

                    })
                }

            </Card> */}


            <h2 style={{ textAlign: 'left', marginTop: 30 }}> Forecast for the next 5 days </h2>
            <Card style={{ background: 'transparent', display: 'flex', justifyContent: 'center' }} >

                {props.weather &&
                    props.weather.weather.map((day, index) => {
                        if (index !== 0)
                            return <Card.Grid style={gridStyle} key={index}>
                                <h3> {moment(day.date).format('dddd DD')}</h3>
                                <h2> {day.maxtempC + ' / ' + day.mintempC} °C </h2>
                                {/* <p> {day.hourly[5].weatherDesc[0].value} </p>  13 */}
                                <img src={day.hourly[5].weatherIconUrl[0].value} alt='' />
                            </Card.Grid>
                    })
                }

            </Card>
        </div>
    )
}

export default Home