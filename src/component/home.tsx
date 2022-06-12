import { Card, Col, Divider, Row, Select, Space, Typography } from 'antd'
import moment from 'moment';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Data } from '../module/response'
import cities from '../module/eg.json';

const { Title } = Typography;

const gridStyle: React.CSSProperties = {
    width: '175px',
    textAlign: 'center',
    borderRadius: '10px',
    margin: 5,
    background: 'white'
};



function Home(props: { weather: Data, data: { country: string, city: string } }) {

    let navigate = useNavigate();
    const [city, setCity] = useState()

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


            <Row style={{ marginTop: 40, justifyContent: 'center', flexWrap: 'wrap' }} >
                <Col xs={20} md={8} lg={8} xl={8}>
                    <Card className='main-card' bordered={false} style={{ textAlign: 'left', borderRadius: 10 }}>

                        <Space size='large' >
                            <Title level={2}> {props.data.country + ', ' + props.data.city} </Title>
                            <img width={55} src={
                                props.weather?.current_condition[0].weatherDesc[0].value === "Sunny" ? "https://clipart.world/wp-content/uploads/2020/09/Bright-sun-png.png" :
                                    props.weather?.current_condition[0].weatherIconUrl[0].value} alt="" />

                        </Space>

                        <h3 style={{ marginBottom: 40 }}>{moment(new Date()).format('dddd , MMMM DD')}</h3>

                        <h2> {props.weather?.current_condition[0].temp_C} °C -  {props.weather?.current_condition[0].weatherDesc[0].value} </h2>

                    </Card>
                </Col>
                <Col xs={20} md={16} lg={14} xl={12} className="d-flex flex-column justify-content-between">
                    <Card bordered={false} style={{ padding: 14, borderRadius: 10 }}>

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

            <Card style={{ background: 'transparent', display: 'flex', justifyContent: 'center' }} >
                <h2 style={{ textAlign: 'left', marginTop: 30 }}> Forecast for the next 5 days </h2>

                {props.weather &&
                    props.weather.weather.map((day, index) => {
                        if (index !== 0)
                            return <Card.Grid style={gridStyle} key={index}>
                                <h3> {moment(day.date).format('dddd DD')}</h3>
                                <img width='70' src={
                                    day.hourly[5].weatherDesc[0].value === "Sunny" ? "https://clipart.world/wp-content/uploads/2020/09/Bright-sun-png.png" :
                                        day.hourly[5].weatherDesc[0].value === "Clear" ? "https://www.wunderground.com/static/i/c/v4/31.svg" :
                                            day.hourly[5].weatherIconUrl[0].value} alt='' />

                                <h2> {day.maxtempC + ' / ' + day.mintempC} °C </h2>
                                {/* <p> {day.hourly[5].weatherDesc[0].value} </p>  13 */}
                            </Card.Grid>
                    })
                }

            </Card>
        </div>
    )
}

export default Home