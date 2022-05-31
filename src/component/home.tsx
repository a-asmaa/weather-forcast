import { Card, Typography } from 'antd'
import moment from 'moment';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Data } from '../module/response'

const { Title } = Typography;

const gridStyle: React.CSSProperties = {
    width: '210px',
    textAlign: 'center',
    borderRadius: '10px',
    margin: 5,
    // display: 'flex',
    // justifyContent: 'center'
};

const cityStyle: React.CSSProperties = {
    width: '150px',
    textAlign: 'center',
    borderRadius: '10px',
    margin: 5,
    cursor: 'pointer',

};

function Home(props: { weather: Data, data: { country: string, city: string } }) {

    let navigate = useNavigate();


    return (
        <>
            <Title level={2}>  Weather Forecast </Title>
            <Title level={3}> {props.data.country + ', ' + props.data.city} </Title>

            <p>
                {props.weather?.current_condition[0].temp_C} °C -
                {props.weather?.current_condition[0].weatherDesc[0].value}
                <img src={props.weather?.current_condition[0].weatherIconUrl[0].value} alt="" />
            </p>




            <Card>
                <Card.Grid style={cityStyle} onClick={() => navigate("Alexandria")}>Alexandria</Card.Grid>
                <Card.Grid style={cityStyle}>Giza</Card.Grid>
                <Card.Grid style={cityStyle}>Port Said</Card.Grid>
                <Card.Grid style={cityStyle}>Asyut</Card.Grid>
                <Card.Grid style={cityStyle}>Luxor</Card.Grid>
            </Card>

            <Card hoverable title={new Date().toDateString()} bordered={false} style={{ width: 300, padding: 20 }}>
                <p>Humidity: {props.weather?.current_condition[0].humidity}</p>
                <p>Pressure: {props.weather?.current_condition[0].humidity}</p>
                <p>Wind Speed: {props.weather?.current_condition[0].windspeedKmph} </p>
                <p>Sunrise:  {props.weather?.weather[0].astronomy[0].sunrise}</p>
                <p>Sunset/;  {props.weather?.weather[0].astronomy[0].sunset}</p>
            </Card>



            <Card title="Hourly Forecast" >

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

            </Card>


            <Card title="Forecast for the next 5 days" >

                {props.weather &&
                    props.weather.weather.map(day => {
                        return <Card.Grid style={gridStyle}>
                            <h3> {moment(day.date).format('dddd DD')}</h3>
                            <h2> {day.maxtempC + ' / ' + day.mintempC} °C </h2>
                            <p> {day.date} </p>

                        </Card.Grid>
                    })
                }

            </Card>
        </>
    )
}

export default Home