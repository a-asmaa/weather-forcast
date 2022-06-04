import { message } from "antd";
import { Data } from "../module/response";

export const getInfo = async (lat: any, lng: any, days: number): Promise<Data | null> => {

    let data: Data | null = null;

    await fetch(`https://api.worldweatheronline.com/premium/v1/weather.ashx?key=c8288bb8ea1f4fc59e1191916222605&q=${lat},${lng}&tp=3&format=JSON&showmap=yes&num_of_days=${days}`,
        {
            method: 'GET'
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            data = result.data
        })
        .catch(error => console.log('error', error));

    return data
}



export const getHistoricalData = async (city: string, country: string, startDate: string, endDate: string): Promise<Data | null> => {

    let data: Data | null = null;

    await fetch(`https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=c8288bb8ea1f4fc59e1191916222605&format=JSON&q=${city},${country}&date=${startDate}&enddate=${endDate}`,
        {
            method: 'GET'
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)

            if (result.data.error) {
                message.error(result.data.error[0].msg);
            } else {
                data = result.data
            }
        })
        .catch(error => console.log('error', error));

    return data
}

