import { Client, TextChannel } from 'discord.js';
import cron from 'node-cron';
import fetch from 'node-fetch';
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

export const register = (client: Client, channelId: string, apiKey: string) => {
    cron.schedule('58 7 * * *', async () => {
        console.log('Trying to do weather report');
        const url = `${baseUrl}?apikey=${apiKey}&metric=true`;
        const data = await getWeather(url);
        console.log('Weather data length: ', data.length);
        sendWeather(client, channelId, data);
    });

    console.log('Weather job registered');
}

const getWeather = async (url: string) => {
    const res = await fetch(url);
    const weatherData = await res.json() as IWeatherResponse[];
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
