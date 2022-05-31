import { Data } from "../module/response";

export const getInfo = async (lat: any, lng: any): Promise<Data | null> => {

    let data: Data | null = null;

    await fetch(`http://api.worldweatheronline.com/premium/v1/weather.ashx?key=c8288bb8ea1f4fc59e1191916222605&q=${lat},${lng}&tp=1&format=JSON&num_of_days=15`,
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

