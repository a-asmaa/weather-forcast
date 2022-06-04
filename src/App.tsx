import { Card, Layout, Spin, Typography } from 'antd';
import { useEffect, useState } from 'react';
import './App.css';
import { LoadingOutlined } from '@ant-design/icons';
import { Content } from 'antd/lib/layout/layout';
import { getInfo } from './service/weather-details';
import { Data, initialData } from './module/response';
import Home from './component/home';
import Dashboard from './component/city-dashboard';
import { Route, Routes } from 'react-router-dom';
// import "bootstrap/dist/css/bootstrap.min.css";


function App() {

  const [data, setData] = useState({ city: '', country: '' })
  const [load, setLoad] = useState(false)
  const [weather, setWeather] = useState<Data>()



  useEffect(() => {
    setLoad(true)


    if (navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            console.log(pos);

            const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.lat}&longitude=${pos.lng}&localityLanguage=en`

            fetch(geoApiUrl).then(res => res.json()).then(data => {
              console.log(data)

              setData({ city: data.city, country: data.countryName })

            })

            let weatherInfo = await getInfo(pos.lat, pos.lng, 6)

            if (weatherInfo) setWeather(weatherInfo)

            setLoad(false)
          })


      } catch (error) {
        console.log(error);
        setLoad(false)

      }
    } else {
      // Browser doesn't support Geolocation
      console.log("error");

    }
  }, [])


  return (
    <div className="App">
      <Spin
        spinning={load}
        indicator={<LoadingOutlined style={{ fontSize: 80 }} spin />}
      >
        <Layout style={{ minHeight: "100vh" }}>
          <Content>
            <Routes>
              <Route path="/" element={<Home data={data} weather={weather!} />} />
              <Route path="/:city_name" element={<Dashboard country={data.country} />} />
            </Routes>
          </Content>
        </Layout>
      </Spin>
    </div>
  );
}

export default App;
