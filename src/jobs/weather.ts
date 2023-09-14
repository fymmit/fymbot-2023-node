import { Client, TextChannel } from 'discord.js';
import cron from 'node-cron';
import { timestamp } from '../utils/datetimeUtils.js';

const baseUrl = 'https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/134768';

interface ITemperature {
    Value: number;
    Unit: string;
}

interface IWeatherResponse {
    DateTime: Date;
    EpochDateTime: number;
    IconPhrase: string;
    HasPrecipitation: boolean;
    Temperature: ITemperature;
    PrecipitationProbability: number;
}

export const register = async (client: Client, channelId: string, apiKey: string) => {
    cron.schedule('0 8 * * *', async () => {
        const url = `${baseUrl}?apikey=${apiKey}&metric=true`;
        const data = await getWeather(url);
        sendWeather(client, channelId, data);
    });
}

const getWeather = async (url: string) => {
    const res = await fetch(url);
    const weatherData: IWeatherResponse[] = await res.json();
    return weatherData;
}

const sendWeather = async (client: Client | null, channelId: string, weatherData: IWeatherResponse[]) => {
    const channel = client.channels.cache.get(channelId) as TextChannel;

    const prettyData = weatherData
    .map(w => {
        const hours = `${timestamp(false, w.DateTime)}`;
        return `${hours}: ${w.Temperature.Value}°${w.Temperature.Unit} | ${w.IconPhrase} | ${w.PrecipitationProbability}%`;
    })
    .join('\n');
    const content = `\`\`\`${prettyData}\`\`\``;
    channel.send(content);
}


export const dummyData = JSON.parse(`[
    {
        "DateTime": "2023-09-13T16:00:00+03:00",
        "EpochDateTime": 1694610000,
        "WeatherIcon": 2,
        "IconPhrase": "Mostly sunny",
        "HasPrecipitation": false,
        "IsDaylight": true,
        "Temperature": {
            "Value": 18.1,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 19,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=16&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=16&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-13T17:00:00+03:00",
        "EpochDateTime": 1694613600,
        "WeatherIcon": 6,
        "IconPhrase": "Mostly cloudy",
        "HasPrecipitation": false,
        "IsDaylight": true,
        "Temperature": {
            "Value": 18.7,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 37,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=17&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=17&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-13T18:00:00+03:00",
        "EpochDateTime": 1694617200,
        "WeatherIcon": 12,
        "IconPhrase": "Showers",
        "HasPrecipitation": true,
        "PrecipitationType": "Rain",
        "PrecipitationIntensity": "Light",
        "IsDaylight": true,
        "Temperature": {
            "Value": 17.4,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 40,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=18&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=18&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-13T19:00:00+03:00",
        "EpochDateTime": 1694620800,
        "WeatherIcon": 7,
        "IconPhrase": "Cloudy",
        "HasPrecipitation": false,
        "IsDaylight": true,
        "Temperature": {
            "Value": 16.5,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 38,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=19&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=19&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-13T20:00:00+03:00",
        "EpochDateTime": 1694624400,
        "WeatherIcon": 18,
        "IconPhrase": "Rain",
        "HasPrecipitation": true,
        "PrecipitationType": "Rain",
        "PrecipitationIntensity": "Light",
        "IsDaylight": true,
        "Temperature": {
            "Value": 15.1,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 62,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=20&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=20&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-13T21:00:00+03:00",
        "EpochDateTime": 1694628000,
        "WeatherIcon": 7,
        "IconPhrase": "Cloudy",
        "HasPrecipitation": false,
        "IsDaylight": false,
        "Temperature": {
            "Value": 13.8,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 49,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=21&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=21&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-13T22:00:00+03:00",
        "EpochDateTime": 1694631600,
        "WeatherIcon": 18,
        "IconPhrase": "Rain",
        "HasPrecipitation": true,
        "PrecipitationType": "Rain",
        "PrecipitationIntensity": "Light",
        "IsDaylight": false,
        "Temperature": {
            "Value": 12.9,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 62,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=22&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=22&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-13T23:00:00+03:00",
        "EpochDateTime": 1694635200,
        "WeatherIcon": 18,
        "IconPhrase": "Rain",
        "HasPrecipitation": true,
        "PrecipitationType": "Rain",
        "PrecipitationIntensity": "Light",
        "IsDaylight": false,
        "Temperature": {
            "Value": 12.4,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 66,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=23&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=1&hbhhour=23&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-14T00:00:00+03:00",
        "EpochDateTime": 1694638800,
        "WeatherIcon": 18,
        "IconPhrase": "Rain",
        "HasPrecipitation": true,
        "PrecipitationType": "Rain",
        "PrecipitationIntensity": "Light",
        "IsDaylight": false,
        "Temperature": {
            "Value": 11.7,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 66,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=2&hbhhour=0&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=2&hbhhour=0&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-14T01:00:00+03:00",
        "EpochDateTime": 1694642400,
        "WeatherIcon": 7,
        "IconPhrase": "Cloudy",
        "HasPrecipitation": false,
        "IsDaylight": false,
        "Temperature": {
            "Value": 11.3,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 49,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=2&hbhhour=1&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=2&hbhhour=1&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-14T02:00:00+03:00",
        "EpochDateTime": 1694646000,
        "WeatherIcon": 7,
        "IconPhrase": "Cloudy",
        "HasPrecipitation": false,
        "IsDaylight": false,
        "Temperature": {
            "Value": 11.2,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 0,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=2&hbhhour=2&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=2&hbhhour=2&unit=c&lang=en-us"
    },
    {
        "DateTime": "2023-09-14T03:00:00+03:00",
        "EpochDateTime": 1694649600,
        "WeatherIcon": 7,
        "IconPhrase": "Cloudy",
        "HasPrecipitation": false,
        "IsDaylight": false,
        "Temperature": {
            "Value": 11.2,
            "Unit": "C",
            "UnitType": 17
        },
        "PrecipitationProbability": 0,
        "MobileLink": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=2&hbhhour=3&unit=c&lang=en-us",
        "Link": "http://www.accuweather.com/en/fi/turku/134768/hourly-weather-forecast/134768?day=2&hbhhour=3&unit=c&lang=en-us"
    }
]`);